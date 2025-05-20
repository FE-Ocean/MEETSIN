import {
    BadRequestException,
    ForbiddenException,
    Injectable,
    UnauthorizedException,
} from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { User } from "src/modules/users/schemas/user.schema";
import { UsersRepository } from "src/modules/users/users.repository";
import { Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { LoginRequest } from "src/common/types/request.type";

@Injectable()
export class AuthService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService,
    ) {}

    private generateJwtPayload(user: User) {
        return { id: user._id.toString(), email: user.email };
    }

    private generateTokens(payload: any) {
        const access_token = this.jwtService.sign(payload, { expiresIn: "15m" });
        const refresh_token = this.jwtService.sign(payload, {
            secret: this.configService.get("JWT_REFRESH_SECRET"),
            expiresIn: "30d",
        });
        return { access_token, refresh_token };
    }

    async signIn(req: LoginRequest, res: Response) {
        try {
            const userData = req.user as User;

            if (!userData) {
                throw new BadRequestException("Unauthenticated");
            }

            let user = await this.usersRepository.findUserByEmailAndProvider(
                userData.email,
                userData.provider,
            );

            if (!user) {
                const newUser = await this.signUp(userData);
                user = newUser.toObject();
            }
            const jwtPayload = {
                id: user._id.toString(),
                email: user.email,
            };

            const payload = this.generateJwtPayload(user);
            const tokens = this.generateTokens(payload);
            await this.usersRepository.updateTokens(
                user,
                tokens.access_token,
                tokens.refresh_token,
            );

            return tokens;
        } catch (error) {
            throw new ForbiddenException(error);
        }
    }

    async signUp(userData: Partial<User>) {
        try {
            const user = this.usersRepository.createUser(userData);
            return await this.usersRepository.saveUser(user);
        } catch (error) {
            throw new ForbiddenException("회원가입 중 오류가 발생했습니다.");
        }
    }

    async refreshTokens(user: User) {
        const payload = this.generateJwtPayload(user);

        const newTokens = this.generateTokens({ id: payload.id, email: payload.email });

        await this.usersRepository.updateTokens(
            user,
            newTokens.access_token,
            newTokens.refresh_token,
        );
        return newTokens;
    }
}
