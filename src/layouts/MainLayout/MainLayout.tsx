import Footer from "@/components/Footer";
import Header from "@/components/Header";
import { Outlet } from "react-router-dom";

interface MainLayoutProps {
  showHeader?: boolean;
  showFooter?: boolean;
}

function MainLayout({ showHeader = true, showFooter = true }: MainLayoutProps) {
  return (
    <>
      {showHeader && <Header />}
      <Outlet />
      {showFooter && <Footer />}
    </>
  );
}

export default MainLayout;
