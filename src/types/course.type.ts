import type { Category } from "./category.type";
import type { Chapter } from "./chapter.type";
import type { SuccessResponse } from "./common.type";
import type { UserSummary } from "./user.type";

export type CourseStatus = "PUBLIC" | "HIDDEN";

export interface CourseRequest {
  title: string;
  shortDescription: string;
  detailDescription: string;
  learningOutcomes: string;
  requirements: string;
  status: CourseStatus;
  price: number;
  discountPrice?: number | null;
  categoryId: number;
  teacherId: number;
  isFree: boolean;
}

export interface Course {
  id: number;
  title: string;
  shortDescription: string;
  detailDescription: string;
  learningOutcomes: string;
  requirements: string;
  status: CourseStatus;
  price: number;
  discountPrice?: number | null;
  isFree: boolean;
  category: Category;
  teacher: UserSummary;
  thumbnailUrl: string | null;
  createdAt: string;
  updatedAt: string;
  duration?: number;
  numberOfLessons: number;
  chaptersDetails: Chapter[];
  averageRating?: number | null;
  ratingCount?: number;
  firstLessonId?: number;
}

export type CourseResponse = SuccessResponse<Course>;
