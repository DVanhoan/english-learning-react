import type { RouteObject } from "react-router-dom";
import routes from "./routes.const";
import MainLayout from "@/layouts/MainLayout";
import AuthGuard from "./AuthGuard";
import Account from "@/pages/Account";
import MyPosts from "@/pages/MyPosts";
import CreatePost from "@/pages/CreatePost";

const ProtectedRoutes: RouteObject[] = [
  {
    element: <AuthGuard />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: routes.ACCOUNT, element: <Account /> },
          { path: routes.MY_POSTS, element: <MyPosts /> },
          { path: routes.USER_CREATE_POST, element: <CreatePost /> },
          { path: routes.USER_EDIT_POST, element: <CreatePost /> },
        ],
      },
    ],
  },
];

export default ProtectedRoutes;
