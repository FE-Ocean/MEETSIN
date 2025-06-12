export interface Message {
    userName: string;
    message: string;
    time: string;
    characterId: number;
}

export interface RoomUser {
    socketId: string;
    userId: string;
    userName: string;
    characterId?: number;
}
