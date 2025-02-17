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
    private socketRooms: Map<string, string> = new Map();

    @WebSocketServer() server: Server;

    afterInit(server: any) {
        this.logger.log("init");
    }

    handleConnection(@ConnectedSocket() socket) {
        this.logger.log(`소켓 연결됨 - socketId: ${socket.id}`);
    }

    handleDisconnect(@ConnectedSocket() socket) {
        this.logger.log(`소켓 연결 끊어짐 - socketId: ${socket.id}`);

        const roomId = this.socketRooms.get(socket.id);

        if (roomId && this.rooms.has(roomId)) {
            const users = this.rooms.get(roomId);
            const filteredUsers = users.filter((user) => user.socketId !== socket.id);

            if (filteredUsers.length === 0) {
                this.rooms.delete(roomId);
            } else {
                this.rooms.set(roomId, filteredUsers);
                this.server.to(roomId).emit("room_users", filteredUsers);
            }
        }

        this.socketRooms.delete(socket.id);
    }

    @SubscribeMessage("join_room")
    handleJoin(
        @MessageBody() data: { roomId: string; userId: Types.ObjectId; userName: string },
        @ConnectedSocket() socket: Socket,
    ) {
        const { roomId, userId, userName } = data;

        this.socketRooms.set(socket.id, roomId);

        if (!this.rooms.has(roomId)) {
            this.rooms.set(roomId, []);
        }

        const roomUsers = this.rooms.get(roomId);
        const existingUser = roomUsers.find((user) =>
            new Types.ObjectId(user.userId).equals(userId),
        );

        if (existingUser) {
            existingUser.socketId = socket.id;
        } else {
            const user: User = { socketId: socket.id, userId, userName };
            roomUsers.push(user);
        }

        socket.join(roomId);
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
