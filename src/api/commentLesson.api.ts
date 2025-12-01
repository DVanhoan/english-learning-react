import http from "./http";
import { COMMENT_PATH } from "./path";
import type {
    SuccessResponse,
    SuccessResponseNoData,
} from "@/types/common.type";
import type { Comment, CommentRequest } from "@/types/commentLeason.type";

export class CommentApi {
    /**
     * Lấy tất cả bình luận (gốc) cho một bài học
     */
    static getCommentsByLesson = async (lessonId: number | string) => {
        const response = await http.get<SuccessResponse<Comment[]>>(
            COMMENT_PATH.BY_LESSON_ID(lessonId)
        );
        return response.data;
    };

    /**
     * Tạo một bình luận mới
     */
    static createComment = async (data: CommentRequest) => {
        const response = await http.post<SuccessResponse<Comment>>(
            COMMENT_PATH.BASE,
            data
        );
        return response.data;
    };

    // TODO: Bạn có thể thêm các API xóa, sửa, trả lời bình luận sau
}