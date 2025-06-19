import { accessTokenAtom } from "@/jotai/atom";
import { FetchError } from "./error";
import { getDefaultStore } from "jotai/vanilla";
import { refreshToken } from "@/apis/repository/user.repository";

interface FetchClientOptions {
    baseURL: string;
    config: RequestInit & { credentials?: RequestCredentials };
}

interface ApiResponse<T> {
    data: T;
}

export class FetchClient {
    constructor(
        private baseURL: string,
        private config: RequestInit & { credentials?: RequestCredentials } = {},
    ) {
        this.config = {
            credentials: "include",
            ...config,
        };
    }

    static create(options: FetchClientOptions) {
        return new FetchClient(options.baseURL, options.config);
    }

    public get<T>(
        path: string,
        config: RequestInit & { credentials?: RequestCredentials } = {},
    ): Promise<ApiResponse<T>> {
        return this.request<T>(path, { ...config, method: "GET" });
    }

    public post<T>(
        path: string,
        body?: BodyInit | Record<string, unknown>,
        config: RequestInit = {},
    ): Promise<ApiResponse<T>> {
        const requestBody = body instanceof FormData ? body : JSON.stringify(body);
        return this.request<T>(path, { ...config, method: "POST", body: requestBody });
    }

    public delete<T>(path: string, config: RequestInit = {}): Promise<ApiResponse<T>> {
        return this.request<T>(path, { ...config, method: "DELETE" });
    }

    public patch<T>(
        path: string,
        body: BodyInit | Record<string, unknown>,
        config: RequestInit = {},
    ): Promise<ApiResponse<T>> {
        const requestBody = body instanceof FormData ? body : JSON.stringify(body);
        return this.request<T>(path, { ...config, method: "PATCH", body: requestBody });
    }
    protected async request<T>(
        path: string,
        config: RequestInit & { credentials?: RequestCredentials } = {},
    ): Promise<ApiResponse<T>> {
        const url = this.baseURL + path;
        const headers: Record<string, string> = {
            "Content-Type": "application/json",
            ...(this.config.headers as Record<string, string>),
            ...((config.headers as Record<string, string>) || {}),
        };
        if (typeof window !== "undefined") {
            const store = getDefaultStore();
            const accessToken = store.get(accessTokenAtom);
            if (accessToken) {
                headers["Authorization"] = `Bearer ${accessToken}`;
            }
        }

        // 최종 요청 설정
        const requestConfig: RequestInit = {
            ...this.config,
            ...config,
            headers,
            credentials: "include", // 항상 쿠키 포함
        };

        try {
            let response: Response;
            response = await fetch(url, requestConfig);
            if (response.status === 401 && path !== "/auth/refresh") {
                let retryConfig = { ...requestConfig };

                // 서버 사이드에서는 현재 요청의 쿠키를 사용하여 리프레시
                const { data } = await refreshToken();
                const newToken = data.access_token;

                // 클라이언트 사이드에서만 store 업데이트
                if (typeof window !== "undefined") {
                    const store = getDefaultStore();
                    store.set(accessTokenAtom, newToken);
                }

                // 항상 새 토큰으로 재시도
                retryConfig.headers = {
                    ...retryConfig.headers,
                    Authorization: `Bearer ${newToken}`,
                };
                response = await fetch(url, retryConfig);
            }

            if (!response.ok) {
                const errorBody = await response.json();
                throw new FetchError(errorBody.message, response.status, response.statusText);
            }

            const data = await response.json();
            return data;
        } catch (error) {
            if (error instanceof FetchError) {
                throw error;
            } else {
                throw new Error("Unknown Error");
            }
        }
    }
}

export const baseClient = FetchClient.create({
    baseURL: process.env.NEXT_PUBLIC_SERVER_URL ?? "",
    config: {
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    },
});
