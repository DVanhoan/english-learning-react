import type { RouteObject } from "react-router-dom";
import AdminLayout from "@/layouts/AdminLayout";
import Dashboard from "@/pages/Admin/Dashboard";
import routes from "./routes.const";
import UsersManagement from "@/pages/Admin/UsersManagement";
import CoursesManagement, {
  CreateCourse,
} from "@/pages/Admin/CoursesManagement";
import PostsManagement, {
  AdminCreatePost,
} from "@/pages/Admin/PostsManagement";
import FlashcardsManagement from "@/pages/Admin/FlashcardsManagement";
import DictationLessonsManagement from "@/pages/Admin/DictationLessonsManagement";
import DictationTopicsManagement from "@/pages/Admin/DictationTopicsManagement";
import OrdersManagement from "@/pages/Admin/OrdersManagement";
import CouponsManagement from "@/pages/Admin/CouponsManagement";
import CommentsManagement from "@/pages/Admin/CommentsManagement";
import ChaptersManagement from "@/pages/Admin/ChaptersManagement";
import LessonsManagement from "@/pages/Admin/LessonsManagement";
import CategoriesCourseManagement from "@/pages/Admin/CategoriesCourseManagement";
import CategoriesPostManagement from "@/pages/Admin/CategoriesPostManagement";
import SpeakingTopicsManagement from "@/pages/Admin/SpeakingTopicsManagement";
import PayoutsManagement from "@/pages/Admin/PayoutsManagement";

const AdminRoutes: RouteObject[] = [
  {
    element: <AdminLayout />,
    children: [
      { path: routes.DASHBOARD, element: <Dashboard /> },
      { path: routes.USERS_MANAGEMENT, element: <UsersManagement /> },
      { path: routes.COURSES_MANAGEMENT, element: <CoursesManagement /> },
      { path: routes.CREATE_COURSE, element: <CreateCourse /> },
      { path: routes.UPDATE_COURSE, element: <CreateCourse /> },
      { path: routes.CHAPTERS_BY_COURSE, element: <ChaptersManagement /> },
      { path: routes.LESSONS_BY_CHAPTER, element: <LessonsManagement /> },
      { path: routes.POSTS_MANAGEMENT, element: <PostsManagement /> },
      { path: routes.CREATE_POST, element: <AdminCreatePost /> },
      { path: routes.UPDATE_POST, element: <AdminCreatePost /> },
      {
        path: routes.CATEGORIES_COURSE_MANAGEMENT,
        element: <CategoriesCourseManagement />,
      },
      {
        path: routes.CATEGORIES_POST_MANAGEMENT,
        element: <CategoriesPostManagement />,
      },
      { path: routes.FLASHCARDS_MANAGEMENT, element: <FlashcardsManagement /> },
      {
        path: routes.DICTATION_LESSONS_MANAGEMENT,
        element: <DictationLessonsManagement />,
      },
      {
        path: routes.DICTATION_TOPICS_MANAGEMENT,
        element: <DictationTopicsManagement />,
      },
      { path: routes.ORDERS_MANAGEMENT, element: <OrdersManagement /> },
      { path: routes.COUPONS_MANAGEMENT, element: <CouponsManagement /> },
      { path: routes.COMMENTS_MANAGEMENT, element: <CommentsManagement /> },

      {
        path: routes.ADMIN_SPEAKING_TOPICS,
        element: <SpeakingTopicsManagement />
      },
      { path: routes.ADMIN_PAYOUTS, element: <PayoutsManagement /> },
    ],
  },
];

export default AdminRoutes;
