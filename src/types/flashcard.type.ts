import type { UserSummary } from "./user.type";
import type { SuccessResponse } from "./common.type";

// --- RESPONSE (Dữ liệu nhận về) ---
export interface Flashcard {
    id: number;
    term: string;
    definition: string;
}

export interface FlashcardSet {
    id: number;
    title: string;
    description: string;
    category: string;
    thumbnailUrl: string | null;
    isPublic: boolean;
    studyCount: number;
    rating: number;
    ratingCount: number;
    createdAt: string;
    author: UserSummary;
    cards: Flashcard[];
    cardCount: number;
}

export type FlashcardSetResponse = SuccessResponse<FlashcardSet>;

// --- REQUEST (Dữ liệu gửi đi) ---
export interface FlashcardRequestData {
    term: string;
    definition: string;
}

export interface FlashcardSetRequest {
    title: string;
    description: string;
    category: string;
    isPublic: boolean;
    cards: FlashcardRequestData[];
}