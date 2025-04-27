export interface Room {
    id: string;
    roomName: string;
    admin: string;
    createdAt: string;
}

export interface RoomModel {
    _id: string;
    room_name: string;
    admin: string;
    created_at: string;
}

export interface PatchRoom {
    roomName: string;
    roomId: string;
}
