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
import { Types } from "mongoose";
import { RoomsService } from "./rooms.service";
import { Server, Socket } from "socket.io";
import { MessageInfoDTO } from "./dto/message-info.dto";
import { TimerDto } from "./dto/timer.dto";

interface UserSocket extends Socket {
    user?: any;
}

interface User {
    socketId: string;
    userId: Types.ObjectId;
    userName: string;
}

interface ITimer {
    roomId: string;
    duration: TimerDto;
}

@WebSocketGateway({
    cors: {
        origin: process.env.CLIENT_URL,
        credentials: true,
    },
    namespace: "room",
})
export class RoomsGateway implements OnGatewayConnection, OnGatewayInit, OnGatewayDisconnect {
    private logger = new Logger("room");
    private rooms: Map<string, User[]> = new Map();

    constructor(private readonly roomsService: RoomsService) {}

    @WebSocketServer() server: Server;

    afterInit(server: any) {
        this.logger.log("init");
    }

    handleConnection(@ConnectedSocket() socket: UserSocket) {
        this.logger.log(`connect ${socket.id} ${socket.nsp.name}`);
    }

    handleDisconnect(@ConnectedSocket() socket) {
        this.logger.log("disconnect", socket.id);
    }

    @SubscribeMessage("join_room")
    handleJoin(
        @MessageBody() data: { roomId: string; userId: Types.ObjectId; userName: string },
        @ConnectedSocket() socket: Socket,
    ) {
        const { roomId, userId, userName } = data;

        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, []);
        }

        const roomUsers = this.rooms.get(roomId);
        const existingUser = roomUsers.find((user) => user.userId.toString() === userId.toString());

        if (!existingUser) {
            const user: User = { socketId: socket.id, userId, userName };
            roomUsers.push(user);
            socket.join(roomId);
        }
        this.server.to(roomId).emit("room_users", this.rooms.get(roomId));
    }

    @SubscribeMessage("leave_room")
    handleLeave(
        @MessageBody() data: { roomId: string; userId: Types.ObjectId },
        @ConnectedSocket() socket: Socket,
    ) {
        const { roomId, userId } = data;

        socket.leave(roomId);

        if (this.rooms.has(roomId)) {
            const roomUsers = this.rooms.get(roomId);
            const filteredUsers = roomUsers.filter((user) => user.userId !== userId);

            if (filteredUsers.length === 0) {
                this.rooms.delete(roomId);
            } else {
                this.rooms.set(roomId, filteredUsers);
            }

            this.server.to(roomId).emit("room_users", this.rooms.get(roomId));
        }
    }

    @SubscribeMessage("get_room_users")
    handleGetRoomUsers(@MessageBody() roomId: string, @ConnectedSocket() socket: Socket) {
        socket.emit("room_users", this.rooms.get(roomId) || []);
    }

    @SubscribeMessage("new_message")
    handleMessage(@MessageBody() messageInfo: MessageInfoDTO): void {
        this.server
            .to(messageInfo.roomId)
            .emit("new_message", { time: new Date(), ...messageInfo });
    }

    @SubscribeMessage("start_timer")
    handleStartTimer(@MessageBody() data: ITimer) {
        const { roomId, duration } = data;

        this.server.to(roomId).emit("start_timer", duration);
    }

    @SubscribeMessage("stop_timer")
    handleStopTimer(@MessageBody() roomId: string) {
        this.server.to(roomId).emit("stop_timer");
    }
}
