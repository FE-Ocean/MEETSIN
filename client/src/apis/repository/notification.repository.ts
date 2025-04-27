import { baseClient } from "@/modules/fetchClient";
import { Subscription } from "@/types/subscription.type";

export const createSubscriptionToDB = async (subscription: Subscription) => {
    return await baseClient.post<Subscription>("/notification", { notification: subscription });
};

export const deleteSubscriptionFromDB = async () => {
    return await baseClient.delete<void>("/notification");
};

export const createPushNotification = async (userIds: string[]) => {
    return await baseClient.post<{ success: boolean }>("/notification/push", {
        userIds,
    });
};
