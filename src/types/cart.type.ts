import type { Course } from "./course.type";

export interface AddToCartRequest {
    courseId: number;
}

export interface CartResponse {
    items: Course[];
    totalItems: number;
    subtotal: number;
    totalOriginalPrice: number;
}