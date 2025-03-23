import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserInfo, logout } from "../repository/user.repository";
import { IUserModel, IUser } from "@/types/user.type";
import { QUERY_KEY } from "@/constants/queryKey.const";

export const useGetUserInfo = () => {
    return useQuery({
        queryKey: [...QUERY_KEY.user],
        queryFn: async () => {
            const { data } = await getUserInfo();
            const userData = data as IUserModel;
            return {
                userName: userData.user_name,
                userId: userData._id,
                profileImg: userData.profile_img,
                email: userData.email,
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
