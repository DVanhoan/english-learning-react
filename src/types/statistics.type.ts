import type { SuccessResponse } from "./common.type";

export interface RecentTransaction {
    userFullName: string;
    userEmail: string;
    userAvatar: string | null;
    amount: number;
    createdAt: string; // ISO date string
}

export interface DashboardStatistics {
    // 1. Stats Cards
    totalRevenue: number;
    totalUsers: number;
    totalEnrollments: number;
    newUsersToday: number;

    // 2. Recent Sales
    recentTransactions: RecentTransaction[];

    // 3. Course Stats
    totalCourses: number;
    publishedCourses: number;
    draftCourses: number;

    // 4. Content Stats
    totalPosts: number;
    totalFlashcardSets: number;
    totalDictationLessons: number;
}

export type DashboardStatisticsResponse = SuccessResponse<DashboardStatistics>;