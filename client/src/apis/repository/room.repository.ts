import { baseClient, createAuthHeader } from "@/modules/fetchClient";
import { PatchRoom, RoomModel } from "@/types/room.type";

export const getRoomInfo = async (roomId: string, accessToken?: string) => {
    const headers = createAuthHeader(accessToken);

    return await baseClient.get<RoomModel>(`/rooms/${roomId}`, { headers });
};

export const getUserRooms = async (accessToken?: string) => {
    const headers = createAuthHeader(accessToken);

    return await baseClient.get<RoomModel[]>("/rooms/user", {
        headers,
    });
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
