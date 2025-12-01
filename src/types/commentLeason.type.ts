import type { UserSummary } from "./user.type"; // Giả sử bạn có type này


export interface CommentRequest {
    content: string;
    lessonId: number;
    parentId?: number; // Dùng để trả lời bình luận
}

// Dữ liệu nhận về
export interface Comment {
    id: number;
    author: UserSummary;
    content: string;
    date: string;
    likes: number;
    isLikes: boolean;
    replies?: Comment[];
}