import { accessTokenAtom } from "@/jotai/atom";
import { FetchError } from "./error";
import { getDefaultStore } from "jotai/vanilla";
import { refreshToken } from "@/apis/repository/user.repository";

interface FetchClientOptions {
    baseURL: string;
    config: RequestInit;
}

interface ApiResponse<T> {
    data: T;
}

export class FetchClient {
    constructor(private baseURL: string, private config: RequestInit = {}) {}

    static create(options: FetchClientOptions) {
        return new FetchClient(options.baseURL, options.config);
    }

    public get<T>(path: string, config: RequestInit = {}): Promise<ApiResponse<T>> {
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

    protected async request<T>(path: string, config: RequestInit): Promise<ApiResponse<T>> {
        const url = this.baseURL + path;
        const store = getDefaultStore();
        const accessToken = store.get(accessTokenAtom);
        const setAccessToken = (token: string) => {
            store.set(accessTokenAtom, token);
        };

        const headers = {
            ...this.config.headers,
            ...config.headers,
            ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        };

        const requestConfig: RequestInit = {
            ...this.config,
            ...config,
            headers,
        };

        try {
            let response: Response;
            response = await fetch(url, requestConfig);
            if (response.status === 401 && path !== "/auth/refresh") {
                const { data } = await refreshToken();
                const newToken = data.access_token;
                if (newToken) {
                    setAccessToken(newToken);
                    const retryHeaders = {
                        ...headers,
                        Authorization: `Bearer ${newToken}`,
                    };
                    const retryConfig = { ...requestConfig, headers: retryHeaders };
                    response = await fetch(url, retryConfig);
                }
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
