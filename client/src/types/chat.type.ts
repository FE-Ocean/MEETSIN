export interface Message {
    userName: string;
    message: string;
    time: string;
}

export interface RoomUser {
    socketId: string;
    userId: string;
    userName: string;
}
