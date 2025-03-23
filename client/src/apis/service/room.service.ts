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
import { IUser } from "@/types/user.type";

interface ICreateRoom {
    roomNameInput: string;
}

export const useCreateRoom = () => {
    const queryClient = useQueryClient();
    const formatRoomData = async ({ roomNameInput }: ICreateRoom) => {
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
        const { data } = await getRoomInfo(roomId) as { data: IRoomModel };
        return {
            id: data._id,
            roomName: data.room_name,
            admin: data.admin,
            createdAt: data.created_at,
            userIds: data.userIds.map((user) => {
                return {
                    userName: user.user_name,
                    userId: user._id,
                    profileImg: user.profile_img,
                    email: user.email,
                } as IUser;
            }),
        };
    };

    return useQuery({ queryKey: QUERY_KEY.room(roomId), queryFn: formatRoomData });
};

export const usePatchRoomData = () => {
    const queryClient = useQueryClient();
    const formatRoomData = async ({ roomName, roomId }: IPatchRoom) => {
        const { data } = await patchRoom({ roomName, roomId }) as { data: IRoomModel };
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
            queryClient.invalidateQueries({ 
                queryKey: QUERY_KEY.rooms,
            });
        },
    });
};

export const formatRoomsData = async (accessToken?: string) => {
    const { data } = await getUserRooms(accessToken) as { data: IRoomModel[] };
    return data.map((room) => ({
        id: room._id,
        roomName: room.room_name,
        admin: room.admin,
        createdAt: room.created_at,
        userIds: room.userIds,
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
