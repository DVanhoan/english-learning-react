import type { Category } from "./category.type";
import type { SuccessResponse } from "./common.type";
import type { UserSummary } from "./user.type";

export interface PostRequest {
  title: string;
  excerpt: string;
  content: string;
  categoryId: number;
  authorId: number;
  status: "DRAFT" | "PENDING" | "PUBLIC";
}

export interface Post {
  id: number;
  title: string;
  excerpt: string;
  content: string;
  contentText: string;
  category: Category;
  author: UserSummary;
  status: "DRAFT" | "PENDING" | "PUBLIC";
  tags: string;
  slug: string;
  readingTimeMinutes: number;
  thumbnailUrl: string;
  createdAt: string;
  updatedAt: string;
}

export type PostResponse = SuccessResponse<Post>;
export type ListPostResponse = SuccessResponse<Post[]>;
