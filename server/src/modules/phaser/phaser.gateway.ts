import { Logger } from "@nestjs/common";
import {
    SubscribeMessage,
    WebSocketGateway,
    OnGatewayConnection,
    ConnectedSocket,
    OnGatewayInit,
    OnGatewayDisconnect,
    MessageBody,
    WebSocketServer,
} from "@nestjs/websockets";
import { Server, Socket } from "socket.io";
import { MoveInfoDto, StopPlayerInfoDto } from "src/modules/phaser/dto/phaser.dto";

@WebSocketGateway({
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
    namespace: "phaser",
})
export class PhaserGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
    private logger = new Logger("phaser");
    private gameRooms = {};
    private socketRoomMap: Map<string, string>;

    private roomCharacters: Map<string, Set<number>>;

    constructor() {
        this.socketRoomMap = new Map<string, string>();
        this.roomCharacters = new Map<string, Set<number>>();
    }

    // 사용 가능한 캐릭터 ID 가져오기
    private getAvailableCharacterId(roomId: string): number {
        const usedCharacters = this.roomCharacters.get(roomId) || new Set<number>();
        for (let i = 1; i <= 6; i++) {
            if (!usedCharacters.has(i)) {
                return i;
            }
        }
        return 1; // 모든 캐릭터가 사용 중인 경우 1 반환
    }

    @WebSocketServer() server: Server;

    afterInit(server: any) {
        this.logger.log("phaser Init");
    }

    handleConnection(@ConnectedSocket() socket: Socket) {
        this.logger.log(`connect ${socket.id} ${socket.nsp.name}`);

        const userName = socket.handshake.query.userName;

        this.logger.log(`user : ${userName}`);

        socket.data.user = { userName };
    }

    handleDisconnect(@ConnectedSocket() socket: Socket) {
        const roomId = this.socketRoomMap.get(socket.id);
        const player = this.gameRooms[roomId]?.players[socket.id];

        if (player) {
            // 사용했던 캐릭터 ID 반환
            const characterId = player.characterId;
            this.roomCharacters.get(roomId)?.delete(characterId);
        }
        this.server
            .to(roomId)
            .emit("userDisconnected", { user: { username: socket.data.user, userId: socket.id } });

        delete this.gameRooms[roomId]?.players[socket.id];

        // 방에 더 이상 플레이어가 없으면 방 정보 정리
        if (Object.keys(this.gameRooms[roomId]?.players || {}).length === 0) {
            delete this.gameRooms[roomId];
            this.roomCharacters.delete(roomId);
        }
    }

    @SubscribeMessage("join_phaser_room")
    handleJoin(@MessageBody() roomId: string, @ConnectedSocket() socket: Socket) {
        this.logger.log(`방 참가 신청 ${roomId} ${socket.id}`);
        socket.join(roomId);
        this.socketRoomMap.set(socket.id, roomId);

        // 해당 방의 사용 중인 캐릭터 Set 가져오기 또는 생성
        if (!this.roomCharacters.has(roomId)) {
            this.roomCharacters.set(roomId, new Set<number>());
        }

        // 사용 가능한 캐릭터 ID 할당
        const characterId = this.getAvailableCharacterId(roomId);
        this.roomCharacters.get(roomId).add(characterId);

        const playerInfo = {
            x: 360,
            y: 192,
            socketId: socket.id,
            user: socket.data.user,
            characterId: characterId, // 캐릭터 ID 추가
        };

        if (this.gameRooms[roomId]) {
            this.gameRooms[roomId].players[socket.id] = playerInfo;
        } else {
            this.gameRooms[roomId] = { players: { [socket.id]: playerInfo } };
        }

        socket.emit("characterId", characterId);

        socket.emit("gameRoomInfo", this.gameRooms[roomId]);
        socket.to(roomId).emit("newPlayer", { playerInfo });
    }

    @SubscribeMessage("move")
    handleMove(@MessageBody() moveInfo: MoveInfoDto, @ConnectedSocket() socket: Socket) {
        const { x, y, roomId, direction } = moveInfo;

        this.gameRooms[roomId].players[socket.id].x = x;
        this.gameRooms[roomId].players[socket.id].y = y;
        this.gameRooms[roomId].players[socket.id].direction = direction;

        socket.to(roomId).emit("move", this.gameRooms[roomId].players[socket.id]);
    }

    @SubscribeMessage("stop")
    handleStop(@MessageBody() info: StopPlayerInfoDto, @ConnectedSocket() socket: Socket) {
        const { roomId } = info;

        socket.to(roomId).emit("stop", this.gameRooms[roomId].players[socket.id]);
    }
}
