import { useMutation, useQuery } from "@tanstack/react-query";
import { getUserInfo, logout, refreshToken } from "../repository/user.repository";
import { User } from "@/types/user.type";
import { QUERY_KEY } from "@/constants/queryKey.const";
import { accessTokenAtom } from "@/jotai/atom";
import { useSetAtom } from "jotai";

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
            } as User;
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

export const useRefreshToken = () => {
    const setAccessToken = useSetAtom(accessTokenAtom);
    return useMutation({
        mutationFn: () => refreshToken(),
        onSuccess: ({ data }) => {
            const accessToken = data.access_token;
            setAccessToken(accessToken);
        },
    });
};
