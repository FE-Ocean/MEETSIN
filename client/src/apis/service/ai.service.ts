import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createAiSummary } from "../repository/ai.repository";
import { AiChatMessage } from "@/types/chat.type";

export const useCreateAiSummary = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: (messages: AiChatMessage[]) => {
            const cacheKey = ["chat-summary", messages.map((msg) => msg.content).join("")];
            const cachedData = queryClient.getQueryData(cacheKey);

            // if (cachedData) {
            //     return Promise.resolve(cachedData);
            // }

            return createAiSummary(messages).then((response) => {
                queryClient.setQueryData(cacheKey, response);
                return response;
            });
        },
    });
};
