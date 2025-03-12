import { baseClient, createAuthHeader } from "@/modules/fetchClient";
import { IRoomModel, IPatchRoom } from "@/types/room.type";

export const getRoomInfo = async (roomId: string, accessToken?: string) => {
    const headers = createAuthHeader(accessToken);

    return await baseClient.get(`/rooms/${roomId}`, { headers });
};

export const getUserRooms = async (accessToken?: string) => {
    const headers = createAuthHeader(accessToken);

    return await baseClient.get("/rooms/user", {
        headers,
    });
};

export const createRoom = async (roomNameInput: string) => {
    return await baseClient.post<IRoomModel>("/rooms", {
        roomData: { roomName: roomNameInput },
    });
};

export const patchRoom = async ({ roomName, roomId }: IPatchRoom) => {
    return await baseClient.patch(`/rooms/${roomId}`, {
        roomData: { roomName },
    });
};

export const deleteRoom = async (roomId: string) => {
    return await baseClient.delete(`/rooms/${roomId}`);
};
