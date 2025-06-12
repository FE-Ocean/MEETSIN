"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { useParams } from "next/navigation";
import { notFound } from "next/navigation";
import { useAtomValue } from "jotai";
import { screenShareStateAtom } from "@/jotai/atom";
import { ScreenShareState } from "@/types/peer.type";
import { useScreenShare } from "@/app/room/[roomId]/hooks/useScreenShare";
import { useGetRoomData } from "@/apis/service/room.service";
import Chat from "@/components/chat/chat";
import Menu from "@/components/menu/menu";
import RoomGradientBackground from "@/components/background/room/roomGradientBackground";
import ScreenWindow from "@/components/screen/window/screenWindow";
import Skeleton from "@/components/common/skeleton/skeleton";
import ViewSwitchButton from "@/components/buttons/viewSwitch/viewSwitchButton";
import useChatSocket from "@/app/room/[roomId]/hooks/useChatSocket";
import { useScreenShare } from "@/app/room/[roomId]/hooks/useScreenShare";
import { ScreenShareState } from "@/types/peer.type";
import { useGetRoomData } from "@/apis/service/room.service";
import style from "@/app/room/[roomId]/style.module.scss";


const PhaserMap = dynamic(() => import("../phaser/map/map"), {
    ssr: false,
    loading: () => <Skeleton />,
});

const RoomContent = () => {
    const screenShareState = useAtomValue(screenShareStateAtom);

    const [chatOpen, setChatOpen] = useState<boolean>(true);
    const [isMeetingView, setMeetingView] = useState<boolean>(false);

    const params = useParams();
    const roomId = params.roomId as string;
    const { data, isError } = useGetRoomData(roomId);

    const { roomUsers, messages } = useChatSocket({ roomId });
    const { currentPeers, startScreenShare, stopScreenShare, setPeerId, setCurrentPeers } =
        useScreenShare(roomId);

    if (isError) {
        notFound();
    }

    const toggleChat = (shouldClose?: boolean) => {
        setChatOpen((prev) => (shouldClose ? false : !prev));
    };

    const toggleView = () => {
        setMeetingView(!isMeetingView);
    };

    const handleScreenShare = () => {
        screenShareState === ScreenShareState.SELF_SHARING ? stopScreenShare() : startScreenShare();
    };

    const isScreenSharing = useMemo(() => {
        return screenShareState !== ScreenShareState.NOT_SHARING;
    }, [screenShareState]);

    useEffect(() => {
        if (screenShareState === ScreenShareState.SELF_SHARING) {
            setMeetingView(true);
        } else if (screenShareState === ScreenShareState.NOT_SHARING) {
            setMeetingView(false);
        }
    }, [screenShareState]);

    useEffect(() => {
        if (roomUsers.length !== 0) {
            const tempPeers = new Map();
            roomUsers.forEach((user) => {
                tempPeers.set(setPeerId(user.userId), {
                    user,
                    peerId: setPeerId(user.userId),
                    stream: undefined,
                    connection: undefined,
                });
            });
            setCurrentPeers(tempPeers);
        }
    }, [roomUsers, setCurrentPeers, setPeerId]);

    // unmount 시 화면 공유 중지 및 모든 연결 해제
    useEffect(() => {
        return () => {
            stopScreenShare();
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <main className={style.main}>
            <RoomGradientBackground className={style.gradient_background} />
            <div className={style.container}>
                <ViewSwitchButton
                    className={style.switch}
                    disabled={!isScreenSharing}
                    isMeetingView={isMeetingView}
                    onClick={toggleView}
                />
                <div className={style.map_container}>
                    <PhaserMap />
                    {isMeetingView && (
                        <ScreenWindow peerList={currentPeers} className={style.screen} />
                    )}
                </div>
                {chatOpen && (
                    <Chat
                        messages={messages}
                        className={style.chat}
                        toggleChat={toggleChat}
                        roomTitle={data?.roomName ?? ""}
                    />
                )}
            </div>
            <Menu
                className={style.menu}
                onScreenShare={handleScreenShare}
                toggleChat={toggleChat}
                roomUsers={roomUsers}
            />
        </main>
    );
};

export default RoomContent;
