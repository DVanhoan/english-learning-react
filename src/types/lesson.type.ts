import type { SuccessResponse } from "./common.type";

export type StatusCourse = "PUBLIC" | "HIDDEN";

export interface LessonRequest {
  title: string;
  description?: string;
  content: string;
  isPreview: boolean;
  duration: number;
  status: StatusCourse;
  chapterId?: number;
}

export interface Lesson {
  id: number;
  createdAt: string;
  updatedAt: string;
  title: string;
  description: string;
  orderIndex: number;
  duration: number;
  content: string;
  videoUrl?: string;
  attachmentUrl?: string;
  isPreview: boolean;
  status: StatusCourse;
  chapterId: number;
}

export interface Order {
  id: number;
  orderIndex: number;
}
export type ChangeOrderRequest = Order[];

export type LessonResponse = SuccessResponse<Lesson>;
