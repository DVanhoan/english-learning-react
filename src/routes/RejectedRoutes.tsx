import type { RouteObject } from "react-router-dom";
import routes from "./routes.const";
import MainLayout from "@/layouts/MainLayout";
import Register from "@/pages/SignUp";
import NoAuthGuard from "./NoAuthGuard";
import SignIn from "@/pages/SignIn";
import EmailConfirmationNotice from "@/pages/EmailConfirmationNotice";
import VerifyEmail from "@/pages/VerifyEmail";
import ResetPassword from "@/pages/ResetPassword";
import ForgotPassword from "@/pages/ForgotPassword";

const RejectedRoutes: RouteObject[] = [
  {
    element: <NoAuthGuard />,
    children: [
      {
        element: <MainLayout />,
        children: [
          { path: routes.SIGN_IN, element: <SignIn /> },
          { path: routes.SIGN_UP, element: <Register /> },
          {
            path: routes.EMAIL_CONFIRMATION_NOTICE,
            element: <EmailConfirmationNotice />,
          },
          {
            path: routes.VERIFY_EMAIL,
            element: <VerifyEmail />,
          },
          {
            path: routes.FORGOT_PASSWORD,
            element: <ForgotPassword />,
          },
          {
            path: routes.RESET_PASSWORD,
            element: <ResetPassword />,
          },
        ],
      },
    ],
  },
];

export default RejectedRoutes;
