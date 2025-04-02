import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common";
import { Types } from "mongoose";
import { JwtGuard } from "src/common/guards/auth.guard";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { User } from "src/modules/users/schemas/user.schema";
import { CreateRoomDto } from "./dto/create-room.dto";
import { UpdateRoomDto } from "./dto/update-room.dto";
import { RoomsService } from "./rooms.service";
import { ResponseDto } from "src/common/interfaces/response.interface";

@Controller("rooms")
@UseGuards(JwtGuard)
export class RoomsController {
    constructor(private readonly roomsService: RoomsService) {}

    @Post()
    async createRoom(@Body("roomData") roomData: CreateRoomDto, @CurrentUser() user: User): Promise<ResponseDto> {
        const room = await this.roomsService.createRoom(roomData, user);
        return {
            data: room,
            message: "방이 성공적으로 생성되었습니다"
        };
    }

    @Get("/user")
    async getRoomsByUserId(@CurrentUser() user: User): Promise<ResponseDto> {
        const rooms = await this.roomsService.getRoomsByUserId(user.id);
        return {
            data: rooms,
            message: "사용자의 방 목록을 성공적으로 조회했습니다"
        };
    }

    @Get("/:roomId")
    async getRoomById(@Param("roomId") roomId: Types.ObjectId): Promise<ResponseDto> {
        const room = await this.roomsService.getRoomById(roomId);
        return {
            data: room,
            message: "방 정보를 성공적으로 조회했습니다"
        };
    }

    @Patch("/:roomId")
    async updateRoom(@Param("roomId") roomId: Types.ObjectId, @Body("roomData") roomData: UpdateRoomDto): Promise<ResponseDto> {
        const room = await this.roomsService.updateRoom(roomId, roomData.roomName);
        return {
            data: room,
            message: "방 정보가 성공적으로 수정되었습니다"
        };
    }

    @Delete("/:roomId")
    async deleteRoom(@Param("roomId") roomId: Types.ObjectId): Promise<ResponseDto> {
        const result = await this.roomsService.deleteRoom(roomId);
        return {
            data: result,
            message: "방이 성공적으로 삭제되었습니다"
        };
    }
}
