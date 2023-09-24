"use client";

import { useEffect, useState } from "react";
import Message from "./message/message";
import style from "./chat.module.scss";
import { socket } from "../../socket";
import MessageInput from "./messageInput/messageInput";

interface IChatProps {
    className : string
};

interface IMessage {
    nickname : string,
    message : string,
    time : string
};

const Chat = (props : IChatProps) => {

    const { className } = props;

    const [messages, setMessages] = useState<IMessage[]>([]);

    useEffect(() => {

        const handleNewMessage = (message : IMessage) => {
            setMessages((prev) => [...prev, message]);
        };

        socket.connect();
        socket.on("new_message", handleNewMessage);

        return () => {
            socket.disconnect();
            socket.off("new_message", handleNewMessage);
        };

    },[]);

    return (
        <div className={`${className} ${style.chat_container}`}>
            <div className={style.chat_header}>
                <span className={style.chat_text}>Chat</span>
                <button className={style.close_button} />
            </div>
            <div className={style.chat_main}>
                {messages.map((message, index) => (
                    <Message
                        key={index}
                        message={message.message} 
                        nickname={message.nickname}
                        time={message.time} 
                    />
                ))}
            </div>
            <div className={style.chat_bottom}>
                <MessageInput />
            </div>
        </div>
    );
};

export default Chat;