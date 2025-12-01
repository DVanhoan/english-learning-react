import type { Category, CategoryResponse } from "@/types/category.type";
import http from "./http";
import { CATEGORIES_POST_PATH } from "./path";
import type {
  PaginationResponse,
  SuccessResponseNoData,
} from "@/types/common.type";

export class CategoriesPostApi {
  static getCategories = async (
    pageNumber: number,
    pageSize: number,
    keyword: string,
    sorts?: string
  ) => {
    const params: any = { pageNumber, pageSize, keyword };
    if (sorts) params.sorts = sorts;

    const response = await http.get<PaginationResponse<Category>>(
      CATEGORIES_POST_PATH.BASE,
      { params }
    );
    return response.data;
  };

  static getById = async (id: number) => {
    const response = await http.get<CategoryResponse>(
      CATEGORIES_POST_PATH.BY_ID(id)
    );
    return response.data;
  };

  static create = async (data: { title: string; description?: string }) => {
    const response = await http.post<CategoryResponse>(
      CATEGORIES_POST_PATH.BASE,
      data
    );
    return response.data;
  };

  static update = async (
    id: number,
    data: { title: string; description?: string }
  ) => {
    const response = await http.put<CategoryResponse>(
      CATEGORIES_POST_PATH.BY_ID(id),
      data
    );
    return response.data;
  };

  static delete = async (id: number) => {
    const response = await http.delete<SuccessResponseNoData>(
      CATEGORIES_POST_PATH.BY_ID(id)
    );
    return response.data;
  };
}
