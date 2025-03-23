import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CookieOptions, Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import { LoginRequest } from "src/common/types/request.type";
import { JwtGuard } from "../../common/guards/auth.guard";
import { UsersService } from "src/modules/users/users.service";
import { ResponseDto } from "src/common/interfaces/response.interface";

@Controller("auth")
export class AuthController {
    private readonly cookieOptions: CookieOptions;

    constructor(
        private readonly authService: AuthService,
        private readonly userService: UsersService,
    ) {
        const isPROD = process.env.MODE === "PROD";

        this.cookieOptions = {
            maxAge: 30 * 24 * 60 * 60 * 1000,
            secure: isPROD,
            ...(isPROD && {
                sameSite: "none",
                domain: `.${process.env.CLIENT_URL.replace("https://", "")}`,
            }),
        };
    }

    @Get("/login/google")
    @UseGuards(AuthGuard("google"))
    googleAuth(@Req() req) {}

    @Get("/redirect/google")
    @UseGuards(AuthGuard("google"))
    async googleAuthRedirect(@Req() req: LoginRequest, @Res() res: Response) {
        const { access_token } = await this.authService.signIn(req, res);
        res.cookie("access_token", access_token, this.cookieOptions);
        res.status(302).redirect(process.env.CLIENT_URL);
    }

    @Get("/login/kakao")
    @UseGuards(AuthGuard("kakao"))
    kakaoAuth(@Req() req) {}

    @Get("/redirect/kakao")
    @UseGuards(AuthGuard("kakao"))
    async kakaoAuthRedirect(@Req() req: LoginRequest, @Res() res: Response) {
        const { access_token } = await this.authService.signIn(req, res);
        res.cookie("access_token", access_token, this.cookieOptions);
        res.status(302).redirect(process.env.CLIENT_URL);
    }

    @Get("/user")
    @UseGuards(JwtGuard)
    async login(@Req() req: LoginRequest): Promise<ResponseDto> {
        const userData = this.userService.entityToDto(req.user);
        return {
            data: userData,
            message: "사용자 정보 조회 성공"
        };
    }

    @Post("/logout")
    logout(@Req() req, @Res({ passthrough: true }) res: Response): ResponseDto {
        res.clearCookie("access_token", {
            ...this.cookieOptions,
            expires: new Date(0),
            maxAge: 0,
        });
        return {
            data: null,
            message: "로그아웃 성공"
        };
    }
}
