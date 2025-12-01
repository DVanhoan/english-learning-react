import { useEffect, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import AdminSidebar from "@/components/AdminSidebar";
import useAuth from "@/context/AuthContext";
import routes from "@/routes/routes.const";
import LogoLoader from "@/components/LogoLoader";
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { toast } from "react-toastify";

const ADMIN_ONLY_ROUTES = [
  routes.USERS_MANAGEMENT,
  routes.CATEGORIES_COURSE_MANAGEMENT,
  routes.CATEGORIES_POST_MANAGEMENT,
  routes.COUPONS_MANAGEMENT,
  routes.ORDERS_MANAGEMENT,
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isReadyComponent, setIsReadyComponent] = useState<boolean>(false);
  const { state: { user, isAuthenticated }, } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate(routes.SIGN_IN, { replace: true });
      return;
    }

    if (user.role !== "ADMIN" && user.role !== "TEACHER") {
      navigate(routes.HOME, { replace: true });
      return;
    }

    const currentPath = location.pathname;

    const isAdminRoute = ADMIN_ONLY_ROUTES.some(route => currentPath.startsWith(route));

    if (isAdminRoute && user.role !== "ADMIN") {
      toast.error("Bạn không có quyền truy cập trang này");
      navigate("/admin/courses", { replace: true });
      return;
    }


    setIsReadyComponent(true);
  }, [user, isAuthenticated, navigate, location.pathname]);

  if (!isReadyComponent) return <LogoLoader />;

  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
