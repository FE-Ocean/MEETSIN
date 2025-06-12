import UserCharacter from "@/components/common/userCharacter/userCharacter";
import { formatTimeFromISO } from "@/utils";
import { Message } from "@/types/chat.type";
import style from "./receivedMessage.module.scss";

const ReceivedMessage = (props: Message) => {
    const { userName, message, time, characterId } = props;

    return (
        <li className={style.container}>
            <UserCharacter characterId={characterId} />
            <div className={style.wrapper}>
                <span className={style.user_name}>{userName}</span>
                <div className={style.message_wrapper}>
                    <div className={style.message_main}>{message}</div>
                    <span className={style.time}>{formatTimeFromISO(time)}</span>
                </div>
            </div>
        </li>
    );
};

export default ReceivedMessage;
