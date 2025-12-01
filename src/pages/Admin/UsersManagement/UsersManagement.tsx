import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Pagination from "@/components/Pagination";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  MoreHorizontal,
  Plus,
  Search,
  Edit,
  Trash2,
  FolderX,
} from "lucide-react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { UserApi } from "@/api/users.api";
import dayjs from "dayjs";
import { toast } from "react-toastify";
import {
  createUserFormSchema,
  deleteConfirmSchema,
  editUserFormSchema,
  type CreateUserFormData,
  type DeleteConfirmData,
  type EditUserFormData,
} from "./schemaValidation";
import type {
  AdminCreateUserRequest,
  AdminUpdateUserRequest,
  User,
} from "@/types/user.type";
import type { ErrorResponse } from "@/types/common.type";
import type { AxiosError } from "axios";
import { AppUtils } from "@/utils/appUtils";

export default function UsersManagement() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false);
  const [isEditOpen, setIsEditOpen] = useState<boolean>(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User>(null);
  const [userToDelete, setUserToDelete] = useState<User>(null);
  const [searchParams, setSearchParams] = useSearchParams();

  const pageNumber = Number(searchParams.get("pageNumber")) || 1;
  const keyword = searchParams.get("keyword") || "";
  const sorts = searchParams.get("sorts") || "";
  const pageSize = 10;

  const { data: usersData } = useQuery({
    queryKey: ["users", pageNumber, pageSize, keyword, sorts],
    queryFn: ({ queryKey }) => {
      const [_key, pageNumber, pageSize, keyword, sorts] = queryKey as [
        string,
        number,
        number,
        string,
        string
      ];
      return UserApi.getUsers(pageNumber, pageSize, keyword, sorts);
    },
    placeholderData: keepPreviousData,
  });

  const createUserMutation = useMutation({
    mutationFn: (data: AdminCreateUserRequest) => UserApi.createUser(data),
    onSuccess: () => {
      toast.success("Tạo người dùng thành công");
      setIsCreateOpen(false);
      createForm.reset();
      queryClient.invalidateQueries({
        queryKey: ["users", pageNumber, pageSize, keyword, sorts],
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (!error.response.data.errors) {
        toast.error(error.response.data.message);
      } else {
        error.response.data.errors.forEach((fieldError) => {
          createForm.setError(
            fieldError.fieldName as keyof AdminCreateUserRequest,
            {
              type: "manual",
              message: fieldError.message,
            }
          );
        });
      }
    },
  });

  const updateUserMutation = useMutation({
    mutationFn: ({ data, id }: { data: AdminUpdateUserRequest; id: number }) =>
      UserApi.updateUser(data, id),
    onSuccess: () => {
      toast.success("Cập nhật người dùng thành công");
      setIsEditOpen(false);
      editForm.reset();
      setSelectedUser(null);
      queryClient.invalidateQueries({
        queryKey: ["users", pageNumber, pageSize, keyword, sorts],
      });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (!error.response.data.errors) {
        toast.error(error.response.data.message);
      } else {
        error.response.data.errors.forEach((fieldError) => {
          createForm.setError(
            fieldError.fieldName as keyof AdminCreateUserRequest,
            {
              type: "manual",
              message: fieldError.message,
            }
          );
        });
      }
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (id: number) => UserApi.deleteUser(id),
    onSuccess: () => {
      toast.success("Xoá người dùng thành công");
      setIsDeleteOpen(false);
      deleteForm.reset();
      setUserToDelete(null);
      queryClient.invalidateQueries({
        queryKey: ["users", pageNumber, pageSize, keyword, sorts],
      });
    },
    onError: () => {
      toast.error("Xoá người dùng thất bại");
    },
  });

  const searchForm = useForm<{
    keyword: string;
    sortBy: string;
    order: string;
  }>({
    defaultValues: {
      keyword: "",
      sortBy: "",
      order: "",
    },
  });

  useEffect(() => {
    const newValues = {
      keyword: keyword,
      sortBy: "",
      order: "",
    };

    if (AppUtils.isValidSortParam(sorts)) {
      const sortParts = sorts.split(":");
      newValues.sortBy = sortParts[0] || "";
      newValues.order = sortParts[1] || "asc";
    }
    searchForm.reset(newValues);
  }, [keyword, sorts, searchForm]);

  const createForm = useForm<CreateUserFormData>({
    resolver: zodResolver(createUserFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      address: "",
      gender: "MALE",
      birthDate: "",
      role: "USER",
      status: "ACTIVE",
      password: "",
      confirmPassword: "",
    },
  });

  const editForm = useForm<EditUserFormData>({
    resolver: zodResolver(editUserFormSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phoneNumber: "",
      address: "",
      gender: "MALE",
      birthDate: "",
      role: "USER",
      status: "ACTIVE",
    },
  });

  const deleteForm = useForm<DeleteConfirmData>({
    resolver: zodResolver(deleteConfirmSchema),
    defaultValues: {
      confirmText: "",
    },
  });

  const handleSearch = (data: {
    keyword: string;
    sortBy: string;
    order: string;
  }) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("pageNumber");
      if (data.keyword.trim()) {
        newParams.set("keyword", data.keyword.trim());
      } else {
        newParams.delete("keyword");
      }
      if (data.sortBy) {
        if (data.order) newParams.set("sorts", `${data.sortBy}:${data.order}`);
        else newParams.set("sorts", `${data.sortBy}:asc`);
      } else {
        newParams.delete("sorts");
      }
      return newParams;
    });
  };

  const handleCreateUser = (data: CreateUserFormData) => {
    const user: AdminCreateUserRequest = {
      ...data,
      phoneNumber: data.phoneNumber ? data.phoneNumber : null,
      address: data.address ? data.address : null,
      birthDate: dayjs(data.birthDate).format("DD/MM/YYYY"),
    };
    createUserMutation.mutate(user);
  };

  const handleEditUser = (user: User) => {
    setSelectedUser(user);
    editForm.reset({
      fullName: user.fullName,
      email: user.email,
      phoneNumber: user.phoneNumber || "",
      address: user.address || "",
      gender: user.gender,
      birthDate: user.birthDate || "",
      role: user.role,
      status: user.status,
    });
    setIsEditOpen(true);
  };

  const handleUpdateUser = (data: EditUserFormData) => {
    const user: AdminUpdateUserRequest = {
      ...data,
      phoneNumber: data.phoneNumber ? data.phoneNumber : null,
      address: data.address ? data.address : null,
      birthDate: dayjs(data.birthDate).format("DD/MM/YYYY"),
    };
    updateUserMutation.mutate({ data: user, id: selectedUser?.id });
  };

  const handleDeleteUser = (user: User) => {
    setUserToDelete(user);
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = (_data: DeleteConfirmData) => {
    deleteUserMutation.mutate(userToDelete?.id);
  };

  const getStatusBadge = (status: string) => {
    const statusLowerCase = status.toLowerCase();
    if (statusLowerCase === "active")
      return <Badge className="bg-green-100 text-green-800">Kích hoạt</Badge>;
    else if (statusLowerCase === "pending")
      return (
        <Badge className="bg-orange-100 text-orange-800">Chưa xác nhận</Badge>
      );
    else return <Badge className="bg-red-100 text-red-500">Bị khoá</Badge>;
  };

  const getRoleBadge = (role: string) => {
    const roleLowerCase = role.toLowerCase();
    if (roleLowerCase === "admin")
      return <Badge className="bg-red-100 text-red-800">Quản trị viên</Badge>;
    else if (roleLowerCase === "teacher")
      return <Badge className="bg-blue-100 text-blue-800">Giáo viên</Badge>;
    else return <Badge className="bg-gray-100 text-gray-800">Người dùng</Badge>;
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Quản lý người dùng
          </h2>
          <p className="text-muted-foreground">
            Quản lý người dùng trên nền tảng
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#155e94] hover:bg-[#0b4674]">
              <Plus className="mr-2 h-4 w-4" />
              Thêm người dùng
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(handleCreateUser)}>
                <DialogHeader>
                  <DialogTitle>Tạo người dùng mới</DialogTitle>
                  <DialogDescription>
                    Thêm người dùng mới. Điền thông tin chi tiết bên dưới.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <FormField
                    control={createForm.control}
                    name="fullName"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <FormLabel className="text-right">Họ tên</FormLabel>
                          <div className="col-span-3">
                            <FormControl>
                              <Input placeholder="Nhập họ tên" {...field} />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <FormLabel className="text-right">Email</FormLabel>
                          <div className="col-span-3">
                            <FormControl>
                              <Input
                                type="email"
                                placeholder="Nhập email"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <FormLabel className="text-right">
                            Số điện thoại
                          </FormLabel>
                          <div className="col-span-3">
                            <FormControl>
                              <Input
                                type="tel"
                                placeholder="Nhập số điện thoại"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <FormLabel className="text-right">Địa chỉ</FormLabel>
                          <div className="col-span-3">
                            <FormControl>
                              <Input placeholder="Nhập địa chỉ" {...field} />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <FormLabel className="text-right">
                            Giới tính
                          </FormLabel>
                          <div className="col-span-3">
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
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <FormLabel className="text-right">
                            Ngày sinh
                          </FormLabel>
                          <div className="col-span-3">
                            <FormControl>
                              <Input type="date" {...field} />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="role"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <FormLabel className="text-right">Vai trò</FormLabel>
                          <div className="col-span-3">
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Chọn vai trò" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="USER">Học viên</SelectItem>
                                <SelectItem value="TEACHER">
                                  Giáo viên
                                </SelectItem>
                                <SelectItem value="ADMIN">
                                  Quản trị viên
                                </SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="status"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <FormLabel className="text-right">
                            Trạng thái
                          </FormLabel>
                          <div className="col-span-3">
                            <Select
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Chọn trạng thái" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                <SelectItem value="ACTIVE">
                                  Kích hoạt
                                </SelectItem>
                                <SelectItem value="PENDING">
                                  Chưa xác nhận
                                </SelectItem>
                                <SelectItem value="BANNED">Bị khoá</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <FormLabel className="text-right">Mật khẩu</FormLabel>
                          <div className="col-span-3">
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Nhập mật khẩu"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={createForm.control}
                    name="confirmPassword"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <FormLabel className="text-right">
                            Xác nhận mật khẩu
                          </FormLabel>
                          <div className="col-span-3">
                            <FormControl>
                              <Input
                                type="password"
                                placeholder="Nhập lại mật khẩu"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </div>
                        </div>
                      </FormItem>
                    )}
                  />
                </div>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Huỷ
                    </Button>
                  </DialogClose>
                  <Button
                    type="submit"
                    className="bg-[#155e94] hover:bg-[#0b4674]"
                  >
                    Tạo người dùng
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tất cả người dùng</CardTitle>
          <CardDescription>
            Danh sách tất cả người dùng trên nền tảng
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <Form {...searchForm}>
              <form
                onSubmit={searchForm.handleSubmit(handleSearch)}
                className="flex flex-col sm:flex-row gap-4"
              >
                <FormField
                  control={searchForm.control}
                  name="keyword"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <div className="relative">
                          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                          <Input
                            {...field}
                            placeholder="Tìm kiếm người dùng theo tên hoặc email"
                            className="pl-8"
                          />
                        </div>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Controller
                  control={searchForm.control}
                  name="sortBy"
                  render={({ field }) => (
                    <FormItem className="w-full sm:w-48">
                      <FormControl>
                        <Select
                          key={field.value || "empty"}
                          value={field.value || ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Sắp xếp theo" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="fullName">Họ tên</SelectItem>
                            <SelectItem value="email">Email</SelectItem>
                            <SelectItem value="role">Vai trò</SelectItem>
                            <SelectItem value="status">Trạng thái</SelectItem>
                            <SelectItem value="createdAt">Ngày tạo</SelectItem>
                            <SelectItem value="updatedAt">
                              Ngày cập nhật
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Controller
                  control={searchForm.control}
                  name="order"
                  render={({ field }) => (
                    <FormItem className="w-full sm:w-48">
                      <FormControl>
                        <Select
                          key={field.value || "empty"}
                          value={field.value || ""}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger className="w-full">
                            <SelectValue placeholder="Thứ tự sắp xếp" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="asc">Tăng dần</SelectItem>
                            <SelectItem value="desc">Giảm dần</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                    </FormItem>
                  )}
                />
                <Button
                  variant="outline"
                  type="submit"
                  className="w-full sm:w-auto bg-primary-color hover:bg-hover-primary-color text-white hover:text-white"
                >
                  <Search className="mr-1 h-4 w-4" />
                  Tìm kiếm
                </Button>
              </form>
            </Form>
          </div>

          <div className="rounded-md border">
            {usersData?.data.items.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Người dùng</TableHead>
                      <TableHead>Số điên thoại</TableHead>
                      <TableHead>Địa chỉ</TableHead>
                      <TableHead>Giới tính</TableHead>
                      <TableHead>Ngày sinh</TableHead>
                      <TableHead>Vai trò</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Ngày tham gia</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersData?.data.items.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatarUrl} />
                              <AvatarFallback>
                                {user.fullName.slice(0, 1)}
                              </AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{user.fullName}</div>
                              <div className="text-sm text-muted-foreground">
                                {user.email}
                              </div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.phoneNumber || "Không có"}</TableCell>
                        <TableCell>{user.address || "Không có"}</TableCell>
                        <TableCell>
                          {user.gender === "FEMALE"
                            ? "Nữ"
                            : user.gender === "MALE"
                            ? "Nam"
                            : "Khác"}
                        </TableCell>
                        <TableCell>
                          {user.birthDate
                            ? dayjs(user.birthDate).format("DD/MM/YYYY")
                            : "Không có"}
                        </TableCell>
                        <TableCell>{getRoleBadge(user.role)}</TableCell>
                        <TableCell>{getStatusBadge(user.status)}</TableCell>
                        <TableCell>
                          {dayjs(user.createdAt).format("DD/MM/YYYY HH:mm:ss")}
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" className="h-8 w-8 p-0">
                                <span className="sr-only">Open menu</span>
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                              <DropdownMenuItem
                                onClick={() => handleEditUser(user)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Chỉnh sửa
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => handleDeleteUser(user)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xóa người dùng
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </>
            ) : (
              <>
                <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                  <FolderX className="h-12 w-12 mb-3 text-gray-400" />
                  <p className="text-lg font-medium">
                    Không có dữ liệu phù hợp
                  </p>
                </div>
              </>
            )}
          </div>

          {usersData?.data?.items.length > 0 &&
            usersData?.data.totalPages > 0 && (
              <div className="mt-4">
                <Pagination
                  totalPages={usersData.data.totalPages}
                  pageParamName="pageNumber"
                  maxVisiblePages={7}
                  showFirstLast={true}
                  activeButtonClassName="bg-primary-color text-white hover:bg-hover-primary-color hover:text-white"
                />
              </div>
            )}
        </CardContent>
      </Card>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[500px] max-h-[80vh] overflow-y-auto">
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleUpdateUser)}>
              <DialogHeader>
                <DialogTitle>Chỉnh sửa người dùng</DialogTitle>
                <DialogDescription>
                  Thực hiện thay đổi tài khoản người dùng tại đây. Nhấn lưu khi
                  hoàn tất.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <FormField
                  control={editForm.control}
                  name="fullName"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Họ tên</FormLabel>
                        <div className="col-span-3">
                          <FormControl>
                            <Input placeholder="Nhập họ tên" {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Email</FormLabel>
                        <div className="col-span-3">
                          <FormControl>
                            <Input
                              type="email"
                              placeholder="Nhập email"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="phoneNumber"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">
                          Số điện thoại
                        </FormLabel>
                        <div className="col-span-3">
                          <FormControl>
                            <Input
                              type="tel"
                              placeholder="Nhập số điện thoại"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Địa chỉ</FormLabel>
                        <div className="col-span-3">
                          <FormControl>
                            <Input placeholder="Nhập địa chỉ" {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Giới tính</FormLabel>
                        <div className="col-span-3">
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
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
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="birthDate"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Ngày sinh</FormLabel>
                        <div className="col-span-3">
                          <FormControl>
                            <Input type="date" {...field} />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="role"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Vai trò</FormLabel>
                        <div className="col-span-3">
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn vai trò" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="USER">Học viên</SelectItem>
                              <SelectItem value="TEACHER">Giáo viên</SelectItem>
                              <SelectItem value="ADMIN">
                                Quản trị viên
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
                <FormField
                  control={editForm.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Trạng thái</FormLabel>
                        <div className="col-span-3">
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn trạng thái" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="ACTIVE">Kích hoạt</SelectItem>
                              <SelectItem value="PENDING">
                                Chưa xác nhận
                              </SelectItem>
                              <SelectItem value="BANNED">
                                Vô hiệu hoá
                              </SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="outline">
                    Huỷ
                  </Button>
                </DialogClose>
                <Button
                  type="submit"
                  className="bg-[#155e94] hover:bg-[#0b4674]"
                >
                  Lưu thay đổi
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...deleteForm}>
            <form onSubmit={deleteForm.handleSubmit(handleConfirmDelete)}>
              <DialogHeader>
                <DialogTitle>Xác nhận xóa người dùng</DialogTitle>
                <DialogDescription>
                  Hành động này không thể hoàn tác. Điều này sẽ xóa vĩnh viễn
                  tài khoản{" "}
                  <span className="font-semibold">
                    {userToDelete?.fullName}
                  </span>{" "}
                  và tất cả dữ liệu liên quan.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <FormField
                  control={deleteForm.control}
                  name="confirmText"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>
                        Để xác nhận, vui lòng nhập{" "}
                        <span className="font-bold">OK</span> trong ô bên dưới:
                      </FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập OK để xác nhận" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter className="gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsDeleteOpen(false);
                    deleteForm.reset();
                    setUserToDelete(null);
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  disabled={deleteForm.watch("confirmText") !== "OK"}
                >
                  Xóa người dùng
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
