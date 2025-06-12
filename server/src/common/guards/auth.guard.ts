import { UsersRepository } from "src/modules/users/users.repository";
import { ExecutionContext, Injectable, UnauthorizedException } from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { AuthGuard } from "@nestjs/passport";

@Injectable()
export class JwtGuard extends AuthGuard("jwt") {
    handleRequest(err, user, info) {
        if (err || !user) {
            if (info?.name === "TokenExpiredError") {
                throw new UnauthorizedException("토큰이 만료되었습니다.");
            }
            throw new UnauthorizedException("유효하지 않은 토큰입니다.");
        }
        return user;
    }
}

export class JwtRefreshGuard extends AuthGuard("jwt-refresh") {
    handleRequest(err, user, info) {
        if (err || !user) {
            if (info?.name === "TokenExpiredError") {
                throw new UnauthorizedException("리프레시 토큰이 만료되었습니다.");
            }
            throw new UnauthorizedException("유효하지 않은 리프레시 토큰입니다.");
        }
        return user;
    }
}
