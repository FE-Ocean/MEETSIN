import { Controller, Get, Post, Req, Res, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { CookieOptions, Response } from "express";
import { AuthGuard } from "@nestjs/passport";
import { LoginRequest } from "src/common/types/request.type";
import { JwtGuard } from "../../common/guards/auth.guard";
import { UsersService } from "src/modules/users/users.service";

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
        res.redirect(process.env.CLIENT_URL);
    }

    @Get("/login/kakao")
    @UseGuards(AuthGuard("kakao"))
    kakaoAuth(@Req() req) {}

    @Get("/redirect/kakao")
    @UseGuards(AuthGuard("kakao"))
    async kakaoAuthRedirect(@Req() req: LoginRequest, @Res() res: Response) {
        const { access_token } = await this.authService.signIn(req, res);
        res.cookie("access_token", access_token, this.cookieOptions);
        res.redirect(process.env.CLIENT_URL);
    }

    // 토큰으로 유저 정보 가져오기
    @Get("/user")
    @UseGuards(JwtGuard)
    async login(@Req() req: LoginRequest, @Res() res: Response) {
        const user = this.userService.entityToDto(req.user);
        res.json(user);
    }

    @Post("/logout")
    logout(@Req() req, @Res() res: Response) {
        res.clearCookie("access_token", {
            ...this.cookieOptions,
            expires: new Date(0),
            maxAge: 0,
        });
        return res.status(200).send({ message: "로그아웃 성공" });
    }
}
