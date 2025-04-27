import { AiChatMessage, IMessage } from "@/types/chat.type";

export const convertMessagesForAiSummary = (messages: IMessage[]): AiChatMessage[] => {
    return messages.map((msg) => ({
        role: "user",
        content: `${msg.nickname}: ${msg.message}`,
    }));
};
