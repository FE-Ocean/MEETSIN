import { useState, useEffect } from "react";
import {
    startSubscription,
    cancelSubscription,
    getSubscriptionFromBrowser,
    useCreateSubscriptionToDB,
    useDeleteSubscriptionFromDB,
    useGetSubscriptionFromDB,
} from "@/apis/service/notification.service";
import style from "./notificationSwitch.module.scss";

const NotificationSwitch = () => {
    const {
        data: DBSubscription,
        isLoading: isDBLoading,
        error: dbError,
    } = useGetSubscriptionFromDB();
    const [hasSubscription, setHasSubscription] = useState<boolean>();

    useEffect(() => {
        if (isDBLoading) return;

        const getActiveSubscription = async () => {
            try {
                // DB 에러가 있거나 DB 구독이 없으면 구독 없음
                if (dbError || !DBSubscription) {
                    setHasSubscription(false);
                    return;
                }

                // 브라우저 구독 확인
                const browserSubscription = await getSubscriptionFromBrowser();
                setHasSubscription(!!browserSubscription);
            } catch (error) {
                console.error("브라우저 구독 확인 실패:", error);
                setHasSubscription(false);
            }
        };

        getActiveSubscription();
    }, [DBSubscription, isDBLoading, dbError]);

    const { mutate: createSubscription } = useCreateSubscriptionToDB();
    const { mutate: deleteSubscription } = useDeleteSubscriptionFromDB();

    const toggleNotificationSwitch = async (isOn: boolean) => {
        try {
            if (isOn) {
                const subscription = (await startSubscription()) as PushSubscription;
                if (subscription) {
                    createSubscription({ subscription });
                }
            } else {
                const cancelSuccess = await cancelSubscription();
                if (cancelSuccess) {
                    deleteSubscription();
                }
            }

            setHasSubscription(isOn);
        } catch (error) {
            console.error(error);
        }
    };

    return hasSubscription ? (
        <button
            type="button"
            className={style.on}
            onClick={() => toggleNotificationSwitch(false)}
        />
    ) : (
        <button
            type="button"
            className={style.off}
            onClick={() => toggleNotificationSwitch(true)}
        />
    );
};
export default NotificationSwitch;
