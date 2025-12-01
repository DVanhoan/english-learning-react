import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent } from "@/components/ui/tabs";

import {
  User,
  Lock,
  Camera,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Shield,
} from "lucide-react";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import useAuth from "@/context/AuthContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { UserApi } from "@/api/users.api";
import { toast } from "react-toastify";
import type { UserRequest } from "@/types/user.type";
import dayjs from "dayjs";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "@/types/common.type";

const sidebarItems = [
  { id: "account", label: "Tài khoản", icon: User },
  { id: "password", label: "Đổi mật khẩu", icon: Lock },
];

const accountSchema = z.object({
  fullName: z.string().min(1, "Vui lòng nhập họ và tên"),
  email: z
    .string()
    .min(1, "Email không được để trống")
    .regex(
      /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{0,63}[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]{0,253}[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/,
      "Email không hợp lệ"
    ),
  phoneNumber: z
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
});

const passwordSchema = z
  .object({
    currentPassword: z.string().min(8, "Mật khẩu ít nhất 8 ký tự"),
    newPassword: z.string().min(8, "Mật khẩu ít nhất 8 ký tự"),
    confirmPassword: z.string().min(8, "Mật khẩu ít nhất 8 ký tự"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export default function Account() {
  const [activeTab, setActiveTab] = useState("account");
  const [avatarPreviewUrl, setAvatarPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const queryClient = useQueryClient();
  const {
    state: { user },
  } = useAuth();

  const accountForm = useForm<z.infer<typeof accountSchema>>({
    resolver: zodResolver(accountSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      birthDate: "",
      address: "",
      gender: undefined,
    },
  });

  const passwordForm = useForm<z.infer<typeof passwordSchema>>({
    resolver: zodResolver(passwordSchema),
    defaultValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (user) {
      accountForm.reset({
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber || "",
        birthDate: user.birthDate || "",
        address: user.address || "",
        gender: user.gender || "OTHER",
      });
    }
  }, [user, accountForm]);

  useEffect(() => {
    return () => {
      if (avatarPreviewUrl) URL.revokeObjectURL(avatarPreviewUrl);
    };
  }, [avatarPreviewUrl]);

  const updateProfileMutation = useMutation({
    mutationFn: (data: UserRequest) => UserApi.updateProfile(data),
    onError: () => {
      toast.error("Cập nhật thông tin thất bại");
    },
    onSuccess: () => {
      toast.success("Cập nhật thông tin thành công");
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
    },
  });

  const updateAvatarMutation = useMutation({
    mutationFn: (avatar: File) => UserApi.updateAvatar(avatar),
    onError: () => {
      toast.error("Cập nhật ảnh đại diện thất bại");
      setAvatarPreviewUrl(null);
    },
    onSuccess: () => {
      toast.success("Cập nhật ảnh đại diện thành công");
      queryClient.invalidateQueries({ queryKey: ["users", "me"] });
      setTimeout(() => setAvatarPreviewUrl(null), 1500);
    },
  });

  const updatePasswordMutation = useMutation({
    mutationFn: (data: { currentPassword: string; newPassword: string }) =>
      UserApi.updatePassword(data.currentPassword, data.newPassword),
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response.data.status === 40005)
        toast.error(error.response.data.message);
      else toast.error("Cập nhật mật khẩu thất bại");
    },
    onSuccess: () => {
      toast.success("Cập nhật mật khẩu thành công");
    },
  });

  const onSubmitAccount = (data: z.infer<typeof accountSchema>) => {
    updateProfileMutation.mutate({
      ...data,
      birthDate: dayjs(data.birthDate).format("DD/MM/YYYY"),
      phoneNumber: data.phoneNumber ? data.phoneNumber : null,
      address: data.address ? data.address : null,
    });
  };

  const onSubmitPassword = (data: z.infer<typeof passwordSchema>) => {
    updatePasswordMutation.mutate({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="main-layout py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-primary-color mb-2">
            Quản lý
          </h1>
          <p className="text-gray-600">Quản lý tài khoản và bảo mật</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-0">
                <div className="space-y-1">
                  {sidebarItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-gray-50 transition-colors ${
                          activeTab === item.id
                            ? "bg-gray-100 border-r-2 border-primary-color text-primary-color"
                            : ""
                        }`}
                      >
                        <Icon className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          {item.label}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <CardTitle>
                  {sidebarItems.find((item) => item.id === activeTab)?.label}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab}>
                  <TabsContent value="account">
                    <div className="space-y-6">
                      <div className="flex items-center gap-6">
                        <div className="relative">
                          <Avatar className="h-24 w-24">
                            <AvatarImage
                              src={avatarPreviewUrl || user.avatarUrl}
                              alt="Avatar"
                              className="object-cover"
                            />
                            <AvatarFallback className="text-2xl">
                              {user.fullName.slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>
                          <Button
                            size="sm"
                            className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full p-0 bg-primary-color hover:bg-hover-primary-color"
                            disabled={updateAvatarMutation.isPending}
                            onClick={() => fileInputRef.current?.click()}
                          >
                            <Camera className="h-4 w-4" />
                          </Button>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const avatar = e.target.files?.[0];
                              if (!avatar) return;
                              const url = URL.createObjectURL(avatar);
                              if (avatarPreviewUrl)
                                URL.revokeObjectURL(avatarPreviewUrl);
                              setAvatarPreviewUrl(url);
                              updateAvatarMutation.mutate(avatar);
                              e.currentTarget.value = "";
                            }}
                          />
                        </div>
                        <div>
                          <h3 className="text-xl font-semibold">
                            {accountForm.getValues("fullName")}
                          </h3>
                          <p className="text-gray-600">
                            {accountForm.getValues("email")}
                          </p>
                          <Badge className="mt-2 bg-green-100 text-green-800">
                            <Shield className="h-3 w-3 mr-1" />
                            Đã xác thực
                          </Badge>
                        </div>
                      </div>

                      <Separator />

                      <Form {...accountForm}>
                        <form
                          onSubmit={accountForm.handleSubmit(onSubmitAccount)}
                          className="grid grid-cols-1 md:grid-cols-2 gap-6"
                        >
                          {/* Họ và tên */}
                          <FormField
                            control={accountForm.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <User className="h-4 w-4 text-primary-color" />
                                  Họ và tên
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Nhập tên của bạn"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Tên thật để dễ dàng liên hệ và hiển thị trên
                                  hồ sơ.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Email */}
                          <FormField
                            control={accountForm.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Mail className="h-4 w-4 text-primary-color" />
                                  Email
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    readOnly
                                    disabled
                                    placeholder="Nhập email"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Email đã xác nhận, không thể thay đổi.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Phone */}
                          <FormField
                            control={accountForm.control}
                            name="phoneNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-primary-color" />
                                  Số điện thoại
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Nhập số điện thoại"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Dùng để hỗ trợ khi có vấn đề về đăng nhập.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Ngày sinh */}
                          <FormField
                            control={accountForm.control}
                            name="birthDate"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Calendar className="h-4 w-4 text-primary-color" />
                                  Ngày sinh
                                </FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormDescription>
                                  Ngày sinh phải nhỏ hơn ngày hiện tại.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Địa chỉ */}
                          <FormField
                            control={accountForm.control}
                            name="address"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-primary-color" />
                                  Địa chỉ
                                </FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Nhập địa chỉ"
                                    {...field}
                                  />
                                </FormControl>
                                <FormDescription>
                                  Địa chỉ nơi ở hiện tại.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Giới tính */}
                          <Controller
                            control={accountForm.control}
                            name="gender"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel className="flex items-center gap-2">
                                  <Shield className="h-4 w-4 text-primary-color" />
                                  Giới tính
                                  <span className="text-red-500 ml-1">*</span>
                                </FormLabel>

                                <FormControl>
                                  <Select
                                    key={field.value}
                                    value={field.value || "OTHER"}
                                    onValueChange={field.onChange}
                                  >
                                    <SelectTrigger className="w-full">
                                      <SelectValue placeholder="Chọn giới tính" />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="MALE">Nam</SelectItem>
                                      <SelectItem value="FEMALE">Nữ</SelectItem>
                                      <SelectItem value="OTHER">
                                        Khác
                                      </SelectItem>
                                    </SelectContent>
                                  </Select>
                                </FormControl>

                                <FormDescription>
                                  Thông tin này giúp cá nhân hóa trải nghiệm của
                                  bạn.
                                </FormDescription>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          {/* Submit */}
                          <div className="md:col-span-2">
                            <Button
                              type="submit"
                              className="bg-primary-color hover:bg-hover-primary-color"
                            >
                              Cập nhật tài khoản
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </div>
                  </TabsContent>

                  <TabsContent value="password">
                    <Form {...passwordForm}>
                      <form
                        onSubmit={passwordForm.handleSubmit(onSubmitPassword)}
                        className="space-y-6"
                      >
                        <FormField
                          control={passwordForm.control}
                          name="currentPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mật khẩu hiện tại</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="••••••••"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={passwordForm.control}
                          name="newPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mật khẩu mới</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="••••••••"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={passwordForm.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Xác nhận mật khẩu mới</FormLabel>
                              <FormControl>
                                <Input
                                  type="password"
                                  placeholder="••••••••"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Button
                          type="submit"
                          className="bg-primary-color hover:bg-hover-primary-color"
                        >
                          Cập nhật mật khẩu
                        </Button>
                      </form>
                    </Form>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
