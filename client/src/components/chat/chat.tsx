"use client";

import style from "./chat.module.scss";
import MessageInput from "./messageInput/messageInput";
import MessageList from "./messageList/messageList";
import ScrollToBottom from "./scrollToBottom/scrollToBottom";
import { Message } from "@/types/chat.type";

interface ChatProps {
    className: string;
    toggleChat: (shouldClose?: boolean) => void;
    messages: Message[];
    roomTitle: string;
}

const Chat = (props: ChatProps) => {
    const { className, toggleChat, messages, roomTitle } = props;

    return (
        <div className={`${className} ${style.chat_container}`}>
            <div className={style.chat_header}>
                <span className={style.chat_text}>{roomTitle}</span>
                <button className={style.close_button} onClick={() => toggleChat(true)} />
            </div>
            <div className={style.chat_main}>
                <ScrollToBottom>
                    <MessageList messages={messages} />
                </ScrollToBottom>
            </div>
            <div className={style.chat_bottom}>
                <MessageInput />
            </div>
        </div>
    );
};

export default Chat;
