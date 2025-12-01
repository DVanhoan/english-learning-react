// import { FcGoogle } from "react-icons/fc";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { z } from "zod";
import routes from "@/routes/routes.const";
import { useMutation } from "@tanstack/react-query";
import { AuthApi } from "@/api/auth.api";
import { toast } from "react-toastify";
import useAuth from "@/context/AuthContext";
import { signIn } from "@/context/AuthContext/auth.action";
import SignInGoogleButton from "@/components/SignInGoogleButton";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "@/types/common.type";
import clsx from "clsx";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  email: z
    .string()
    .regex(/^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$/, "Email không hợp lệ"),
  password: z.string().min(8, "Mật khẩu phải ít nhất 8 ký tự"),
});

const SignIn = () => {
  const { dispatch } = useAuth();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      email: "",
      password: "",
    },
    resolver: zodResolver(formSchema),
  });
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    signInMutation.mutate(data);
  };

  const signInMutation = useMutation({
    mutationKey: ["sign-in"],
    mutationFn: (data: { email: string; password: string }) =>
      AuthApi.signIn(data),
    onSuccess: (response) => {
      toast.success("Đăng nhập thành công");
      dispatch(signIn({ isAuthenticated: true, user: response.data.user }));
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response.data.message) toast.error(error.response.data.message);
      else toast("Đăng nhập thất bại, kiểm tra lại thông tin đăng nhập");
    },
  });

  return (
    <div className="main-layout min-h-[calc(100vh-80px)] flex items-center justify-center">
      <div className="w-full">
        <div className="max-w-xs m-auto w-full flex flex-col items-center">
          <p className="mt-4 text-xl font-bold tracking-tight text-[#295779] uppercase">
            Đăng nhập
          </p>
          <SignInGoogleButton />
          <div className="my-7 w-full flex items-center justify-center overflow-hidden">
            <Separator className="bg-primary-color" />
            <span className="text-sm px-2 text-primary-color">OR</span>
            <Separator className="bg-primary-color" />
          </div>
          <Form {...form}>
            <form
              className="w-full space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#295779]">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Email"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#295779]">Mật khẩu</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Mật khẩu"
                        className="w-full"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button
                type="submit"
                disabled={signInMutation.isPending}
                className={clsx(
                  "mt-4 w-full bg-primary-color hover:bg-hover-primary-color cursor-pointer",
                  "disabled:bg-hover-primary-color/95 disabled:cursor-not-allowed disabled:pointer-events-auto"
                )}
              >
                {signInMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang đăng nhập...
                  </>
                ) : (
                  <>Đăng nhập</>
                )}
              </Button>
            </form>
          </Form>
          <div className="mt-5 space-y-5">
            <Link
              to={routes.FORGOT_PASSWORD}
              className="text-sm block text-center text-primary-color"
            >
              Quên mật khẩu
            </Link>
            <p className="text-sm text-center text-primary-color">
              Chưa có tài khoản?
              <Link to={routes.SIGN_UP} className="ml-1 text-primary-color">
                Đăng ký
              </Link>
            </p>
          </div>
        </div>
        <div className="bg-muted hidden lg:block" />
      </div>
    </div>
  );
};
export default SignIn;
