import { IMessage } from "@/types/chat.type";
import MyMessage from "../myMessage/myMessage";
import ReceivedMessage from "../receivedMessage/receivedMessage";
import style from "./messageList.module.scss";
import { useGetUserInfo } from "@/apis/service/user.service";

interface Props {
    messages: IMessage[];
}

const MessageList = (props: Props) => {
    const { messages } = props;

    const { data: user } = useGetUserInfo();
    const isMyMessage = (nickname: string) => nickname === user?.userName;

    return (
        <ul className={style.message_list}>
            {messages.map((message, index) => {
                return isMyMessage(message.nickname) ? (
                    <MyMessage key={index} message={message.message} time={message.time} />
                ) : (
                    <ReceivedMessage
                        key={index}
                        message={message.message}
                        time={message.time}
                        nickname={message.nickname}
                    />
                );
            })}
        </ul>
    );
};

export default MessageList;
