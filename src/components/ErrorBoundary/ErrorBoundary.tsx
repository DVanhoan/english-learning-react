import React from "react";
import { AlertTriangle } from "lucide-react";

type Props = {
  children: React.ReactNode;
  fallback?: React.ReactNode;
};

type State = {
  hasError: boolean;
};

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(_: Error): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex items-center justify-center min-h-screen bg-red-50">
            <div className="flex flex-col items-center gap-4 p-6 bg-white border border-red-200 rounded-xl shadow-lg text-red-800 max-w-md text-center">
              <AlertTriangle className="w-10 h-10 text-red-500" />
              <h2 className="text-2xl font-semibold">Đã có lỗi xảy ra</h2>
              <p className="text-sm text-red-600">
                Có thể do lỗi hệ thống hoặc kết nối. Vui lòng thử lại sau.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-2 px-4 py-2 bg-primary-color text-white rounded hover:bg-hover-primary-color transition cursor-pointer"
              >
                Tải lại trang
              </button>
            </div>
          </div>
        )
      );
    }

    return this.props.children;
  }
}
