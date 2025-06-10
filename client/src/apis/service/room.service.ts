import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
    deleteRoom,
    getRoomInfo,
    getUserRooms,
    patchRoom,
    createRoom,
} from "../repository/room.repository";
import { PatchRoom, RoomModel } from "@/types/room.type";
import { QUERY_KEY } from "@/constants/queryKey.const";

interface CreateRoom {
    roomNameInput: string;
}

export const useCreateRoom = () => {
    const queryClient = useQueryClient();
    const formatRoomData = async ({ roomNameInput }: CreateRoom) => {
        const { data } = await createRoom(roomNameInput);
        return {
            roomId: data._id,
            roomName: data.room_name,
            admin: data.admin,
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
        const { data } = (await getRoomInfo(roomId)) as { data: RoomModel };
        return {
            id: data._id,
            roomName: data.room_name,
            admin: data.admin,
            createdAt: data.created_at,
        };
    };

    return useQuery({
        queryKey: QUERY_KEY.room(roomId),
        queryFn: formatRoomData,
        retry: 0,
        staleTime: 1000 * 60 * 5,
        gcTime: 1000 * 60 * 10,
        refetchOnWindowFocus: false,
        enabled: !!roomId,
        initialData: undefined,
    });
};

export const usePatchRoomData = (roomId: string) => {
    const queryClient = useQueryClient();
    const formatRoomData = async ({ roomName, roomId }: PatchRoom) => {
        const { data } = (await patchRoom({ roomName, roomId })) as { data: RoomModel };
        return {
            id: data._id,
            roomName: data.room_name,
            admin: data.admin,
            createdAt: data.created_at,
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

export const formatRoomsData = async () => {
    const { data } = (await getUserRooms()) as { data: RoomModel[] };
    return data.map((room) => ({
        id: room._id,
        roomName: room.room_name,
        admin: room.admin,
        createdAt: room.created_at,
    }));
};

export const useGetUserRooms = () => {
    return useQuery({ queryKey: QUERY_KEY.rooms, queryFn: () => formatRoomsData() });
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
