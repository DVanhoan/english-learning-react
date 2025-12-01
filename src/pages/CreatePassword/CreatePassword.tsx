import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff, Lock, Shield } from "lucide-react";
import * as z from "zod";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useMutation, useQuery } from "@tanstack/react-query";
import { toast } from "react-toastify";
import useAuth from "@/context/AuthContext";
import { signIn } from "@/context/AuthContext/auth.action";
import { useLocation, useNavigate } from "react-router-dom";
import routes from "@/routes/routes.const";
import { AuthApi } from "@/api/auth.api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const passwordSchema = z
  .object({
    password: z.string().min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng xác nhận mật khẩu"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof passwordSchema>;

export default function CreatePassword() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = location.state || {};
  const { dispatch } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  if (!user) {
    navigate(routes.SIGN_IN);
  }

  const form = useForm<FormData>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
  });

  useQuery({
    queryKey: ["check-no-password"],
    queryFn: () =>
      AuthApi.checkNoPassword(user.email)
        .then((response) => {
          if (response.data === false) navigate(routes.SIGN_IN);
        })
        .catch(() => navigate(routes.SIGN_IN)),
    enabled: Boolean(user),
  });

  const signInMutation = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: (data: { email: string; password: string }) =>
      AuthApi.signIn(data),
    onSuccess: (response) => {
      toast.success("Đăng nhập thành công");
      dispatch(signIn({ isAuthenticated: true, user: response.data.user }));
    },
    onError: () => {
      toast.error(
        "Đăng nhập thất bại, vui lòng kiểm tra lại email hoặc mật khẩu"
      );
    },
  });

  const createPasswordMutation = useMutation({
    mutationKey: ["create-password"],
    mutationFn: (password: string) =>
      AuthApi.createPassword(user.email, password),
    onError: () => {
      toast.error("Tạo mật khẩu thất bại");
      navigate(routes.SIGN_IN);
    },
    onSuccess: (_, variables) => {
      signInMutation.mutate({ email: user.email, password: variables });
      navigate(routes.HOME);
    },
  });

  const onSubmit = async (data: FormData) => {
    createPasswordMutation.mutate(data.password);
  };

  const getInitials = (name: string) =>
    name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md shadow-lg rounded-2xl border border-gray-200">
        <CardHeader className="text-center space-y-4">
          <Avatar className="w-20 h-20 mx-auto shadow-md ring-2 ring-blue-200">
            <AvatarImage src={user?.avatarUrl} alt={user?.fullName} />
            <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
              {user?.fullName ? getInitials(user.fullName) : <Shield />}
            </AvatarFallback>
          </Avatar>
          <p className="font-[500] text-primary-color">{user?.email}</p>
          <div>
            <CardTitle className="text-2xl font-bold text-gray-900">
              Tạo Mật Khẩu
            </CardTitle>
            <CardDescription className="text-gray-600 mt-2">
              Để bảo mật tài khoản, vui lòng tạo mật khẩu mạnh cho lần đăng nhập
              tiếp theo
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mật khẩu mới</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          placeholder="Nhập mật khẩu mới"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
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
                    <FormLabel>Xác nhận mật khẩu</FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Input
                          {...field}
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Nhập lại mật khẩu"
                          className="pr-10"
                        />
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                        >
                          {showConfirmPassword ? (
                            <EyeOff className="h-4 w-4 text-gray-500" />
                          ) : (
                            <Eye className="h-4 w-4 text-gray-500" />
                          )}
                        </Button>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="submit"
                className="w-full cursor-pointer"
                disabled={createPasswordMutation.isPending}
                size="lg"
              >
                {createPasswordMutation.isPending ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Đang tạo mật khẩu...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" />
                    Tạo Mật Khẩu
                  </div>
                )}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
