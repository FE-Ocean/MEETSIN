import { Socket } from "socket.io-client";
import { MeetsInPhaserScene } from "../phaserScene";
import { PlayerInfo, RoomInfo, SyncInfo } from "@/types/phaser.type";

export class SocketManager {
    private socket: Socket;
    private scene: MeetsInPhaserScene;
    private roomId: string;

    constructor(socket: Socket, scene: MeetsInPhaserScene, roomId: string) {
        this.socket = socket;
        this.scene = scene;
        this.roomId = roomId;
    }

    setupSocketEvents(): void {
        // 방 입장
        this.socket.emit("join_phaser_room", this.roomId);

        // 방 정보 수신
        this.socket.on("roomInfo", (roomInfo: RoomInfo) => {
            const { players } = roomInfo;
            Object.entries(players).forEach(([id, playerInfo]) => {
                id === this.socket.id
                    ? this.scene.playerManager.addCurrentPlayer(playerInfo)
                    : this.scene.playerManager.addOtherPlayer(playerInfo);
            });
        });

        // 새로운 플레이어 입장
        this.socket.on("newPlayer", ({ playerInfo }: { playerInfo: PlayerInfo }) => {
            this.scene.playerManager.addOtherPlayer(playerInfo);
        });

        // 플레이어 이동
        this.socket.on("move", (info: SyncInfo) => {
            this.scene.playerManager.syncPlayerPosition(info);
        });

        // 플레이어 정지
        this.socket.on("stop", (info: { playerId: string }) => {
            this.scene.playerManager.stopPlayer(info.playerId);
        });

        // 플레이어 퇴장
        this.socket.on("userDisconnected", (info: { user: { userId: string } }) => {
            this.scene.playerManager.removePlayer(info.user.userId);
        });
    }

    // 플레이어 이동 이벤트 발신
    emitMove(syncInfo: SyncInfo): void {
        this.socket.emit("move", syncInfo);
    }

    // 플레이어 정지 이벤트 발신
    emitStop({ roomId }: { roomId: string }): void {
        this.socket.emit("stop", { roomId });
    }
}
