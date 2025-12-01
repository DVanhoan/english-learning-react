import http from "./http";
import { DICTATION_PATH } from "./path";
import type {
    DictationLessonListResponse,
    DictationLessonResponse,
    DictationTopicListResponse,
    DictationTopicResponse,
    SuccessResponseNoData,
} from "@/types/dictation.type";
import type {
    DictationTopicRequest,
    DictationLessonRequest
} from "@/types/dictation.type"

export class DictationApi {

    static getAllTopics = async () => {
        const response = await http.get<DictationTopicListResponse>(
            DICTATION_PATH.TOPICS
        );
        return response.data;
    };

    static getTopicById = async (id: number | string) => {
        const response = await http.get<DictationTopicResponse>(
            DICTATION_PATH.TOPIC_BY_ID(id)
        );
        return response.data;
    };

    static getLessonsByTopic = async (topicId: number | string) => {
        const response = await http.get<DictationLessonListResponse>(
            DICTATION_PATH.LESSONS_BY_TOPIC(topicId)
        );
        return response.data;
    };

    static getLessonById = async (id: number | string) => {
        const response = await http.get<DictationLessonResponse>(
            DICTATION_PATH.LESSON_BY_ID(id)
        );
        return response.data;
    };


    static createTopic = async (data: DictationTopicRequest, thumbnail?: File) => {
        const formData = new FormData();

        const jsonBlob = new Blob([JSON.stringify(data)], {
            type: "application/json",
        });
        formData.append("data", jsonBlob);

        if (thumbnail) {
            formData.append("thumbnail", thumbnail);
        }

        const response = await http.post<DictationTopicResponse>(
            DICTATION_PATH.TOPICS,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data;
    };

    static updateTopic = async (
        id: number | string,
        data: DictationTopicRequest,
        thumbnail?: File
    ) => {
        const formData = new FormData();
        const jsonBlob = new Blob([JSON.stringify(data)], {
            type: "application/json",
        });
        formData.append("data", jsonBlob);

        if (thumbnail) {
            formData.append("thumbnail", thumbnail);
        }

        const response = await http.put<DictationTopicResponse>(
            DICTATION_PATH.TOPIC_BY_ID(id),
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data;
    };

    static deleteTopic = async (id: number | string) => {
        const response = await http.delete<SuccessResponseNoData>(
            DICTATION_PATH.TOPIC_BY_ID(id)
        );
        return response.data;
    };


    static createLesson = async (data: DictationLessonRequest, audio?: File) => {
        const formData = new FormData();

        const jsonBlob = new Blob([JSON.stringify(data)], {
            type: "application/json",
        });
        formData.append("data", jsonBlob);

        if (audio) {
            formData.append("audio", audio);
        }

        const response = await http.post<DictationLessonResponse>(
            DICTATION_PATH.LESSONS,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data;
    };

    static updateLesson = async (
        id: number | string,
        data: DictationLessonRequest,
        audio?: File
    ) => {
        const formData = new FormData();
        const jsonBlob = new Blob([JSON.stringify(data)], {
            type: "application/json",
        });
        formData.append("data", jsonBlob);

        if (audio) {
            formData.append("audio", audio);
        }

        const response = await http.put<DictationLessonResponse>(
            DICTATION_PATH.LESSON_BY_ID(id),
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data;
    };

    static deleteLesson = async (id: number | string) => {
        const response = await http.delete<SuccessResponseNoData>(
            DICTATION_PATH.LESSON_BY_ID(id)
        );
        return response.data;
    };
}