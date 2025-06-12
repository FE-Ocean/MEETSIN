import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CookieOptions, Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import dotenv from "dotenv";
import { LoginRequest } from "src/common/types/request.type";
import { JwtGuard, JwtRefreshGuard } from "../../common/guards/auth.guard";
import { UsersService } from "src/modules/users/users.service";
import { ResponseDto } from "src/common/interfaces/response.interface";
import { UsersRepository } from "../users/users.repository";

dotenv.config();

@Controller("auth")
export class AuthController {
    private readonly cookieOptions: CookieOptions;

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
        private readonly usersRepository: UsersRepository,
    ) {
        const isPROD = process.env.MODE === "PROD";
        this.cookieOptions = {
            maxAge: 7 * 24 * 60 * 60 * 1000, // 7일
            secure: isPROD,
            path: "/",
            ...(isPROD && {
                sameSite: "none",
                domain: `.${process.env.CLIENT_URL.replace("https://", "")}`,
            }),
            httpOnly: true, // 개발 환경에서는 false로 바꾸어 테스트
        };
    }

    @Get("/login/google")
    @UseGuards(AuthGuard("google"))
    googleAuth(@Req() req) {}

    @Get("/redirect/google")
    @UseGuards(AuthGuard("google"))
    async googleAuthRedirect(@Req() req: LoginRequest, @Res() res: Response) {
        const { refresh_token } = await this.authService.signIn(req.user);
        res.cookie("refresh_token", refresh_token, this.cookieOptions);
        res.status(302).redirect(process.env.CLIENT_URL);
    }

    @Get("/login/kakao")
    @UseGuards(AuthGuard("kakao"))
    kakaoAuth(@Req() req) {}

    @Get("/redirect/kakao")
    @UseGuards(AuthGuard("kakao"))
    async kakaoAuthRedirect(@Req() req: LoginRequest, @Res() res: Response) {
        const { refresh_token } = await this.authService.signIn(req.user);
        res.cookie("refresh_token", refresh_token, this.cookieOptions);
        res.status(302).redirect(process.env.CLIENT_URL);
    }

    @Get("/login/guest")
    async loginAsGuest(@Req() req, @Res() res) {
        const guestCookieOptions = {
            ...this.cookieOptions,
            maxAge: 24 * 60 * 60 * 1000,
        };
        const guestUser = await this.usersRepository.findUserById(process.env.GUEST_OBJECT_ID);
        const { refresh_token } = await this.authService.signIn(guestUser);
        res.cookie("refresh_token", refresh_token, guestCookieOptions);
        res.status(302).redirect(process.env.CLIENT_URL);
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
