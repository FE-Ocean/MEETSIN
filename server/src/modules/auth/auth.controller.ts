import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { AuthService } from "./auth.service";
import { CookieOptions, Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import { LoginRequest } from "src/common/types/request.type";
import { JwtGuard, JwtRefreshGuard } from "../../common/guards/auth.guard";
import { UsersService } from "src/modules/users/users.service";
import { ResponseDto } from "src/common/interfaces/response.interface";

@Controller("auth")
export class AuthController {
    private readonly cookieOptions: CookieOptions;

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
        private readonly configService: ConfigService,
    ) {
        const isPROD = this.configService.get("MODE") === "PROD";
        this.cookieOptions = {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
            secure: isPROD,
            path: "/",
            ...(isPROD && {
                sameSite: "none",
                domain: `.${this.configService.get("CLIENT_URL").replace("https://", "")}`,
            }),
            // httpOnly: true, // 개발 환경 테스트를 위해 임시 비활성화
        };
    }

    @Get("/login/google")
    @UseGuards(AuthGuard("google"))
    googleAuth(@Req() req) {}

    @Get("/redirect/google")
    @UseGuards(AuthGuard("google"))
    async googleAuthRedirect(@Req() req: LoginRequest, @Res() res: Response) {
        const { access_token, refresh_token } = await this.authService.signIn(req, res);
        res.cookie("refresh_token", refresh_token, this.cookieOptions);
        res.status(302).redirect(this.configService.get("CLIENT_URL"));
    }

    @Get("/login/kakao")
    @UseGuards(AuthGuard("kakao"))
    kakaoAuth(@Req() req) {}

    @Get("/redirect/kakao")
    @UseGuards(AuthGuard("kakao"))
    async kakaoAuthRedirect(@Req() req: LoginRequest, @Res() res: Response) {
        const { access_token, refresh_token } = await this.authService.signIn(req, res);
        res.cookie("refresh_token", refresh_token, this.cookieOptions);
        res.status(302).redirect(this.configService.get("CLIENT_URL"));
    }

    @Get("/login/guest")
    loginAsGuest(@Req() req, @Res() res) {
        const guestCookieOptions = {
            ...this.cookieOptions,
            maxAge: 24 * 60 * 60 * 1000,
        };
        res.cookie(
            "refresh_token",
            this.configService.get("GUEST_ACCESS_TOKEN"),
            guestCookieOptions,
        );
        res.status(302).redirect(
            `${this.configService.get("CLIENT_URL")}?token=${this.configService.get(
                "GUEST_ACCESS_TOKEN",
            )}`,
        );
    }

    @Get("/user")
    @UseGuards(JwtGuard)
    async login(@Req() req: LoginRequest): Promise<ResponseDto> {
        const userData = this.userService.entityToDto(req.user);
        return {
            data: userData,
            message: "사용자 정보 조회 성공",
        };
    }

    @Post("/logout")
    logout(@Req() req, @Res({ passthrough: true }) res: Response): ResponseDto {
        res.clearCookie("refresh_token", {
            ...this.cookieOptions,
            expires: new Date(0),
            maxAge: 0,
        });
        return {
            data: null,
            message: "로그아웃 성공",
        };
    }

    @Post("/refresh")
    @UseGuards(JwtRefreshGuard)
    async refresh(@Req() req: LoginRequest, @Res({ passthrough: true }) res: Response) {
        const { access_token, refresh_token } = await this.authService.refreshTokens(req.user);

        res.cookie("refresh_token", refresh_token, this.cookieOptions);

        return {
            access_token,
        };
    }
}
