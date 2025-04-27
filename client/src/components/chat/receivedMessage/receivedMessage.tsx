import { formatTimeFromISO } from "@/utils";
import style from "./receivedMessage.module.scss";

interface MessageProps {
    nickname: string;
    message: string;
    time: string;
}

const ReceivedMessage = (props: MessageProps) => {
    const { nickname, message, time } = props;

    return (
        <li className={style.container}>
            <div className={style.avatar} />
            <div className={style.wrapper}>
                <span className={style.nickname}>{nickname}</span>
                <div className={style.message_wrapper}>
                    <div className={style.message_main}>{message}</div>
                    <span className={style.time}>{formatTimeFromISO(time)}</span>
                </div>
            </div>
        </li>
    );
};

export default ReceivedMessage;
