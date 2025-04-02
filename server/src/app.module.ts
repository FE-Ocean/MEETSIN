import { MiddlewareConsumer, Module, NestModule } from "@nestjs/common";
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { RoomsModule } from "./modules/rooms/rooms.module";
import { AuthModule } from "./modules/auth/auth.module";
import { MongooseModule } from "@nestjs/mongoose";
import { ConfigModule } from "@nestjs/config";
import { PhaserModule } from "./modules/phaser/phaser.module";
import { NotificationModule } from "./modules/notification/notification.module";
import { ResponseInterceptor } from "./common/interceptors/response.interceptor";
import * as mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

@Module({
    imports: [
        ConfigModule.forRoot({ isGlobal: true }),
        MongooseModule.forRoot(process.env.MONGODB_URI),
        AuthModule,
        PhaserModule,
        RoomsModule,
        NotificationModule,
    ],
    controllers: [AppController],
    providers: [
        AppService,
        {
            provide: APP_INTERCEPTOR,
            useClass: ResponseInterceptor,
        }
    ],
})
export class AppModule implements NestModule {
    private readonly isDEV: boolean = process.env.MODE === "DEV";
    configure(consumer: MiddlewareConsumer) {
        mongoose.set("debug", this.isDEV);
        mongoose.connect(process.env.MONGODB_URI);
    }
}