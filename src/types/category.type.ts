import type { SuccessResponse } from "./common.type";

export interface Category {
  courseCount: number;
  id: number;
  title: string;
  slug: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CategoryRequest {
  title: string;
  description?: string;
}

export type CategoryResponse = SuccessResponse<Category>;
