import { formatTimeFromISO } from "@/utils";
import style from "./myMessage.module.scss";

interface MessageProps {
    message: string;
    time: string;
}

const MyMessage = (props: MessageProps) => {
    const { message, time } = props;

    return (
        <li className={style.container}>
            <div className={style.wrapper}>
                <div className={style.message_wrapper}>
                    <span className={style.time}>{formatTimeFromISO(time)}</span>
                    <div className={style.message_main}>{message}</div>
                </div>
            </div>
        </li>
    );
};

export default MyMessage;
