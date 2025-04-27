import { baseClient, createAuthHeader } from "@/modules/fetchClient";
import { UserModel } from "@/types/user.type";

export const getUserInfo = async (accessToken?: string) => {
    const headers = createAuthHeader(accessToken);

    return await baseClient.get<UserModel>("/auth/user", {
        headers,
    });
};

export const logout = async () => {
    return await baseClient.post<void>("/auth/logout");
};
