import { FetchClient } from "@/modules/fetchClient";
import { AiChatMessage } from "@/types/chat.type";

const aiClient = FetchClient.create({
    baseURL: "https://openrouter.ai/api/v1",
    config: {
        headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_OPENROUTER_API_KEY}`,
            "HTTP-Referer": "https://meetsin.link",
            "X-Title": "MEESTIN",
            "Content-Type": "application/json",
        },
    },
});

export const createAiSummary = async (messages: AiChatMessage[]) => {
    return await aiClient.post("/chat/completions", {
        model: "meta-llama/llama-4-scout:free",
        messages: [
            {
                role: "system",
                content:
                    "You are a conversation summarizer. Your response MUST be a valid JSON object and nothing else. The JSON object must have exactly two fields: 'summary_title' and 'summary_detail'. For 'summary_title', create a humorous, witty, playful short phrase capturing the essence of the conversation. Use exaggerated, dramatic, or over-the-top expressions to make it sound lively and entertaining, as if describing an epic or chaotic event. The title should be creative, not factual, and must feel fun and dynamic. Avoid simply repeating example titles; always invent a new one. For 'summary_detail', write a natural, detailed summary of the conversation's key points, written in the same language as the conversation. Do NOT add any other text, explanation, or formatting. Only return the JSON object.",
            },
            ...messages,
            {
                role: "user",
                content:
                    "Please summarize the conversation above, using the same language as the conversation you are summarizing. Your response MUST be a valid JSON object and nothing else. The JSON object must have exactly two fields: 'summary_title' and 'summary_detail'.",
            },
        ],
    });
};
