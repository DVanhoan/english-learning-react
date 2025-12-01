import { useEffect } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, CheckCircle, XCircle, LogIn, Home } from "lucide-react";
import routes from "@/routes/routes.const";
import { AuthApi } from "@/api/auth.api";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const verifyEmailMutation = useMutation({
    mutationKey: ["verify-email"],
    mutationFn: (token: string) => AuthApi.verifyEmail(token),
  });

  useEffect(() => {
    if (token) {
      verifyEmailMutation.mutate(token);
    }
  }, [token]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-20 left-10 w-32 h-32 bg-blue-100 rounded-full opacity-20 animate-float"></div>
        <div
          className="absolute top-40 right-20 w-24 h-24 bg-indigo-100 rounded-full opacity-30 animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-32 left-1/4 w-20 h-20 bg-cyan-100 rounded-full opacity-25 animate-float"
          style={{ animationDelay: "2s" }}
        />
        <div
          className="absolute bottom-20 right-1/3 w-28 h-28 bg-sky-100 rounded-full opacity-20 animate-float"
          style={{ animationDelay: "0.5s" }}
        />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Card className="glass-effect border-0 shadow-2xl">
          <CardHeader className="text-center pb-6">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Xác thực email
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-6 text-center">
            {/* Pending */}
            {verifyEmailMutation.isPending && (
              <div className="flex flex-col items-center space-y-4">
                <div className="mx-auto mb-4 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
                  <Loader2 className="w-10 h-10 text-blue-600 animate-spin" />
                </div>
                <h3 className="font-semibold text-blue-700 text-lg">
                  Đang xác thực email...
                </h3>
                <p className="text-gray-600 text-sm">
                  Vui lòng chờ trong giây lát. Chúng tôi đang kiểm tra liên kết
                  của bạn.
                </p>
              </div>
            )}

            {/* Success */}
            {verifyEmailMutation.isSuccess && (
              <div className="flex flex-col items-center space-y-6">
                <div className="mx-auto mb-4 w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-success-pulse">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h3 className="font-bold text-green-700 text-xl">
                  Email đã được xác nhận!
                </h3>
                <p className="text-gray-600 text-sm max-w-sm">
                  Chúc mừng 🎉 Tài khoản của bạn đã được kích hoạt thành công.
                  Giờ bạn có thể đăng nhập và bắt đầu trải nghiệm.
                </p>

                <div className="space-y-3 w-full">
                  <Link
                    to={routes.SIGN_IN}
                    className="block w-full px-4 py-3 rounded-md bg-green-600 text-white font-medium hover:bg-green-700 transition-transform transform hover:scale-105"
                  >
                    <LogIn className="inline-block w-5 h-5 mr-2" />
                    Đăng nhập ngay
                  </Link>
                  <Link
                    to={routes.HOME}
                    className="block w-full px-4 py-3 rounded-md border border-gray-300 text-gray-600 bg-white hover:bg-gray-50 transition"
                  >
                    <Home className="inline-block w-5 h-5 mr-2" />
                    Về trang chủ
                  </Link>
                </div>
              </div>
            )}

            {/* Error */}
            {verifyEmailMutation.isError && (
              <div className="flex flex-col items-center space-y-6">
                <div className="mx-auto mb-4 w-20 h-20 bg-red-100 rounded-full flex items-center justify-center animate-pulse">
                  <XCircle className="w-12 h-12 text-red-600" />
                </div>
                <h3 className="font-bold text-red-700 text-xl">
                  Liên kết không hợp lệ!
                </h3>
                <p className="text-gray-600 text-sm max-w-sm">
                  Rất tiếc, liên kết xác thực không hợp lệ hoặc đã hết hạn. Vui
                  lòng đăng ký lại để tiếp tục.
                </p>

                <Link
                  to={routes.SIGN_UP}
                  className="block w-full px-4 py-3 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition-transform transform hover:scale-105"
                >
                  Đăng ký lại
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
