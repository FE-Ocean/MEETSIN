import { NextRequest, NextResponse } from "next/server";

interface Routes {
    [key: string]: boolean;
}

const publicUrls: Routes = {
    "/": true,
};

export async function middleware(request: NextRequest) {
    const refreshToken = request.cookies.get("refresh_token");
    const exists = publicUrls[request.nextUrl.pathname];
    if (!refreshToken) {
        if (!exists) {
            return NextResponse.redirect(new URL("/", request.url));
        }
    } else {
        if (exists) {
            return NextResponse.redirect(new URL("/lobby", request.url));
        }
    }
}

export const config = {
    matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg).*)"],
};
