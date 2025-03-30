import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    deleteRoom,
    getRoomInfo,
    getUserRooms,
    patchRoom,
    createRoom,
} from "../repository/room.repository";
import { IPatchRoom, IRoomModel } from "@/types/room.type";
import { QUERY_KEY } from "@/constants/queryKey.const";

interface ICreateRoom {
    roomNameInput: string;
}

export const useCreateRoom = () => {
    const queryClient = useQueryClient();
    const formatRoomData = async ({ roomNameInput }: ICreateRoom) => {
        const res = await createRoom(roomNameInput);
        return {
            roomId: res._id,
            roomName: res.room_name,
            admin: res.admin,
        };
    };

    return useMutation({
        mutationFn: formatRoomData,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.rooms });
        },
    });
};

export const useGetRoomData = (roomId: string) => {
    const formatRoomData = async () => {
        const res = (await getRoomInfo(roomId)) as IRoomModel;
        return {
            id: res._id,
            roomName: res.room_name,
            admin: res.admin,
            createdAt: res.created_at,
        };
    };

    return useQuery({
        queryKey: QUERY_KEY.room(roomId),
        queryFn: formatRoomData,
        retry: 0,
        staleTime: 1000 * 60 * 5,
        cacheTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        enabled: !!roomId,
        initialData: undefined,
    });
};

export const usePatchRoomData = (roomId: string) => {
    const queryClient = useQueryClient();
    const formatRoomData = async ({ roomName, roomId }: IPatchRoom) => {
        const res = (await patchRoom({ roomName, roomId })) as IRoomModel;
        return {
            id: res._id,
            roomName: res.room_name,
            admin: res.admin,
            createdAt: res.created_at,
        };
    };

    return useMutation({
        mutationFn: formatRoomData,
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.rooms });
            queryClient.refetchQueries({ queryKey: QUERY_KEY.room(roomId) });
        },
    });
};

export const formatRoomsData = async (accessToken?: string) => {
    const res = (await getUserRooms(accessToken)) as IRoomModel[];
    return res.map((room) => ({
        id: room._id,
        roomName: room.room_name,
        admin: room.admin,
        createdAt: room.created_at,
    }));
};

export const useGetUserRooms = (accessToken?: string) => {
    return useQuery({ queryKey: QUERY_KEY.rooms, queryFn: () => formatRoomsData(accessToken) });
};

export const useDeleteRoom = (roomId: string) => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: () => deleteRoom(roomId),
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: QUERY_KEY.rooms });
        },
    });
};
