import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { INewUser, User } from "src/modules/users/schemas/user.schema";
import { UsersRepository } from "src/modules/users/users.repository";
import { JwtService } from "@nestjs/jwt";
import dotenv from "dotenv";

dotenv.config();

@Injectable()
export class AuthService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly jwtService: JwtService,
    ) {}

    private generateJwtPayload(user: User | INewUser) {
        const userId = "id" in user ? user.id : user._id.toString();
        if (!userId) {
            throw new BadRequestException("User ID is required");
        }
        return { id: userId, email: user.email };
    }

    private generateTokens(payload: any) {
        const access_token = this.jwtService.sign(payload, { expiresIn: "15m" });
        const refresh_token = this.jwtService.sign(payload, {
            secret: process.env.JWT_REFRESH_SECRET,
            expiresIn: "30d",
        });
        return { access_token, refresh_token };
    }

    async signIn(user: User) {
        try {
            if (!user) {
                throw new BadRequestException("Unauthenticated");
            }

            let existingUser = await this.usersRepository.findUserByEmailAndProvider(
                user.email,
                user.provider,
            );

            if (!existingUser) {
                const newUser = await this.signUp(user);
                existingUser = newUser.toObject();
            }

            const payload = this.generateJwtPayload(existingUser);
            const tokens = this.generateTokens(payload);
            await this.usersRepository.updateTokens(
                existingUser,
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
        const newTokens = this.generateTokens(payload);

        await this.usersRepository.updateTokens(
            user,
            newTokens.access_token,
            newTokens.refresh_token,
        );
        return newTokens;
    }
}
