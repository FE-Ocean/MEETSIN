import React from "react";
import style from "./summaryButton.module.scss";
import { IMessage } from "@/types/chat.type";
import { useCreateAiSummary } from "@/apis/service/ai.service";
import { convertMessagesForAiSummary } from "@/utils/chat.util";

interface SummaryButtonProps {
    messages: IMessage[]; // Assuming messages is an array of strings for simplicity
}
function SummaryButton({ messages }: SummaryButtonProps) {
    const { mutate, isSuccess, isPending } = useCreateAiSummary();

    const convertedMessages = convertMessagesForAiSummary(messages);

    const handleSummaryButton = () => {
        mutate(convertedMessages, {
            onSuccess: (data) => {
                const summary = JSON.parse(data.choices[0].message.content);
                console.log("title:", summary.summary_title);
                console.log("detail:", summary.summary_detail);
            },
            onError: (error) => {
                console.error("Error creating AI summary:", error);
            },
        });
    };

    return (
        <button className={style.summary} disabled={!messages.length} onClick={handleSummaryButton}>
            ✨
        </button>
    );
}

export default SummaryButton;
