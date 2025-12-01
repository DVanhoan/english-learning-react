import App from "./App.tsx";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { AxiosError } from "axios";
import { ErrorBoundary } from "./components/ErrorBoundary/ErrorBoundary.tsx";
import "./global.css";
import "./index.css";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      networkMode: "online",
      retry: (_failureCount, error) => {
        const axiosError = error as AxiosError | any;
        const status =
          axiosError?.response?.status ?? axiosError?.response?.data?.status;
        if (status === 401) return false;
        return false;
      },
    },
  },
});

createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <QueryClientProvider client={queryClient}>
      <ErrorBoundary>
        <App />
      </ErrorBoundary>
    </QueryClientProvider>
  </BrowserRouter>
);
