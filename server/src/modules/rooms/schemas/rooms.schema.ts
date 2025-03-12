import { Prop, Schema, SchemaFactory } from "@nestjs/mongoose";

const options = {
    collection: "Rooms",
    versionKey: false,
    timestamps: { createdAt: "created_at", updatedAt: false },
};

@Schema(options)
export class Room {
    @Prop({ required: true })
    room_name: string;

    @Prop({ required: true })
    admin: string;
}

export const RoomSchema = SchemaFactory.createForClass(Room);
