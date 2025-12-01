// src/types/dictation.type.ts
import type { SuccessResponse, SuccessResponseNoData } from "./common.type";

// ==========================================
// 1. DATA MODELS (Khớp với DTO Response từ Backend)
// ==========================================

export interface DictationSentence {
    id: number;
    text: string;
    startTime: number;
    endTime: number;
    orderIndex: number;
}

export interface DictationLesson {
    id: number;
    title: string;
    subtitle?: string;
    description?: string;
    vocabLevel?: string; // Ví dụ: "A1", "B2"
    mediaUrl: string;    // URL audio/video từ Cloudinary
    duration?: string;   // Ví dụ: "05:30"
    topicId: number;
    sentences: DictationSentence[]; // Danh sách câu để chấm điểm
    createdAt: string;
    updatedAt: string;
}

export interface DictationTopic {
    id: number;
    title: string;
    description?: string;
    category?: string;   // Ví dụ: "TOEIC", "IELTS"
    levelRange?: string; // Ví dụ: "A1-B1"
    difficulty?: string; // Ví dụ: "Easy", "Medium"
    thumbnailUrl?: string;
    hasVideo: boolean;
    lessonCount: number;
    createdAt: string;
    updatedAt: string;
}

// ==========================================
// 2. API RESPONSE TYPES (Dùng cho axios)
// ==========================================

export type DictationTopicResponse = SuccessResponse<DictationTopic>;
export type DictationTopicListResponse = SuccessResponse<DictationTopic[]>;

export type DictationLessonResponse = SuccessResponse<DictationLesson>;
export type DictationLessonListResponse = SuccessResponse<DictationLesson[]>;

// Xuất thêm type cho Delete (nếu cần)
export type { SuccessResponseNoData };

// ==========================================
// 3. REQUEST TYPES (Dữ liệu gửi lên Backend)
// ==========================================

// Dùng khi tạo/sửa câu (nằm trong LessonRequest)
export interface DictationSentenceRequest {
    text: string;
    startTime: number;
    endTime: number;
    orderIndex: number;
}

// Dùng khi tạo/sửa bài học
export interface DictationLessonRequest {
    title: string;
    subtitle?: string;
    description?: string;
    vocabLevel?: string;
    topicId: number;
    duration?: string;
    sentences: DictationSentenceRequest[];
}

// Dùng khi tạo/sửa chủ đề
export interface DictationTopicRequest {
    title: string;
    description?: string;
    category?: string;
    levelRange?: string;
    difficulty?: string;
    hasVideo: boolean;
}