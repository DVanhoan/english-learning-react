import { Navigate, Outlet } from "react-router-dom";
import routes from "./routes.const";
import useAuth from "@/context/AuthContext";

export default function AuthGuard() {
  const { isAuthenticated } = useAuth().state;
  return isAuthenticated ? <Outlet /> : <Navigate to={routes.SIGN_IN} />;
}
