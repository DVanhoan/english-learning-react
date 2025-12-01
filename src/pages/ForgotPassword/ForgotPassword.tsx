import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { Mail, ArrowLeft, CircleCheck, Loader2 } from "lucide-react";
import { Link } from "react-router-dom";

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
import type { AxiosError } from "axios";
import type { ErrorResponse } from "@/types/common.type";

const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, "Email không được để trống")
    .regex(
      /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{0,63}[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]{0,253}[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/,
      "Email không hợp lệ"
    ),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const [isSuccess, setIsSuccess] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const forgotPasswordMutation = useMutation({
    mutationFn: (email: string) => AuthApi.forgotPassword(email),
    onSuccess: () => {
      setIsSuccess(true);
      setSubmittedEmail(form.getValues("email"));
      toast.success("Đã gửi email khôi phục mật khẩu!");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (
        error.response.data.status === 404 ||
        error.response.data.status === 40006
      )
        toast.error(error.response.data.message);
      else toast.error("Gửi email khôi phục mật khẩu thất bại");
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => {
    forgotPasswordMutation.mutate(data.email);
  };

  const handleBackToForm = () => {
    setIsSuccess(false);
    setSubmittedEmail("");
    form.reset();
  };

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
                Kiểm tra email của bạn
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center space-y-4">
                <p className="text-gray-600 leading-relaxed">
                  Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu đến email:
                </p>
                <div className="bg-gray-50 rounded-lg p-3 border">
                  <p className="font-semibold text-gray-900 break-all">
                    {submittedEmail}
                  </p>
                </div>
                <p className="text-sm text-gray-500">
                  Vui lòng kiểm tra hộp thư đến và làm theo hướng dẫn để đặt lại
                  mật khẩu.
                </p>
              </div>

              <div className="space-y-3">
                <Button
                  onClick={handleBackToForm}
                  variant="outline"
                  className="w-full"
                >
                  Gửi lại email
                </Button>
                <Link to={routes.SIGN_IN}>
                  <Button variant="ghost" className="w-full">
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Quay lại đăng nhập
                  </Button>
                </Link>
              </div>
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
              <Mail className="w-8 h-8 text-blue-600" />
            </div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Quên mật khẩu?
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Nhập email của bạn để nhận hướng dẫn khôi phục mật khẩu
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-gray-700 font-medium">
                        Địa chỉ email
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                          <Input
                            {...field}
                            type="email"
                            placeholder="example@email.com"
                            className="pl-10 h-12 bg-white/80 border-gray-200 focus:border-blue-500 focus:ring-blue-500/20"
                            disabled={forgotPasswordMutation.isPending}
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r bg-primary-color hover:bg-hover-primary-color text-white font-medium rounded-lg transition-all duration-200 btn-modern"
                  disabled={forgotPasswordMutation.isPending}
                >
                  {forgotPasswordMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Đang gửi...
                    </>
                  ) : (
                    "Gửi hướng dẫn khôi phục"
                  )}
                </Button>

                <div className="text-center">
                  <Link
                    to={routes.SIGN_IN}
                    className="inline-flex items-center text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200"
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
