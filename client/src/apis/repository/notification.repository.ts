import { baseClient } from "@/modules/fetchClient";
import { ISubscription } from "@/types/subscription.type";

export const createSubscriptionToDB = async (subscription: ISubscription) => {
    return await baseClient.post<ISubscription>("/notification", { notification: subscription });
};

export const deleteSubscriptionFromDB = async () => {
    return await baseClient.delete<void>("/notification");
};

export const createPushNotification = async (userIds: string[]) => {
    return await baseClient.post<{ success: boolean }>("/notification/push", {
        userIds,
    });
};
