import type {
  ChangeOrderRequest,
  Chapter,
  ChapterRequest,
  ChapterResponse,
} from "@/types/chapter.type";
import http from "./http";
import { CHAPTER_PATH } from "./path";
import type {
  SuccessResponse,
  SuccessResponseNoData,
} from "@/types/common.type";

export class ChapterApi {
  static create = async (request: ChapterRequest) => {
    const response = await http.post<ChapterResponse>(
      CHAPTER_PATH.BASE,
      request
    );
    return response.data;
  };
  static update = async (request: ChapterRequest, id: number) => {
    const response = await http.put<ChapterResponse>(
      CHAPTER_PATH.BY_ID(id),
      request
    );
    return response.data;
  };
  static delete = async (chapterId: number) => {
    const response = await http.delete<ChapterResponse>(
      CHAPTER_PATH.BY_ID(chapterId)
    );
    return response.data;
  };
  static getChaptersByCourseId = async (courseId: number) => {
    const response = await http.get<SuccessResponse<Chapter[]>>(
      CHAPTER_PATH.BY_COURSE_ID(courseId)
    );
    return response.data;
  };
  static getChapterById = async (chapterId: number) => {
    const response = await http.get<ChapterResponse>(
      CHAPTER_PATH.BY_ID(chapterId)
    );
    return response.data;
  };

  static updateOrder = async (
    request: ChangeOrderRequest,
    courseId: number
  ) => {
    const response = await http.patch<SuccessResponseNoData>(
      `${CHAPTER_PATH.BASE}/order/${courseId}`,
      request
    );
    return response.data;
  };
}
