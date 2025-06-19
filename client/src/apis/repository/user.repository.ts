import { baseClient } from "@/modules/fetchClient";
import { UserModel } from "@/types/user.type";

export const getUserInfo = async (accessToken?: string) => {
    return await baseClient.get<UserModel>("/auth/user");
};

export const logout = async () => {
    return await baseClient.post<void>("/auth/logout");
};

export const refreshToken = async (config?: { headers?: HeadersInit }) => {
    return await baseClient.post<{ access_token: string }>("/auth/refresh", undefined, {
        headers: config?.headers,
        credentials: "include",
    });
};
