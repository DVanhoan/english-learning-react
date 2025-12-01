const API_V1 = "/api/v1";

export const AUTH_PATH = {
  SIGN_IN: `${API_V1}/auth/sign-in`,
  REFRESH_TOKEN: `${API_V1}/auth/refresh-token`,
  SIGN_OUT: `${API_V1}/auth/sign-out`,
  SIGN_UP: `${API_V1}/auth/sign-up`,
  AUTHENTICATE_GOOGLE: `${API_V1}/auth/authenticate/google`,
  CHECK_NO_PASSWORD: `${API_V1}/auth/check-no-password`,
  CREATE_PASSWORD: `${API_V1}/auth/create-password`,
  VERIFY_EMAIL: `${API_V1}/auth/verify-email`,
  FORGOT_PASSWORD: `${API_V1}/auth/forgot-password`,
  RESET_PASSWORD: `${API_V1}/auth/reset-password`,
};

export const USERS_PATH = {
  BASE: `${API_V1}/users`,
  ME: `${API_V1}/users/me`,
  AVATAR: `${API_V1}/users/me/avatar`,
  PASSWORD: `${API_V1}/users/me/password`,
  TEACHERS: `${API_V1}/users/teachers`,
  BY_ID: (id: number | string) => `${API_V1}/users/${id}`,
};

export const CATEGORIES_COURSE_PATH = {
  BASE: `${API_V1}/categories-course`,
  BY_ID: (id: number | string) => `${API_V1}/categories-course/${id}`,
};

export const CATEGORIES_POST_PATH = {
  BASE: `${API_V1}/categories-post`,
  BY_ID: (id: number | string) => `${API_V1}/categories-post/${id}`,
};

export const POST_PATH = {
  BASE: `${API_V1}/posts`,
  BY_ID: (id: number | string) => `${API_V1}/posts/${id}`,
  GET_PUBLIC: `${API_V1}/posts/public`,
  GET_RELATED_BY_ID: (id: number | string) =>
    `${API_V1}/posts/public/${id}/related`,
  ME: `${API_V1}/posts/me`,
  ME_BY_ID: (id: number | string) => `${API_V1}/posts/me/${id}`,
};

export const COURSE_PATH = {
  BASE: `${API_V1}/courses`,
  BY_ID: (id: number | string) => `${API_V1}/courses/${id}`,
  GET_PUBLIC: `${API_V1}/courses/public`,
  GET_NEWEST: `${API_V1}/courses/newest`,
  GET_DETAILS: (id: number | string) => `${API_V1}/courses/public/details/${id}`,
  BY_IDS: `${API_V1}/courses/by-ids`,
};

export const CHAPTER_PATH = {
  BASE: `${API_V1}/chapters`,
  BY_ID: (id: number | string) => `${API_V1}/chapters/${id}`,
  BY_COURSE_ID: (courseId: number | string) =>
    `${API_V1}/chapters/by-course/${courseId}`,
};

export const LESSON_PATH = {
  BASE: `${API_V1}/lessons`,
  BY_ID: (id: number | string) => `${API_V1}/lessons/${id}`,
  BY_CHAPTER_ID: (chapterId: number | string) =>
    `${API_V1}/lessons/by-chapter/${chapterId}`,
  ORDER: (chapterId: number | string) => `${API_V1}/lessons/order/${chapterId}`,
};

export const RATING_PATH = {
  BASE: `${API_V1}/ratings`,
  BY_ID: (id: number | string) => `${API_V1}/ratings/${id}`,
  BY_COURSE_ID: (courseId: number | string) =>
    `${API_V1}/ratings/course/${courseId}`,
};

export const COMMENT_PATH = {
  BASE: `${API_V1}/comments`,
  BY_LESSON_ID: (lessonId: number | string) =>
    `${API_V1}/comments/lesson/${lessonId}`,
};


export const CART_PATH = {
  BASE: `${API_V1}/cart`,
  ADD: `${API_V1}/cart/add`,
  ME: `${API_V1}/cart/me`,
  COUNT: `${API_V1}/cart/count`,
  REMOVE: (courseId: number | string) => `${API_V1}/cart/remove/${courseId}`,
};

export const PAYMENT_PATH = {
  CREATE_PAYMENT: `${API_V1}/payment/create-payment`,
};

export const FLASHCARD_PATH = {
  BASE: `${API_V1}/flashcards`,
  BY_ID: (id: number | string) => `${API_V1}/flashcards/${id}`,
  MANAGEMENT: `${API_V1}/flashcards/management`,
};

export const DICTATION_PATH = {
  TOPICS: `${API_V1}/dictation/topics`,
  TOPIC_BY_ID: (id: number | string) => `${API_V1}/dictation/topics/${id}`,

  LESSONS: `${API_V1}/dictation/lessons`,
  LESSONS_BY_TOPIC: (topicId: number | string) =>
    `${API_V1}/dictation/topics/${topicId}/lessons`,
  LESSON_BY_ID: (id: number | string) => `${API_V1}/dictation/lessons/${id}`,
};

export const ENROLLMENT_PATH = {
  GET_MY_ENROLLMENTS: `${API_V1}/enrollments/me`,
};

export const STATISTICS_PATH = {
  DASHBOARD: `${API_V1}/statistics/dashboard`,
};

export const SPEAKING_PATH = {
  TOPICS: `${API_V1}/speaking/topics`,
  ROOMS: `${API_V1}/speaking/rooms`,
};

export const AI_PATH = {
  CHAT: `${API_V1}/ai/chat`,
};