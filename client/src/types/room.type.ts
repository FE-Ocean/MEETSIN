export interface IRoom {
    id: string;
    roomName: string;
    admin: string;
    createdAt: string;
}

export interface IRoomModel {
    _id: string;
    room_name: string;
    admin: string;
    created_at: string;
}

export interface IPatchRoom {
    roomName: string;
    roomId: string;
}
