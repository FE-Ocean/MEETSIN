import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserInfo, logout } from "../repository/user.repository";
import { IUser } from "@/types/user.type";
import { QUERY_KEY } from "@/constants/queryKey.const";

export const useGetUserInfo = () => {
    return useQuery({
        queryKey: [...QUERY_KEY.user],
        queryFn: async () => {
            const { data } = await getUserInfo();
            return {
                userName: data.user_name,
                userId: data._id,
                profileImg: data.profile_img,
                email: data.email,
            } as IUser;
        },
    });
};

export const useLogout = () => {
    return useMutation({
        mutationFn: async () => {
            await logout();
        },
    });
};
