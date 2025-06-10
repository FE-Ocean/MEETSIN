import { baseClient, createAuthHeader } from "@/modules/fetchClient";
import { PatchRoom, RoomModel } from "@/types/room.type";

export const getRoomInfo = async (roomId: string, accessToken?: string) => {
    return await baseClient.get<RoomModel>(`/rooms/${roomId}`);
};

export const getUserRooms = async () => {
    return await baseClient.get<RoomModel[]>("/rooms/user");
};

export const createRoom = async (roomNameInput: string) => {
    return await baseClient.post<RoomModel>("/rooms", {
        roomData: { roomName: roomNameInput },
    });
};

export const patchRoom = async ({ roomName, roomId }: PatchRoom) => {
    return await baseClient.patch<RoomModel>(`/rooms/${roomId}`, {
        roomData: { roomName },
    });
};

export const deleteRoom = async (roomId: string) => {
    return await baseClient.delete<void>(`/rooms/${roomId}`);
};
