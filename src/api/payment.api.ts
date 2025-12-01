import http from "./http";
import { PAYMENT_PATH } from "./path";
import type { PaymentResponse, CreatePaymentRequest } from "@/types/payment.type";

export class PaymentApi {
    static createPayment = async (data: CreatePaymentRequest) => {
        const response = await http.post<PaymentResponse>(
            PAYMENT_PATH.CREATE_PAYMENT,
            data
        );
        return response.data;
    };
}