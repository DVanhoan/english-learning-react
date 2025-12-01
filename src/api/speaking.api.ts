import http from "./http";
import { SPEAKING_PATH } from "./path";
import type { SuccessResponse, SuccessResponseNoData } from "@/types/common.type";
import type { SpeakingRoom, SpeakingTopic, SpeakingTopicRequest } from "@/types/speaking.type";

export class SpeakingApi {
    static getTopics = async () => {
        const response = await http.get<SuccessResponse<SpeakingTopic[]>>(
            SPEAKING_PATH.TOPICS
        );
        return response.data;
    };

    static createTopic = async (data: SpeakingTopicRequest, image?: File) => {
        const formData = new FormData();
        const jsonBlob = new Blob([JSON.stringify(data)], { type: "application/json" });
        formData.append("data", jsonBlob);
        if (image) formData.append("image", image);

        const response = await http.post<SuccessResponse<SpeakingTopic>>(
            SPEAKING_PATH.TOPICS,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data;
    };

    static updateTopic = async (id: number, data: SpeakingTopicRequest, image?: File) => {
        const formData = new FormData();
        const jsonBlob = new Blob([JSON.stringify(data)], { type: "application/json" });
        formData.append("data", jsonBlob);
        if (image) formData.append("image", image);

        const response = await http.put<SuccessResponse<SpeakingTopic>>(
            `${SPEAKING_PATH.TOPICS}/${id}`,
            formData,
            { headers: { "Content-Type": "multipart/form-data" } }
        );
        return response.data;
    };

    static deleteTopic = async (id: number) => {
        const response = await http.delete<SuccessResponseNoData>(
            `${SPEAKING_PATH.TOPICS}/${id}`
        );
        return response.data;
    };

    static getActiveRooms = async () => {
        const response = await http.get<SuccessResponse<SpeakingRoom[]>>(
            SPEAKING_PATH.ROOMS
        );
        return response.data;
    };

    static createRoom = async (topicId: number, roomName: string) => {
        const response = await http.post<SuccessResponse<SpeakingRoom>>(
            SPEAKING_PATH.ROOMS,
            { topicId, roomName }
        );
        return response.data;
    };
}