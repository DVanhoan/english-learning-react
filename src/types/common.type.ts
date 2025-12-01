export interface SuccessResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface SuccessResponseNoData {
  status: number;
  message: string;
}

interface FieldError {
  fieldName: string;
  message: string;
}

export interface ErrorResponse {
  timestamp: string;
  status: number;
  path: string;
  error: string;
  message: string;
  errors?: FieldError[];
}

export interface Pagination<T> {
  pageNumber: number;
  pageSize: number;
  totalPages: number;
  numberOfElements: number;
  items: T[];
}

export type PaginationResponse<T> = SuccessResponse<Pagination<T>>;
