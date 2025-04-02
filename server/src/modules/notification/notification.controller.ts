import { Body, Controller, Delete, Post, UseGuards } from "@nestjs/common";
import { CurrentUser } from "src/common/decorators/user.decorator";
import { JwtGuard } from "src/common/guards/auth.guard";
import { User } from "src/modules/users/schemas/user.schema";
import { SubscriptionDTO } from "./dto/subscription.dto";
import { NotificationService } from "./notification.service";
import { ResponseDto } from "src/common/interfaces/response.interface";

@Controller("notification")
@UseGuards(JwtGuard)
export class NotificationController {
    constructor(private readonly notificationService: NotificationService) {}

    @Post()
    async createSubscriptionToDB(
        @CurrentUser() user: User,
        @Body("notification") subscription: SubscriptionDTO,
    ): Promise<ResponseDto> {
        const result = await this.notificationService.createSubscription(user.id, subscription);
        return {
            data: result,
            message: "알림 구독이 성공적으로 등록되었습니다"
        };
    }

    @Delete()
    async deleteSubscriptionFromDB(@CurrentUser() user: User): Promise<ResponseDto> {
        const result = await this.notificationService.deleteSubscription(user.id);
        return {
            data: result,
            message: "알림 구독이 성공적으로 해제되었습니다"
        };
    }

    @Post("/push")
    async createPushNotification(@Body("userIds") userIds: string[]): Promise<ResponseDto> {
        const result = await this.notificationService.createPushNotification(userIds);
        return {
            data: result,
            message: "푸시 알림이 성공적으로 전송되었습니다"
        };
    }
}
