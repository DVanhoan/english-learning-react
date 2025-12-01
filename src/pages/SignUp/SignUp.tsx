import { AuthApi } from "@/api/auth.api";
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
import {
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import routes from "@/routes/routes.const";
import type { ErrorResponse } from "@/types/common.type";
import { zodResolver } from "@hookform/resolvers/zod";
import { Select } from "@radix-ui/react-select";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { z } from "zod";
import dayjs from "dayjs";
import clsx from "clsx";
import { Loader2 } from "lucide-react";
import type { SignUpUserRequest } from "@/types/user.type";

const formSchema = z
  .object({
    fullName: z.string().min(2, "Họ và tên ít nhất 2 ký tự"),
    email: z
      .string()
      .min(1, "Email không được để trống")
      .regex(
        /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{0,63}[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]{0,253}[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/,
        "Email không hợp lệ"
      ),
    password: z
      .string()
      .min(1, "Vui lòng nhập mật khẩu")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    confirmPassword: z.string().min(1, "Vui lòng nhập xác nhận mật khẩu"),
    phone: z
      .string()
      .regex(/^(?:\+84|0)[35789][0-9]{8}$/, "Số điện thoại không hợp lệ")
      .optional()
      .or(z.literal("")),
    address: z
      .string()
      .max(200, "Địa chỉ tối đa 200 ký tự")
      .optional()
      .or(z.literal("")),
    gender: z.enum(["MALE", "FEMALE", "OTHER"], {
      message: "Vui lòng chọn giới tính",
    }),
    birthDate: z
      .string()
      .min(1, "Vui lòng chọn ngày sinh")
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Ngày sinh không hợp lệ",
      })
      .refine(
        (val) => {
          const date = new Date(val);
          const now = new Date();
          return date < now;
        },
        {
          message: "Ngày sinh phải nhỏ hơn ngày hiện tại",
        }
      ),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Mật khẩu xác nhận không khớp",
  });

const SignUp = () => {
  const navigate = useNavigate();

  const form = useForm<z.infer<typeof formSchema>>({
    defaultValues: {
      fullName: "",
      email: "",
      password: "",
      confirmPassword: "",
      phone: "",
      gender: "MALE",
      birthDate: "",
    },
    resolver: zodResolver(formSchema),
  });

  const signUpMutation = useMutation({
    mutationKey: ["sign-up"],
    mutationFn: (data: SignUpUserRequest) => AuthApi.signUp(data),
    onSuccess: (_, variables) => {
      toast.success("Đăng ký thành công, vui lòng xác nhận email");
      navigate(routes.EMAIL_CONFIRMATION_NOTICE, {
        state: { email: variables.email },
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (!error.response.data.errors) {
        toast.error(error.response.data.message);
      }
      if (error.response.data.errors) {
        error.response.data.errors?.forEach((fieldError) => {
          form.setError(
            fieldError.fieldName as keyof z.infer<typeof formSchema>,
            {
              type: "manual",
              message: fieldError.message,
            }
          );
        });
      }
    },
  });
  const onSubmit = (data: z.infer<typeof formSchema>) => {
    signUpMutation.mutate({
      fullName: data.fullName,
      email: data.email,
      password: data.password,
      phoneNumber: data.phone ? data.phone : null,
      gender: data.gender,
      address: data.address ? data.address : null,
      birthDate: dayjs(data.birthDate).format("DD/MM/YYYY"),
    });
  };
  return (
    <div className="main-layout mt-6 mb-12 flex items-center justify-center">
      <div className="w-full">
        <div className="max-w-[400px] sm:max-w-[550px] md:max-w-[620px] m-auto w-full flex flex-col items-center">
          <p className="mt-4 text-xl font-bold tracking-tight text-[#295779] uppercase">
            Đăng ký
          </p>
          <div className="my-6 w-full flex items-center justify-center overflow-hidden">
            <Separator className="bg-primary-color" />
            <Separator className="bg-primary-color" />
          </div>
          <Form {...form}>
            <form
              className="w-full space-y-4"
              onSubmit={form.handleSubmit(onSubmit)}
            >
              <FormField
                control={form.control}
                name="fullName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#295779]">
                      Họ và tên <span className="text-red-500 -ml-1.5">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Họ và tên"
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
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#295779]">
                      Email <span className="text-red-500 -ml-1.5">*</span>
                    </FormLabel>
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
                    <FormLabel className="text-[#295779]">
                      Mật khẩu<span className="text-red-500 -ml-1.5">*</span>
                    </FormLabel>
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
              <FormField
                control={form.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#295779]">
                      Xác nhận mật khẩu
                      <span className="text-red-500 -ml-1.5">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Xác nhận mật khẩu"
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
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#295779]">
                      Số điện thoại
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Số điện thoại"
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
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#295779]">Địa chỉ</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Địa chỉ"
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
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#295779]">
                      Giới tính<span className="text-red-500 -ml-1.5">*</span>
                    </FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Chọn giới tính" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="MALE">Nam</SelectItem>
                        <SelectItem value="FEMALE">Nữ</SelectItem>
                        <SelectItem value="OTHER">Khác</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="birthDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[#295779]">
                      Ngày sinh<span className="text-red-500 -ml-1.5">*</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        type="date"
                        placeholder="Nhập ngày sinh"
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
                disabled={signUpMutation.isPending}
                className={clsx(
                  "mt-4 w-full",
                  "disabled:cursor-not-allowed disabled:bg-primary-color/85 disabled:pointer-events-auto",
                  "bg-primary-color hover:bg-hover-primary-color"
                )}
              >
                {signUpMutation.isPending ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Đang tạo tài khoản...
                  </>
                ) : (
                  <>Tạo tài khoản</>
                )}
              </Button>
            </form>
          </Form>
          <div className="mt-5">
            <p className="text-sm text-center text-primary-color">
              Đã có tài khoản?
              <Link to={routes.SIGN_IN} className="ml-1 text-primary-color">
                Đăng nhập
              </Link>
            </p>
          </div>
        </div>
        <div className="bg-muted hidden lg:block" />
      </div>
    </div>
  );
};
export default SignUp;
