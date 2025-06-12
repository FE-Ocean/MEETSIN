import { Message } from "@/types/chat.type";
import MyMessage from "../myMessage/myMessage";
import ReceivedMessage from "../receivedMessage/receivedMessage";
import { useGetUserInfo } from "@/apis/service/user.service";
import style from "./messageList.module.scss";

interface Props {
    messages: Message[];
}

const MessageList = (props: Props) => {
    const { messages } = props;

    const { data: user } = useGetUserInfo();
    const isMyMessage = (userName: string) => userName === user?.userName;

    return (
        <ul className={style.message_list}>
            {messages.map((message, index) => {
                return isMyMessage(message.userName) ? (
                    <MyMessage key={index} message={message.message} time={message.time} />
                ) : (
                    <ReceivedMessage
                        key={index}
                        message={message.message}
                        time={message.time}
                        userName={message.userName}
                        characterId={message.characterId}
                    />
                );
            })}
        </ul>
    );
};

export default MessageList;
