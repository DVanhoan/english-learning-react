import http from "./http";
import { ENROLLMENT_PATH } from "./path";
import type { PaginationResponse } from "@/types/common.type";
import type { Course } from "@/types/course.type";

export class EnrollmentApi {
    static getMyEnrollments = async (params: {
        pageNumber?: number;
        pageSize?: number;
        keyword?: string;
    }) => {
        const response = await http.get<PaginationResponse<Course>>(
            ENROLLMENT_PATH.GET_MY_ENROLLMENTS,
            { params }
        );
        return response.data;
    };
}