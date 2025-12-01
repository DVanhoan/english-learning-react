import http from "./http";
import type { SuccessResponse, SuccessResponseNoData } from "@/types/common.type";

export interface PayoutSummary {
    teacherId: number;
    teacherName: string;
    teacherEmail: string;
    totalUnpaid: number;
    totalPaid: number;
}

export class PayoutApi {
    static getAll = async () => {
        const response = await http.get<SuccessResponse<PayoutSummary[]>>("/api/v1/payouts");
        return response.data;
    };

    static pay = async (teacherId: number) => {
        const response = await http.post<SuccessResponseNoData>(`/api/v1/payouts/${teacherId}/pay`);
        return response.data;
    };
}