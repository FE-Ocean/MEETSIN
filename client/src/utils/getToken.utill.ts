import { cookies } from "next/headers";

export const getToken = () => {
    // 서버 사이드에서 실행
    if (typeof window === "undefined") {
        return cookies().get("access_token")?.value;
    }
    
    // 클라이언트 사이드에서 실행
    return document.cookie
        .split("; ")
        .find((row) => row.startsWith("access_token="))
        ?.split("=")[1];
};
