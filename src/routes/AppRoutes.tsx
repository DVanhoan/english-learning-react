import { useRoutes } from "react-router-dom";
import ProtectedRoutes from "./ProtectedRoutes";
import PublicRoutes from "./PublicRoutes";
import RejectedRoutes from "./RejectedRoutes";
import AdminRoutes from "./AdminRoutes";

export default function AppRoutes() {
  const element = useRoutes([
    ...ProtectedRoutes,
    ...PublicRoutes,
    ...RejectedRoutes,
    ...AdminRoutes,
  ]);
  return <>{element}</>;
}
