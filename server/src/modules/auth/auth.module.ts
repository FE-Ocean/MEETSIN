import { Module, forwardRef } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { ConfigModule } from "@nestjs/config";
import { UsersModule } from "src/modules/users/users.module";
import { KakaoStrategy } from "./strategies/kakao.strategy";
import { GoogleStrategy } from "./strategies/google.strategy";
import { JwtRefreshStrategy, JwtStrategy } from "./strategies/jwt.strategy";
import { AuthController } from "./auth.controller";
import dotenv from "dotenv";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { UserSchema } from "src/modules/users/schemas/user.schema";
import { MongooseModule } from "@nestjs/mongoose";
import { UsersService } from "../users/users.service";

dotenv.config();

@Module({
    imports: [
        MongooseModule.forFeature([
            {
                name: "Users",
                schema: UserSchema,
            },
        ]),
        ConfigModule.forRoot({
            isGlobal: true,
        }),
        forwardRef(() => UsersModule),
        PassportModule.register({
            defaultStrategy: "jwt",
            session: false,
        }),
        JwtModule.register({
            secret: process.env.JWT_SECRET,
            signOptions: {
                expiresIn: "15m",
            },
        }),
        JwtModule.register({
            secret: process.env.JWT_REFRESH_SECRET,
            signOptions: {
                expiresIn: "30d",
            },
        }),
    ],
    providers: [
        AuthService,
        UsersService,
        GoogleStrategy,
        KakaoStrategy,
        JwtStrategy,
        JwtRefreshStrategy,
    ],
    controllers: [AuthController],
    exports: [AuthService],
})
export class AuthModule {}
