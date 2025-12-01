import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import {
  Lock,
  Eye,
  EyeOff,
  CircleCheck,
  Loader2,
  ArrowLeft,
} from "lucide-react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { AuthApi } from "@/api/auth.api";
import routes from "@/routes/routes.const";

const resetPasswordSchema = z
  .object({
    password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    confirmPassword: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;

export default function ResetPassword() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const token = searchParams.get("token");

  const form = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  const resetPasswordMutation = useMutation({
    mutationFn: (password: string) => AuthApi.resetPassword(token, password),
    onSuccess: () => {
      setIsSuccess(true);
      toast.success("Đặt lại mật khẩu thành công!");
    },
    onError: () => {
      toast.error("Khôi phục mật khẩu thất bại");
    },
  });

  const onSubmit = (data: ResetPasswordFormData) => {
    resetPasswordMutation.mutate(data.password);
  };

  const handleGoToLogin = () => {
    navigate(routes.SIGN_IN);
  };

  if (!token || resetPasswordMutation.isError) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
        <div className="w-full max-w-md">
          <Card className="glass-effect modern-shadow-lg border-0">
            <CardContent className="text-center py-8">
              <div className="mx-auto mb-4 w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
                <Lock className="w-8 h-8 text-red-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 mb-2">
                Liên kết không hợp lệ
              </h2>
              <p className="text-gray-600 mb-6">
                Liên kết đặt lại mật khẩu không hợp lệ hoặc đã hết hạn.
              </p>
              <Link to={routes.FORGOT_PASSWORD}>
                <Button className="w-full">Yêu cầu liên kết mới</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
        <div className="w-full max-w-md">
          <Card className="glass-effect modern-shadow-lg border-0">
            <CardHeader className="text-center pb-4">
              <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CircleCheck className="w-8 h-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Đặt lại mật khẩu thành công!
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  Mật khẩu của bạn đã được đặt lại thành công. Bây giờ bạn có
                  thể đăng nhập với mật khẩu mới.
                </p>
              </div>

              <Button
                onClick={handleGoToLogin}
                className="w-full h-12 bg-gradient-to-r bg-primary-color hover:bg-hover-primary-color"
              >
                Đăng nhập ngay
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-4">
      <div className="w-full max-w-md">
        <Card className="glass-effect modern-shadow-lg border-0">
          <CardHeader className="text-center pb-4">
            <div className="mx-auto mb-4 w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center">
              <Lock className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Đặt lại mật khẩu
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Nhập mật khẩu mới cho tài khoản của bạn
            </p>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Mật khẩu mới
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="Nhập mật khẩu mới"
                            className="pl-10 pr-10 h-12 bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                            disabled={resetPasswordMutation.isPending}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Xác nhận mật khẩu
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            {...field}
                            type={showConfirmPassword ? "text" : "password"}
                            placeholder="Nhập lại mật khẩu mới"
                            className="pl-10 pr-10 h-12 bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                            disabled={resetPasswordMutation.isPending}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r bg-primary-color hover:bg-hover-primary-color text-white font-medium rounded-lg transition-all duration-200 btn-modern"
                  disabled={resetPasswordMutation.isPending}
                >
                  {resetPasswordMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang đặt lại...
                    </>
                  ) : (
                    "Đặt lại mật khẩu"
                  )}
                </Button>

                <div className="text-center">
                  <Link
                    to={routes.SIGN_IN}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-blue-800 transition-colors duration-200"
                  >
                    <ArrowLeft className="w-4 h-4 mr-1" />
                    Quay lại đăng nhập
                  </Link>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
