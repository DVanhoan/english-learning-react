import type { SuccessResponse } from "./common.type";

export interface ChatMessage {
    id: number;
    role: "user" | "ai";
    text: string;
};


export interface AIChatResponse {
    userText: string;
    aiText: string;
    aiAudioUrl: string | null;
}

export type AIChatApiResponse = SuccessResponse<AIChatResponse>;


