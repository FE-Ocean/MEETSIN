import { FetchError } from "./error";

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

        const headers = {
            ...this.config.headers,
            ...config.headers,
        };

        const requestConfig: RequestInit = {
            ...this.config,
            ...config,
            headers,
        };

        try {
            const response = await fetch(url, requestConfig);

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

export const addAuthHeader = (accessToken: string, config: RequestInit = {}) => {
    if (!accessToken) {
        throw new Error("access token이 없거나 올바르지 않습니다.");
    }

    return {
        ...config,
        headers: {
            ...config.headers,
            Authorization: `Bearer ${accessToken}`,
        },
    };
};

export const createAuthHeader = (accessToken?: string) => {
    const headers: { [key: string]: string } = {};

    if (accessToken) {
        headers.Authorization = `Bearer ${accessToken}`;
    }

    return headers;
};
