import { UsersRepository } from "src/modules/users/users.repository";
import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";

// @Injectable()
// export class JwtGuard extends AuthGuard("jwt") {
//     constructor(private usersRepository: UsersRepository, private jwtService: JwtService) {
//         super();
//     }
//     async canActivate(context: ExecutionContext) {
//         const req = context.switchToHttp().getRequest();
//         const { authorization } = req.headers;
//         if (!authorization) {
//             throw new UnauthorizedException("Authorization 요청 헤더를 추가해주세요");
//         }
//         const token = authorization.replace("Bearer ", "");
//         const userInfoByToken = await this.validateToken(token);
//         if (!userInfoByToken.id) {
//             throw new UnauthorizedException("token is not valid");
//         }
//         const user = await this.usersRepository.findUserById(userInfoByToken.id);
//         req.user = user;
//         return true;
//     }

//     async validateToken(token) {
//         const isValid = await this.jwtService.verify(token, {
//             secret: process.env.JWT_SECRET,
//         });
//         return isValid;
//     }
// }

@Injectable()
export class JwtGuard extends AuthGuard("jwt") {
    constructor(private usersRepository: UsersRepository, private jwtService: JwtService) {
        super();
    }
    async canActivate(context: ExecutionContext) {
        const req = context.switchToHttp().getRequest();
        const token =
            req.cookies["access_token"] || req.headers["authorization"]?.replace("Bearer ", "");

        if (!token) {
            throw new UnauthorizedException("Authorization 요청 헤더를 추가해주세요");
        }
        const userInfoByToken = await this.validateToken(token);

        if (!userInfoByToken.id) {
            throw new UnauthorizedException("유효한 토큰이 아닙니다.");
        }

        const user = await this.usersRepository.findUserById(userInfoByToken.id);
        req.user = user;
        return true;
    }

    async validateToken(token) {
        const isValid = await this.jwtService.verify(token, {
            secret: process.env.JWT_SECRET,
        });
        return isValid;
    }
}