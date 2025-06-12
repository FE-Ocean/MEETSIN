"use client";

import { useRef, useState } from "react";
import useMessage from "@/components/chat/messageInput/hooks/useMessage";
import useAdjustHeight from "@/components/chat/messageInput/hooks/useAdjustHeight";
import useResetHeight from "@/components/chat/messageInput/hooks/useResetHeight";
import { useGetUserInfo } from "@/apis/service/user.service";
import { useAtom } from "jotai";
import { isChatFocusedAtom } from "@/jotai/atom";
import style from "./messageInput.module.scss";

const MessageInput = () => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);

    const [isComposing, setIsComposing] = useState<boolean>(false);
    const [isChatFocused, setIsChatFocused] = useAtom(isChatFocusedAtom);
    const { data: user } = useGetUserInfo();

    const { message, onChange, sendMessage } = useMessage({
        inputRef: textareaRef,
        payload: { userName: user?.userName },
    });

    const adjustHeight = useAdjustHeight({ inputRef: textareaRef });
    const resetHeight = useResetHeight({ inputRef: textareaRef });

    const submitMessage = () => {
        sendMessage();
        resetHeight();
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        submitMessage();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (isComposing) return;
        if (!e.shiftKey && e.key === "Enter") {
            e.preventDefault();
            submitMessage();
            return;
        }
    };

    return (
        <form className={`${style.input_container}`} onSubmit={handleSubmit}>
            <textarea
                className={style.message_textarea}
                placeholder="메세지를 입력하세요."
                aria-label="메세지 입력"
                rows={1}
                ref={textareaRef}
                value={message}
                onChange={(e) => {
                    onChange(e);
                    adjustHeight();
                }}
                onKeyDown={handleKeyDown}
                onCompositionStart={() => setIsComposing(true)}
                onCompositionEnd={() => setIsComposing(false)}
                onFocus={() => setIsChatFocused(true)}
                onBlur={() => setIsChatFocused(false)}
            />
            <button type="submit" className={`${style.send_button} ${!!message && style.active}`} />
        </form>
    );
};

export default MessageInput;
