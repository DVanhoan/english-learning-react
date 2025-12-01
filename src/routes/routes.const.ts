const commonRoutes = {
  HOME: "/",
  NOT_FOUND: "/not-found",
  CART: "/cart",
  MY_COURSES: "/my-courses",
  CHECKOUT: "/checkout",
  PAYMENT_RESULT: "/payment-result",
  AI_TUTOR: "/ai-tutor",

};

const authRoutes = {
  SIGN_IN: "/sign-in",
  SIGN_UP: "/sign-up",
  CREATE_PASSWORD: "/create-password",
  EMAIL_CONFIRMATION_NOTICE: "/email-confirmation-notice",
  EMAIL_CONFIRMED: "/email-confirmed",
  VERIFY_EMAIL: "/verify-email",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
};

const userRoutes = {
  PROFILE: "/profile",
  ACCOUNT: "/account",
  MY_POSTS: "/my-posts",
  USER_CREATE_POST: "/my-posts/create",
  USER_EDIT_POST: "/my-posts/edit/:id",
  MY_FLASHCARDS: "/my-flashcards",
  ORDERS: "/orders",
};

const courseRoutes = {
  COURSES: "/courses",
  COURSE_DETAIL: "/courses/:slug",
  VIDEO_LESSON: "/courses/:courseId/video-lessons/:lessonId",
};

const postRoutes = {
  POSTS: "/posts",
  POST_DETAIL: "/posts/:slug",
};

const flashcardRoutes = {
  FLASHCARDS: "/flashcards",
  FLASHCARD_DETAIL: "/flashcards/:id",
  CREATE_FLASHCARD: "/flashcards/create",
  EDIT_FLASHCARD: "/flashcards/:id/edit",
};

const dictationRoutes = {
  DICTATION_TOPICS: "/dictation/topics",
  DICTATION_LESSONS: "/dictation/topics/:id/lessons",
  DICTATION_LESSON_DETAIL: "/dictation/lesson/:id",
};

const speakingRoutes = {
  SPEAKING_LOBBY: "/speaking",
  SPEAKING_ROOM: "/speaking/room/:roomId",
};

const adminRoutes = {
  DASHBOARD: "/admin",

  USERS_MANAGEMENT: "/admin/users",

  POSTS_MANAGEMENT: "/admin/posts",
  CREATE_POST: "/admin/posts/create",
  UPDATE_POST: "/admin/posts/edit/:id",
  CATEGORIES_POST_MANAGEMENT: "admin/categories-post",

  COURSES_MANAGEMENT: "/admin/courses",
  CREATE_COURSE: "/admin/courses/create",
  UPDATE_COURSE: "/admin/courses/edit/:id",
  CHAPTERS_BY_COURSE: "/admin/courses/:courseId/chapters",
  CATEGORIES_COURSE_MANAGEMENT: "/admin/categories-course",

  LESSONS_BY_CHAPTER: "/admin/chapters/:chapterId/lessons",

  FLASHCARDS_MANAGEMENT: "/admin/flashcards",
  DICTATION_TOPICS_MANAGEMENT: "/admin/dictation/topics",
  DICTATION_LESSONS_MANAGEMENT: "/admin/dictation/topics/:topicId/lessons",

  COUPONS_MANAGEMENT: "/admin/coupons",
  COMMENTS_MANAGEMENT: "/admin/comments",
  ORDERS_MANAGEMENT: "/admin/orders",

  ADMIN_SPEAKING_TOPICS: "/admin/speaking/topics",

  ADMIN_PAYOUTS: "/admin/payouts",
};

const routes = {
  ...commonRoutes,
  ...authRoutes,
  ...userRoutes,
  ...courseRoutes,
  ...postRoutes,
  ...flashcardRoutes,
  ...dictationRoutes,
  ...speakingRoutes,
  ...adminRoutes,
};

export default routes;
