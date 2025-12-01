import http from "./http";
import { LESSON_PATH } from "./path";
import type {
  SuccessResponse,
  SuccessResponseNoData,
} from "@/types/common.type";
import type {
  Lesson,
  LessonRequest,
  LessonResponse,
  ChangeOrderRequest,
} from "../types/lesson.type";

export class LessonApi {
  static getByChapterId = async (chapterId: number) => {
    const response = await http.get<SuccessResponse<Lesson[]>>(
      LESSON_PATH.BY_CHAPTER_ID(chapterId)
    );
    return response.data;
  };

  static getById = async (id: number) => {
    const response = await http.get<LessonResponse>(LESSON_PATH.BY_ID(id));
    return response.data;
  };

  static create = async (payload: {
    lesson: LessonRequest;
    documentFile?: File | null;
    video?: File | null;
  }) => {
    const form = new FormData();
    form.append(
      "lesson",
      new Blob([JSON.stringify(payload.lesson)], { type: "application/json" })
    );
    if (payload.documentFile) form.append("documentFile", payload.documentFile);
    if (payload.video) form.append("video", payload.video);
    const response = await http.post<LessonResponse>(LESSON_PATH.BASE, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  };

  static update = async (
    id: number,
    payload: {
      lesson: LessonRequest;
      documentFile?: File | null;
      video?: File | null;
    }
  ) => {
    const form = new FormData();
    form.append(
      "lesson",
      new Blob([JSON.stringify(payload.lesson)], { type: "application/json" })
    );
    if (payload.documentFile) form.append("documentFile", payload.documentFile);
    if (payload.video) form.append("video", payload.video);
    const response = await http.put<LessonResponse>(
      LESSON_PATH.BY_ID(id),
      form,
      {
        headers: { "Content-Type": "multipart/form-data" },
      }
    );
    return response.data;
  };

  static updateOrder = async (
    chapterId: number,
    request: ChangeOrderRequest
  ) => {
    const response = await http.patch<SuccessResponseNoData>(
      LESSON_PATH.ORDER(chapterId),
      request
    );
    return response.data;
  };

  static delete = async (id: number) => {
    const response = await http.delete<SuccessResponseNoData>(
      LESSON_PATH.BY_ID(id)
    );
    return response.data;
  };
}
