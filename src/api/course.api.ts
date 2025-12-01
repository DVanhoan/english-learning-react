import http from "./http";
import { COURSE_PATH } from "./path";
import type {
  PaginationResponse,
  SuccessResponse,
  SuccessResponseNoData,
} from "@/types/common.type";
import type {
  Course,
  CourseRequest,
  CourseResponse,
} from "@/types/course.type";

export class CourseApi {
  static create = async (data: CourseRequest, thumbnail: File) => {
    const formData = new FormData();
    formData.append(
      "course",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );
    formData.append("thumbnail", thumbnail);

    const res = await http.post<CourseResponse>(COURSE_PATH.BASE, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return res.data;
  };

  static update = async (
    id: number,
    data: CourseRequest,
    thumbnail?: File | null
  ) => {
    const formData = new FormData();
    formData.append(
      "course",
      new Blob([JSON.stringify(data)], { type: "application/json" })
    );
    if (thumbnail) formData.append("thumbnail", thumbnail);

    const res = await http.put<CourseResponse>(
      COURSE_PATH.BY_ID(id),
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    return res.data;
  };

  static getById = async (id: number) => {
    const res = await http.get<CourseResponse>(COURSE_PATH.BY_ID(id));
    return res.data;
  };

  static getAll = async (
    pageNumber: number,
    pageSize: number,
    keyword: string,
    sorts?: string | string[] | null,
    categoryId?: number | null,
    status?: "PUBLIC" | "HIDDEN" | null
  ) => {
    const params = new URLSearchParams();
    params.append("pageNumber", String(pageNumber));
    params.append("pageSize", String(pageSize));
    params.append("keyword", keyword ?? "");

    if (sorts) {
      const list = Array.isArray(sorts)
        ? sorts
        : sorts.includes(",")
          ? sorts.split(",")
          : [sorts];
      list.filter(Boolean).forEach((s) => params.append("sorts", s));
    }
    if (categoryId != null) params.append("categoryId", String(categoryId));
    if (status) params.append("status", status);

    const url = `${COURSE_PATH.BASE}?${params.toString()}`;
    const res = await http.get<PaginationResponse<Course>>(url);
    return res.data;
  };

  static getCoursesByIds = async (ids: number[]) => {
    const response = await http.post<SuccessResponse<Course[]>>(
      COURSE_PATH.BY_IDS,
      { ids }
    );
    return response.data;
  };

  static getPublic = async (
    pageNumber: number,
    pageSize: number,
    keyword: string,
    sorts?: string | string[] | null,
    categoryId?: number | null,
    teacherId?: number | null
  ) => {
    const params = new URLSearchParams();
    params.append("pageNumber", String(pageNumber));
    params.append("pageSize", String(pageSize));
    params.append("keyword", keyword ?? "");

    if (sorts) {
      const list = Array.isArray(sorts)
        ? sorts
        : sorts.includes(",")
          ? sorts.split(",")
          : [sorts];
      list.filter(Boolean).forEach((s) => params.append("sorts", s));
    }
    if (categoryId != null) params.append("categoryId", String(categoryId));
    if (teacherId != null) params.append("teacherId", String(teacherId));

    const url = `${COURSE_PATH.GET_PUBLIC}?${params.toString()}`;
    const res = await http.get<PaginationResponse<Course>>(url);
    return res.data;
  };

  static getNewest = async (n = 4) => {
    const url = `${COURSE_PATH.GET_NEWEST}?n=${encodeURIComponent(n)}`;
    const res = await http.get<{
      status: number;
      message: string;
      data: Course[];
    }>(url);
    return res.data.data;
  };



  static getDetails = async (id: string | number) => {
    const url = COURSE_PATH.GET_DETAILS(id);

    const res = await http.get<{
      status: number;
      message: string;
      data: Course;
    }>(url);
    return res.data.data;
  };

  static delete = async (id: number) => {
    const res = await http.delete<SuccessResponseNoData>(COURSE_PATH.BY_ID(id));
    return res.data;
  };
}
