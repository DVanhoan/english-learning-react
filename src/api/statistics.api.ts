import http from "./http";
import { STATISTICS_PATH } from "./path";
import type { DashboardStatisticsResponse } from "@/types/statistics.type";

export class StatisticsApi {
    static getDashboardStats = async () => {
        const response = await http.get<DashboardStatisticsResponse>(
            STATISTICS_PATH.DASHBOARD
        );
        return response.data;
    };
}