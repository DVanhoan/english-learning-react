import type { SuccessResponse } from "./common.type";

export interface CreatePaymentRequest {
    courseIds: number[];
}

export interface CreatePaymentResponse {
    paymentUrl: string;
}

export type PaymentResponse = SuccessResponse<CreatePaymentResponse>;