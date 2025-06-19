"use server";

import { baseClient } from "@/modules/fetchClient";
import { headers } from "next/headers";

export const refreshToken = async (config: { headers?: HeadersInit } = {}) => {
    const headersList = headers();
    const cookie = headersList.get("cookie");

    return await baseClient.post<{ access_token: string }>("/auth/refresh", undefined, {
        headers: {
            cookie: cookie || "",
        },
        credentials: "include",
    });
};
