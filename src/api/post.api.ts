import type {
  ListPostResponse,
  Post,
  PostRequest,
  PostResponse,
} from "@/types/post.type";
import http from "./http";
import { POST_PATH } from "./path";
import type {
  PaginationResponse,
  SuccessResponseNoData,
} from "@/types/common.type";

export class PostApi {

  static createPost = async (data: PostRequest, thumbnail: File) => {
    const formData = new FormData();
    formData.append(
      "post",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );
    formData.append("thumbnail", thumbnail);

    const response = await http.post<PostResponse>(POST_PATH.BASE, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };

  static getPosts = async (
    isPublic: boolean,
    pageNumber: number,
    pageSize: number,
    keyword: string,
    sorts?: string | string[],
    categoryId?: number
  ) => {
    const params = new URLSearchParams();
    params.append("pageNumber", String(pageNumber));
    params.append("pageSize", String(pageSize));
    params.append("keyword", keyword ?? "");

    if (sorts) {
      if (Array.isArray(sorts)) {
        sorts.forEach((s) => params.append("sorts", s));
      } else {
        const parts = sorts.includes(",") ? sorts.split(",") : [sorts];
        parts.forEach((p) => p && params.append("sorts", p));
      }
    }

    if (categoryId !== undefined && categoryId !== null) {
      params.append("categoryId", String(categoryId));
    }
    let url;
    if (!isPublic) url = `${POST_PATH.BASE}?${params.toString()}`;
    else url = `${POST_PATH.GET_PUBLIC}?${params.toString()}`;
    const response = await http.get<PaginationResponse<Post>>(url);
    return response.data;
  };

  static getMyPosts = async (
    pageNumber: number,
    pageSize: number,
    keyword: string,
    sorts?: string | string[],
    categoryId?: number
  ) => {
    const params = new URLSearchParams();
    params.append("pageNumber", String(pageNumber));
    params.append("pageSize", String(pageSize));
    params.append("keyword", keyword ?? "");

    if (sorts) {
      if (Array.isArray(sorts)) {
        sorts.forEach((s) => params.append("sorts", s));
      } else {
        const parts = sorts.includes(",") ? sorts.split(",") : [sorts];
        parts.forEach((p) => p && params.append("sorts", p));
      }
    }

    if (categoryId !== undefined && categoryId !== null) {
      params.append("categoryId", String(categoryId));
    }
    const url = `${POST_PATH.BASE}/me?${params.toString()}`;
    const response = await http.get<PaginationResponse<Post>>(url);
    return response.data;
  };

  static getRelatedPosts = async (id: number, limit: number = 6) => {
    const response = await http.get<ListPostResponse>(
      POST_PATH.GET_RELATED_BY_ID(id),
      { params: { id, limit } }
    );
    return response.data;
  };

  static getLatestPosts = async (limit: number = 3) => {
    const response = await http.get<ListPostResponse>(
      `${POST_PATH.GET_PUBLIC}/latest`,
      {
        params: { limit },
      }
    );
    return response.data;
  };
  static getPost = async (id: number) => {
    const response = await http.get<PostResponse>(POST_PATH.BY_ID(id), {});
    return response.data;
  };

  static deletePost = async (id: number) => {
    const response = await http.delete<SuccessResponseNoData>(
      POST_PATH.BY_ID(id)
    );
    return response.data;
  };

  static updatePost = async (
    data: PostRequest,
    thumbnail: File,
    id: number
  ) => {
    const formData = new FormData();
    formData.append(
      "post",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );
    formData.append("thumbnail", thumbnail);

    const response = await http.put<PostResponse>(
      POST_PATH.BY_ID(id),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  };

  static createMyPost = async (data: PostRequest, thumbnail: File) => {
    const formData = new FormData();
    formData.append(
      "post",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );
    formData.append("thumbnail", thumbnail);

    const response = await http.post<PostResponse>(POST_PATH.ME, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  };

  static updateMyPost = async (
    data: PostRequest,
    thumbnail: File | null,
    id: number
  ) => {
    const formData = new FormData();
    formData.append(
      "post",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );
    if (thumbnail) {
      formData.append("thumbnail", thumbnail);
    }

    const response = await http.put<PostResponse>(
      POST_PATH.ME_BY_ID(id),
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response.data;
  };
}
