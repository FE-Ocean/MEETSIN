import { Injectable, UnauthorizedException } from "@nestjs/common";
import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import dotenv from "dotenv";
import { JwtPayload } from "jsonwebtoken";
import { UsersRepository } from "src/modules/users/users.repository";

dotenv.config();

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, "jwt") {
    constructor(private readonly usersRepository: UsersRepository) {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => {
                    return request?.cookies["access_token"];
                },
                ExtractJwt.fromAuthHeaderAsBearerToken(),
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_SECRET,
        });
    }

    async validate(payload: JwtPayload) {
        const user = await this.usersRepository.findUserById(payload.id);
        if (!user) {
            throw new UnauthorizedException("유효하지 않은 토큰입니다.");
        }
        return user;
    }
}

@Injectable()
export class JwtRefreshStrategy extends PassportStrategy(Strategy, "jwt-refresh") {
    constructor() {
        super({
            jwtFromRequest: ExtractJwt.fromExtractors([
                (request) => {
                    return request?.cookies["refresh_token"];
                },
            ]),
            ignoreExpiration: false,
            secretOrKey: process.env.JWT_REFRESH_SECRET,
        });
    }

    async validate(payload: JwtPayload) {
        return {
            id: payload.id,
            email: payload.email,
        };
    }
}
