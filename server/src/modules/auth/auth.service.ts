import { BadRequestException, ForbiddenException, Injectable } from "@nestjs/common";
import { User } from "src/modules/users/schemas/user.schema";
import { UsersRepository } from "src/modules/users/users.repository";
import dotenv from "dotenv";
import { Response } from "express";
import { JwtService } from "@nestjs/jwt";
import { LoginRequest } from "src/common/types/request.type";

dotenv.config();

@Injectable()
export class AuthService {
    constructor(
        private readonly usersRepository: UsersRepository,
        private readonly jwtService: JwtService,
    ) {}

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

            const accessToken = this.jwtService.sign(jwtPayload);

            await this.usersRepository.updateAccessToken(user, accessToken);

            return {
                access_token: accessToken,
            };
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
}
