import http from "./http";
import { FLASHCARD_PATH } from "./path";
import type {
    PaginationResponse,
    SuccessResponse,
    SuccessResponseNoData,
} from "@/types/common.type";
import type {
    FlashcardSet,
    FlashcardSetRequest,
} from "@/types/flashcard.type";

export class FlashcardApi {


    static getAll = async (params: {
        page?: number;
        size?: number;
        keyword?: string;
        category?: string;
        sort?: string;
    }) => {
        const response = await http.get<PaginationResponse<FlashcardSet>>(
            FLASHCARD_PATH.BASE,
            { params }
        );
        return response.data;
    };

    static getManagement = async (params: {
        page?: number;
        size?: number;
        keyword?: string;
        category?: string;
        sort?: string;
    }) => {
        const response = await http.get<PaginationResponse<FlashcardSet>>(
            FLASHCARD_PATH.MANAGEMENT,
            { params }
        );
        return response.data;
    }

    static getById = async (id: number | string) => {
        const response = await http.get<SuccessResponse<FlashcardSet>>(
            FLASHCARD_PATH.BY_ID(id)
        );
        return response.data;
    };

    static create = async (data: FlashcardSetRequest, thumbnail?: File) => {
        const formData = new FormData();

        const jsonBlob = new Blob([JSON.stringify(data)], {
            type: "application/json",
        });
        formData.append("data", jsonBlob);

        if (thumbnail) {
            formData.append("thumbnail", thumbnail);
        }

        const response = await http.post<SuccessResponse<FlashcardSet>>(
            FLASHCARD_PATH.BASE,
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data;
    };

    static update = async (
        id: number | string,
        data: FlashcardSetRequest,
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

        const response = await http.put<SuccessResponse<FlashcardSet>>(
            FLASHCARD_PATH.BY_ID(id),
            formData,
            {
                headers: { "Content-Type": "multipart/form-data" },
            }
        );
        return response.data;
    };

    static delete = async (id: number | string) => {
        const response = await http.delete<SuccessResponseNoData>(
            FLASHCARD_PATH.BY_ID(id)
        );
        return response.data;
    };
}