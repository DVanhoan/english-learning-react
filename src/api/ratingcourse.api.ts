import http from "./http";
import { RATING_PATH } from "./path";
import type {
  PaginationResponse,
  SuccessResponse,
  SuccessResponseNoData,
} from "@/types/common.type";
import type { Rating, RatingRequest } from "@/types/rating.type";

export class RatingApi {

  static createOrUpdateRating = async (data: RatingRequest) => {
    const response = await http.post<SuccessResponse<Rating>>(
      RATING_PATH.BASE,
      data
    );
    return response.data;
  };


  static getRatingsByCourse = async (
    courseId: string | number,
    pageNumber: number,
    pageSize: number
  ) => {
    const response = await http.get<PaginationResponse<Rating[]>>(
      RATING_PATH.BY_COURSE_ID(courseId),
      {
        params: { pageNumber, pageSize },
      }
    );
    return response.data;
  };


  static deleteRating = async (ratingId: string | number) => {
    const response = await http.delete<SuccessResponseNoData>(
      RATING_PATH.BY_ID(ratingId)
    );
    return response.data;
  };
}