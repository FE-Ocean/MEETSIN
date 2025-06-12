"use client";
import { PropsWithChildren, useEffect } from "react";
import { useSetAtom } from "jotai";
import { accessTokenAtom } from "@/jotai/atom";
import { refreshToken } from "@/apis/repository/user.repository";

export function RefreshProvider({ children }: PropsWithChildren) {
    const setAccessToken = useSetAtom(accessTokenAtom);

    useEffect(() => {
        (async () => {
            try {
                const { data } = await refreshToken();
                setAccessToken(data.access_token);
            } catch {
                // 무시 or 로그인 페이지로 리다이렉트
                console.error("리프레시 토큰 요청에 실패했습니다.");
            }
        })();
    }, [setAccessToken]);

    return children;
}
