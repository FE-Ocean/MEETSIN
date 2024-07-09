import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { MongooseModule } from "@nestjs/mongoose";
import { User, UserSchema } from "src/schema/user.schema";
import { UsersModule } from "src/users/users.module";
import { NotificationController } from "./notification.controller";
import { NotificationService } from "./notification.service";

@Module({
    imports: [
        MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
        UsersModule,
        JwtModule,
    ],
    controllers: [NotificationController],
    providers: [NotificationService],
})
export class NotificationModule {}
