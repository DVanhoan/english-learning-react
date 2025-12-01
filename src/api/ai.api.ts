import http from "./http";
import { AI_PATH } from "./path";
import type { AIChatApiResponse } from "@/types/ai.type";

export class AIApi {
    static sendAudioToAI = async (audioBlob: Blob) => {
        const formData = new FormData();
        const file = new File([audioBlob], "voice.wav", { type: "audio/wav" });
        formData.append("audio", file);

        const response = await http.post<AIChatApiResponse>(
            AI_PATH.CHAT,
            formData,
            {
                headers: {
                    "Content-Type": "multipart/form-data"
                }
            }
        );

        return response.data.data;
    }
}