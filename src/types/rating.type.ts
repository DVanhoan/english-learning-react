import type { UserSummary } from "./user.type";

export interface RatingRequest {
    courseId: number;
    rating: number;
    message: string;
}

export interface Rating {
    id: number;
    rating: number;
    message: string;
    courseId: number;
    author: UserSummary;
    createdAt: string;
    updatedAt: string;
}