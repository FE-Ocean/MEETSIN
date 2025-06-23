import webpush from "web-push";
import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model, Types } from "mongoose";
import { User } from "src/modules/users/schemas/user.schema";
import { SubscriptionDTO } from "./dto/subscription.dto";
import { RoomsService } from "../rooms/rooms.service";

@Injectable()
export class NotificationService {
    constructor(
        @InjectModel(User.name) private readonly userModel: Model<User>,
        private readonly roomsService: RoomsService,
    ) {
        webpush.setVapidDetails(
            "mailto:meetsin@meetsin.com", // 변경하기
            process.env.WEB_PUSH_PUBLIC_KEY,
            process.env.WEB_PUSH_PRIVATE_KEY,
        );
    }

    createSubscription(userId: Types.ObjectId, subscription: SubscriptionDTO) {
        return this.userModel.updateOne({ _id: userId }, { $set: { notification: subscription } });
    }

    async deleteSubscription(userId: Types.ObjectId) {
        const deletedSubscriptionObject = await this.userModel.updateOne(
            { _id: userId },
            { $unset: { notification: "" } },
        );

        if (!deletedSubscriptionObject) {
            throw new Error("구독 객체가 제거되지 않았습니다.");
        }

        return deletedSubscriptionObject;
    }

    async createPushNotification(userIds: string[]) {
        const message = JSON.stringify({
            title: "시간이 종료되었습니다.",
            body: "타이머 설정 시간이 종료되었습니다.",
            icon: "/icons/timer.svg",
        });

        try {
            const subscriptions = await this.roomsService.getRoomUserSubscriptions(userIds);

            const promises = subscriptions.map((subscription) =>
                webpush.sendNotification(subscription, message).catch((error: Error) => {
                    console.error(
                        `${subscription.endpoint}로의 전송에 에러가 발생했습니다.`,
                        error,
                    );
                }),
            );

            return await Promise.all(promises);
        } catch (error) {
            throw new Error("하나 이상의 알림 전송이 실패했습니다.");
        }
    }
}
