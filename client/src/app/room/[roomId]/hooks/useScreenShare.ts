import { useGetUserInfo } from "@/apis/service/user.service";
import { screenShareStateAtom } from "@/jotai/atom";
import { IPeer, IScreenShareState } from "@/types/peer.type";
import { useAtom } from "jotai";
import Peer from "peerjs";
import { useEffect, useRef, useState, useCallback, useMemo } from "react";

export const useScreenShare = (roomId: string) => {
    const [currentPeers, setCurrentPeers] = useState<Map<string, IPeer>>(new Map());
    const peerRef = useRef<Peer | null>(null);
    const displayStreamRef = useRef<MediaStream | null>(null);

    const { data: user } = useGetUserInfo();
    const [screenShareState, setScreenShareState] = useAtom(screenShareStateAtom);

    const updatePeers = useCallback(
        (key: string, value: IPeer) => {
            const tempPeerMap = new Map(currentPeers);
            tempPeerMap.set(key, value);
            setCurrentPeers(tempPeerMap);
        },
        [currentPeers],
    );

    // 피어 아이디 중복 방지를 위함
    const setPeerId = useCallback(
        (userId: string) => {
            return `meetsin${roomId}${userId}`;
        },
        [roomId],
    );

    // 피어는 한 번만 생성하고, 컴포넌트가 언마운트되면 제거
    useEffect(() => {
        if (!user || peerRef.current) return; // 피어가 이미 있으면 실행하지 않음

        const myPeerId = setPeerId(user.userId);
        const newPeer = new Peer(myPeerId, {
            debug: 3,
        });
        console.log("피어 생성:", newPeer.id);
        peerRef.current = newPeer;

        // 피어 연결 해제 시 처리
        newPeer.on("disconnected", () => {
            console.log("피어 연결 해제");
        });

        // 피어 생성 후 에러 처리
        newPeer.on("error", (err) => {
            console.error("피어 연결 에러:", err);
            if (err.type === "unavailable-id") {
                newPeer.destroy(); // 기존 피어 제거
                const tempPeer = new Peer(setPeerId(user.userId + "-" + new Date().getTime())); // 새로운 피어 생성
                peerRef.current = tempPeer;
                console.log("새로운 피어로 재시도 중...");
            }
        });

        // 컴포넌트가 언마운트될 때 피어 제거
        return () => {
            newPeer.destroy();
            console.log("컴포넌트가 언마운트되어 피어 제거됨");
        };
    }, [setPeerId, user]); // 의존성 배열에서 peer 제거

    useEffect(() => {
        if (!peerRef.current || !user) return;
        const peer = peerRef.current;
        const myPeerId = setPeerId(user.userId);

        peer.on("open", (id) => {
            console.log("내 피어 아이디: " + id);
        });

        peer.on("connection", (connection) => {
            connection.on("data", (data) => {
                const peerData = currentPeers.get(connection.peer);
                if (!peerData) return;

                peerData.connection = connection;
                console.log(data.type);
                switch (data.type) {
                    case "start-screen-share":
                        // isscreenshare update?
                        break;
                    case "stop-screen-share":
                        peerData.stream = undefined;
                    case "request-screen-share":
                        const myPeer = currentPeers.get(myPeerId);
                        if (myPeer && myPeer.stream) {
                            peer.call(connection.peer, myPeer.stream);
                        }
                    default:
                        updatePeers(connection.peer, peerData);
                        break;
                }
            });
        });

        peer.on("call", (mediaConnection) => {
            mediaConnection.answer();
            mediaConnection.on("stream", (remoteStream) => {
                const peerData = currentPeers.get(mediaConnection.peer);
                if (peerData) {
                    peerData.stream = remoteStream;
                    updatePeers(mediaConnection.peer, peerData);
                }
            });
        });

        return () => {
            peer.removeAllListeners(); // 이벤트 핸들러를 제거하여 메모리 누수 방지
        };
    }, [currentPeers, setPeerId, updatePeers, user]);

    // 나 포함 한 명이라도 화면 공유 중인지 상태
    const isSomeoneSharing = useMemo(() => {
        return Array.from(currentPeers.values()).some((peer) => {
            return peer.stream;
        });
    }, [currentPeers]);
    useEffect(() => {
        console.log(screenShareState);

        if (screenShareState !== IScreenShareState.SELF_SHARING) {
            if (isSomeoneSharing) {
                setScreenShareState(IScreenShareState.SOMEONE_SHARING);
            } else {
                setScreenShareState(IScreenShareState.NOT_SHARING);
            }
        }
    }, [currentPeers, isSomeoneSharing, screenShareState, setScreenShareState]);

    // 화면 공유 시작 메서드
    const startScreenShare = async () => {
        try {
            if (!user) {
                throw new Error("user not found");
            }
            console.log(currentPeers);
            // 화면 공유 스트림 받아오기
            const mediaStream = await navigator.mediaDevices.getDisplayMedia({
                video: {
                    width: { ideal: 9999 },
                    aspectRatio: 1920 / 1280,
                },
            });

            // ref에 스트림 저장
            displayStreamRef.current = mediaStream;

            // 스트림이 종료되면 화면 공유 중지
            mediaStream.getTracks().forEach((track) => {
                track.onended = () => {
                    stopScreenShare();
                };
            });

            setScreenShareState(IScreenShareState.SELF_SHARING);
            // 방에 있는 사람들에게 연결
            currentPeers.forEach((p) => {
                if (!peerRef.current) {
                    throw new Error("peer not found");
                }
                const peerData = currentPeers.get(p.peerId);
                if (p.peerId === setPeerId(user.userId) && peerData) {
                    peerData.stream = mediaStream;
                    updatePeers(p.peerId, peerData);
                } else {
                    const call = peerRef.current.call(p.peerId, mediaStream);
                    if (!call) {
                        console.error("해당 사용자와의 콜 실패:", p);
                        return;
                    }

                    // 다른 피어의 스트림을 받았을 때
                    call.on("stream", (remoteStream) => {
                        console.log("다른 사용자의 스트림 받음:", remoteStream);
                        if (peerData) {
                            peerData.stream = remoteStream;
                            updatePeers(p.peerId, peerData);
                        }
                    });

                    // 콜이 끊겼을 때
                    call.on("close", () => {
                        console.log("콜 종료:", p);
                        if (peerData) {
                            peerData.stream = undefined;
                            updatePeers(p.peerId, peerData);
                        }
                    });
                    call.on("error", (error) => {
                        console.error("콜 에러:", p, error);
                    });

                    const connection = peerRef.current.connect(p.peerId);

                    // 다른 피어와의 연결 생성 시
                    connection.on("open", () => {
                        console.log("해당 피어와의 연결 생성:", p.peerId);
                        if (peerData) {
                            peerData.connection = connection;
                            updatePeers(p.peerId, peerData);
                        }
                        // 내 화면 공유 시작했음을 전송
                        // TODO: 내 화면 공유 중인 상태는 isMyScreenShare로 구분하고 있으므로 쓸모없다면 삭제
                        connection.send({ type: "start-screen-share" });
                        // 다른 피어가 이미 화면 공유 중인 경우 그걸 가져오기 위하여 요청 전송
                        connection.send({ type: "request-screen-share" });
                    });

                    // 다른 피어에서 데이터 전송 받을 시
                    connection.on("data", (data) => {
                        // 다른 피어가 화면 공유를 종료 시
                        if (data.type === "stop-screen-share") {
                            if (peerData) {
                                peerData.stream = undefined;
                                updatePeers(p.peerId, peerData);
                            }
                        }
                    });
                }
            });
        } catch (error) {
            console.error("화면 공유 에러:", error);
        }
    };

    // 화면 공유 중지 메서드
    const stopScreenShare = () => {
        if (!user || !peerRef.current) {
            return;
        }

        try {
            // displayStreamRef에서 스트림을 가져와 직접 종료
            if (displayStreamRef.current) {
                displayStreamRef.current.getTracks().forEach((track) => {
                    track.enabled = false;
                    track.stop();
                });
                displayStreamRef.current = null;
            }

            const myPeerId = setPeerId(user.userId);

            currentPeers.forEach((peerData, peerId) => {
                if (peerData.connection) {
                    try {
                        peerData.connection.send({ type: "stop-screen-share" });
                    } catch (err) {
                        console.error("화면 공유 중단 메시지 전송 에러:", err);
                    }
                }

                if (peerId === myPeerId && peerData.stream) {
                    try {
                        peerData.stream.getTracks().forEach((track) => {
                            track.enabled = false;
                            track.stop();
                        });
                        peerData.stream = undefined;
                    } catch (err) {
                        console.error("스트림 트랙 중단 에러:", err);
                    }
                }

                updatePeers(peerId, { ...peerData, stream: undefined });
            });

            setScreenShareState(IScreenShareState.NOT_SHARING);
        } catch (error) {
            console.error("화면 공유 중단 에러:", error);
        }
    };

    return {
        currentPeers,
        setCurrentPeers,
        startScreenShare,
        stopScreenShare,
        setPeerId,
    };
};
