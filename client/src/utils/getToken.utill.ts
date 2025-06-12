import { refreshToken } from "@/apis/repository/user.repository";
import { accessTokenAtom } from "@/jotai/atom";
import { getDefaultStore } from "jotai";

export const getToken = async () => {
    // 서버 사이드에서 실행
    if (typeof window === "undefined") {
        const { data } = await refreshToken();
        const accessToken = data.access_token;
        return accessToken;
    }

    // 클라이언트 사이드에서 실행
    const store = getDefaultStore();
    return store.get(accessTokenAtom);
};
