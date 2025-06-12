import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import { Document, Schema as MongooseSchema } from "mongoose";
import { Subscription } from "src/modules/notification/schema/subscription.schema";
import { Transform } from "class-transformer";

const options: SchemaOptions = {
    timestamps: true,
    collection: "Users",
    versionKey: false,
};

export interface IUser extends Document {
    _id: string | MongooseSchema.Types.ObjectId;
    user_name: string;
    email: string;
    character?: string;
    profile_img: string;
    access_token: string;
    refresh_token: string;
    provider: string;
    notification?: Subscription;
}

// 회원가입 시 받게 되는 소셜 유저 정보
export interface INewUser {
    id: string;
    email: string;
    user_name: string;
    profile_img: string;
    access_token: string;
    refresh_token: string;
}

// DB에 저장되는 유저 정보 (토큰 포함)
@Schema(options)
export class User extends Document implements IUser {
    @Transform(({ obj }) => obj._id.toString())
    _id: string | MongooseSchema.Types.ObjectId;

    @Prop({
        required: true,
    })
    user_name: string;

    @Prop()
    email: string;

    @Prop()
    character?: string;

    @Prop()
    profile_img: string;

    @Prop({
        required: true,
    })
    access_token: string;

    @Prop()
    refresh_token: string;

    @Prop({ required: true })
    provider: string;

    @Prop({ type: MongooseSchema.Types.Mixed })
    notification: Subscription;
}

// 클라이언트에 제공되는 유저 정보 (토큰 미포함)
export class UserDto {
    _id: string;
    user_name: string;
    email: string;
    character?: string;
    profile_img: string;
    provider: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
