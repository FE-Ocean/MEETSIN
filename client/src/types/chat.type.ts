export interface Message {
    nickname: string;
    message: string;
    time: string;
}

export interface RoomUser {
    socketId: string;
    userId: string;
    userName: string;
}
