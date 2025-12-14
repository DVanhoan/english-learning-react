import ScrollToTopButton from "./components/ScrollToTopButton";
import ScrollToTop from "./components/ScrollToTop";
import AuthProvider from "./context/AuthContext/auth.context";
import AppRoutes from "./routes/AppRoutes";
import { ToastContainer } from "react-toastify";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  return (
    <>
      <AuthProvider>
        <GoogleOAuthProvider clientId={clientId}>
          <ScrollToTop />
          {/* <GlobalLoading /> */}
          <AppRoutes />
          <ToastContainer
            position="bottom-right"
            toastClassName="text-[14px] w-full max-w-[100vw] sm:max-w-sm"
            autoClose={3000}
            hideProgressBar={false}
            newestOnTop
            closeOnClick
            pauseOnFocusLoss
            draggable
            pauseOnHover
            theme="light"
          />

          <ScrollToTopButton />
        </GoogleOAuthProvider>
      </AuthProvider>
    </>
  );
}

export default App;
