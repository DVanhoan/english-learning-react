import { useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, ArrowLeft } from "lucide-react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import routes from "@/routes/routes.const";

export default function EmailConfirmationNotice() {
  const navigate = useNavigate();
  const location = useLocation();
  const { email } = location.state || {};

  useEffect(() => {
    if (!email) {
      navigate(routes.SIGN_IN, { replace: true });
    }
  }, [email, navigate]);

  if (!email) return null; // tránh render nháy màn hình trước khi redirect

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex items-center justify-center p-4">
      <div className="relative z-10 w-full max-w-md">
        <Card className="glass-effect border-0 shadow-2xl">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center animate-pulse">
              <Mail className="w-12 h-12 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-800 mb-2">
              Kiểm tra email của bạn
            </CardTitle>
            <p className="text-gray-600 text-sm">
              Chúng tôi đã gửi liên kết xác nhận đến email của bạn
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200 text-center">
              <p className="text-sm text-gray-600 mb-2">
                Email xác nhận đã được gửi đến:
              </p>
              <p className="font-medium text-primary-color bg-white px-3 py-2 rounded border text-sm break-all">
                {email}
              </p>
            </div>

            <div className="bg-gray-50 rounded-lg p-4 border">
              <h3 className="font-semibold text-gray-800 mb-3">
                Bạn không nhận được email?
              </h3>
              <ul className="list-disc list-inside text-sm text-gray-700 space-y-2">
                <li>Thư nằm trong mục thư rác.</li>
                <li>Địa chỉ email bạn nhập bị sai chính tả.</li>
                <li>
                  Bạn đã vô tình cung cấp cho chúng tôi một địa chỉ email khác.
                </li>
              </ul>
              <div className="mt-4 text-sm text-blue-600 font-medium text-center">
                <Link to={routes.SIGN_UP} className="hover:underline">
                  Quay lại trang đăng ký
                </Link>
              </div>
            </div>

            <div className="pt-2">
              <Link
                to={routes.SIGN_IN}
                className="flex items-center justify-center w-full border border-gray-300 text-gray-600 rounded-lg py-2 hover:bg-gray-50 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Quay lại đăng nhập
              </Link>
            </div>

            <div className="text-center pt-4 border-t">
              <p className="text-xs text-gray-500">
                Cần hỗ trợ?{" "}
                <a
                  href="mailto:support@k-english.com"
                  className="text-primary-color hover:underline font-medium"
                >
                  Liên hệ với chúng tôi
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
