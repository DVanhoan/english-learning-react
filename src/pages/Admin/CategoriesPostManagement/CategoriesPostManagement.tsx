import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Plus,
  Search,
  Edit,
  Trash2,
  FolderOpen,
  FolderX,
  Loader2,
} from "lucide-react";
import Pagination from "@/components/Pagination/Pagination";
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { CategoriesPostApi } from "@/api/categoriesPost.api";
import { useSearchParams } from "react-router-dom";
import { AppUtils } from "@/utils/appUtils";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import type { Category, CategoryRequest } from "@/types/category.type";
import { categorySchema, type CategoryFormData } from "./schemaValidation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function CategoriesPostManagement() {
  const queryClient = useQueryClient();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(
    null
  );
  const [categoryToDelete, setCategoryToDelete] = useState<Category | null>(
    null
  );
  const [searchParams, setSearchParams] = useSearchParams();

  const itemsPerPage = 10;
  const pageNumber = Number(searchParams.get("pageNumber")) || 1;
  const keyword = searchParams.get("keyword") || "";
  const sorts = searchParams.get("sorts") || "";
  const pageSize = itemsPerPage;

  const searchForm = useForm<{
    keyword: string;
    sortBy: string;
    order: string;
  }>({ defaultValues: { keyword: "", sortBy: "", order: "" } });

  useEffect(() => {
    const newValues = { keyword: keyword, sortBy: "", order: "" };
    if (AppUtils.isValidSortParam(sorts)) {
      const sortParts = sorts.split(":");
      newValues.sortBy = sortParts[0] || "";
      newValues.order = sortParts[1] || "asc";
    }
    searchForm.reset(newValues);
  }, [keyword, sorts, searchForm]);

  const { data: categoriesData } = useQuery({
    queryKey: ["categories-post", pageNumber, pageSize, keyword, sorts],
    queryFn: ({ queryKey }) => {
      const [_k, pageNumber, pageSize, keyword, sorts] = queryKey as [
        string,
        number,
        number,
        string,
        string
      ];
      return CategoriesPostApi.getCategories(
        pageNumber,
        pageSize,
        keyword,
        sorts
      );
    },
    placeholderData: keepPreviousData,
  });

  const totalPages = categoriesData?.data?.totalPages || 0;

  const createForm = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { title: "", description: "" },
  });

  const editForm = useForm<CategoryFormData>({
    resolver: zodResolver(categorySchema),
    defaultValues: { title: "", description: "" },
  });

  const deleteForm = useForm<{ confirmText: string }>({
    resolver: zodResolver(
      z.object({
        confirmText: z.string().refine((v) => v === "OK", {
          message: "Vui lòng nhập OK để xác nhận",
        }),
      })
    ),
    defaultValues: { confirmText: "" },
  });

  const createMutation = useMutation({
    mutationFn: (data: CategoryRequest) =>
      CategoriesPostApi.create({
        title: data.title,
        description: data.description,
      }),
    onSuccess: () => {
      toast.success("Tạo danh mục bài viết thành công");
      setIsCreateOpen(false);
      createForm.reset();
      queryClient.invalidateQueries({
        queryKey: ["categories-post", pageNumber, pageSize, keyword, sorts],
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Tạo danh mục thất bại");
    },
  });

  const handleCreateCategory = (data: CategoryFormData) => {
    createMutation.mutate({ title: data.title, description: data.description });
  };

  const handleEditCategory = (category: Category) => {
    setSelectedCategory(category);
    editForm.reset({
      title: category.title,
      description: category.description,
    });
    setIsEditOpen(true);
  };

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: CategoryRequest }) =>
      CategoriesPostApi.update(id, data),
    onSuccess: () => {
      toast.success("Cập nhật danh mục thành công");
      setIsEditOpen(false);
      setSelectedCategory(null);
      editForm.reset();
      queryClient.invalidateQueries({
        queryKey: ["categories-post", pageNumber, pageSize, keyword, sorts],
      });
    },
    onError: (err: any) => {
      toast.error(err?.response?.data?.message || "Cập nhật thất bại");
    },
  });

  const handleUpdateCategory = (data: CategoryFormData) => {
    if (!selectedCategory) return;
    updateMutation.mutate({
      id: selectedCategory.id,
      data: { title: data.title, description: data.description },
    });
  };

  const handleDeleteCategory = (category: Category) => {
    setCategoryToDelete(category);
    setIsDeleteOpen(true);
  };

  const handleSearch = (data: {
    keyword: string;
    sortBy: string;
    order: string;
  }) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("pageNumber");
      if (data.keyword.trim()) newParams.set("keyword", data.keyword.trim());
      else newParams.delete("keyword");
      if (data.sortBy) {
        if (data.order) newParams.set("sorts", `${data.sortBy}:${data.order}`);
        else newParams.set("sorts", `${data.sortBy}:asc`);
      } else newParams.delete("sorts");
      return newParams;
    });
  };

  const deleteMutation = useMutation({
    mutationFn: (id: number) => CategoriesPostApi.delete(id),
    onSuccess: () => {
      toast.success("Xóa danh mục thành công");
      setIsDeleteOpen(false);
      deleteForm.reset();
      setCategoryToDelete(null);
      queryClient.invalidateQueries({
        queryKey: ["categories-post", pageNumber, pageSize, keyword, sorts],
      });
    },
    onError: () => {
      toast.error("Xóa danh mục thất bại");
    },
  });

  const handleConfirmDelete = (_data: { confirmText: string }) => {
    if (!categoryToDelete) return;
    deleteMutation.mutate(categoryToDelete.id);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Quản lý danh mục bài viết
          </h2>
          <p className="text-muted-foreground">
            Tổ chức các bài viết theo danh mục
          </p>
        </div>
        <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#155e94] hover:bg-[#0b4674]">
              <Plus className="mr-2 h-4 w-4" /> Thêm danh mục
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <Form {...createForm}>
              <form onSubmit={createForm.handleSubmit(handleCreateCategory)}>
                <DialogHeader>
                  <DialogTitle>Tạo danh mục mới</DialogTitle>
                  <DialogDescription>
                    Thêm danh mục để nhóm các bài viết liên quan.
                  </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                  <FormField
                    control={createForm.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <FormLabel className="text-right">Tên</FormLabel>
                          <div className="col-span-3">
                            <FormControl>
                              <Input
                                placeholder="Nhập tên danh mục"
                                {...field}
                                onChange={(e) => field.onChange(e.target.value)}
                                className="w-full"
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
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <div className="grid grid-cols-4 items-center gap-4">
                          <FormLabel className="text-right">Mô tả</FormLabel>
                          <div className="col-span-3">
                            <FormControl>
                              <Textarea
                                placeholder="Mô tả ngắn về danh mục"
                                rows={3}
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
                  <Button
                    type="submit"
                    className="bg-[#155e94] hover:bg-[#0b4674] disabled:cursor-not-allowed"
                    disabled={createMutation.isPending}
                  >
                    {createMutation.isPending ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Đang tạo...
                      </>
                    ) : (
                      "Tạo danh mục"
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tất cả danh mục</CardTitle>
          <CardDescription>Danh sách các danh mục bài viết</CardDescription>
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
                            placeholder="Tìm kiếm danh mục bài viết theo tên"
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
                            <SelectItem value="title">Tiêu đề</SelectItem>
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
                  <Search className="mr-1 h-4 w-4" /> Tìm kiếm
                </Button>
              </form>
            </Form>
          </div>

          <div className="rounded-md border">
            {categoriesData?.data?.items.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Danh mục</TableHead>
                    <TableHead>Slug</TableHead>
                    <TableHead>Số bài viết</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                    <TableHead className="text-right">Hành động</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {categoriesData?.data?.items.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell>
                        <div className="flex items-center space-x-3">
                          <FolderOpen className="h-5 w-5 text-muted-foreground" />
                          <div>
                            <div className="font-medium">{category.title}</div>
                            <div className="text-sm text-muted-foreground">
                              {category.description}
                            </div>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <code className="text-sm bg-muted px-2 py-1 rounded">
                          {category.slug}
                        </code>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">—</Badge>
                      </TableCell>
                      <TableCell>
                        {category.createdAt
                          ? dayjs(category.createdAt).format(
                              "DD/MM/YYYY HH:mm:ss"
                            )
                          : "—"}
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Mở menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Hành động</DropdownMenuLabel>
                            <DropdownMenuItem
                              onClick={() => handleEditCategory(category)}
                            >
                              <Edit className="mr-2 h-4 w-4" /> Chỉnh sửa
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-red-600"
                              onClick={() => handleDeleteCategory(category)}
                            >
                              <Trash2 className="mr-2 h-4 w-4" /> Xóa danh mục
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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

          {totalPages >= 1 && (
            <div className="mt-4">
              <Pagination
                totalPages={totalPages}
                pageParamName="pageNumber"
                maxVisiblePages={7}
                showFirstLast={true}
                activeButtonClassName="bg-primary-color text-white hover:bg-hover-primary-color hover:text-white"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Edit Category Dialog */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...editForm}>
            <form onSubmit={editForm.handleSubmit(handleUpdateCategory)}>
              <DialogHeader>
                <DialogTitle>Chỉnh sửa danh mục</DialogTitle>
                <DialogDescription>
                  Thay đổi thông tin danh mục và lưu lại khi hoàn tất.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <FormField
                  control={editForm.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Tên</FormLabel>
                        <div className="col-span-3">
                          <FormControl>
                            <Input
                              {...field}
                              onChange={(e) => field.onChange(e.target.value)}
                              placeholder="Nhập tên danh mục"
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
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <div className="grid grid-cols-4 items-center gap-4">
                        <FormLabel className="text-right">Mô tả</FormLabel>
                        <div className="col-span-3">
                          <FormControl>
                            <Textarea {...field} rows={3} placeholder="Mô tả" />
                          </FormControl>
                          <FormMessage />
                        </div>
                      </div>
                    </FormItem>
                  )}
                />
              </div>
              <DialogFooter>
                <Button
                  type="submit"
                  className="bg-[#155e94] hover:bg-[#0b4674] disabled:cursor-not-allowed"
                  disabled={updateMutation.isPending}
                >
                  {updateMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang cập nhật...
                    </>
                  ) : (
                    "Lưu thay đổi"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirm Dialog */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <Form {...deleteForm}>
            <form onSubmit={deleteForm.handleSubmit(handleConfirmDelete)}>
              <DialogHeader>
                <DialogTitle>Xác nhận xóa danh mục</DialogTitle>
                <DialogDescription>
                  Hành động này không thể hoàn tác. Danh mục{" "}
                  <span className="font-semibold">
                    {categoryToDelete?.title}
                  </span>{" "}
                  sẽ bị xóa vĩnh viễn.
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
                        <span className="font-bold">OK</span> vào ô bên dưới:
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
                    setCategoryToDelete(null);
                  }}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  variant="destructive"
                  className="disabled:cursor-not-allowed"
                  disabled={
                    deleteForm.watch("confirmText") !== "OK" ||
                    deleteMutation.isPending
                  }
                >
                  {deleteMutation.isPending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Đang xóa...
                    </>
                  ) : (
                    "Xóa danh mục"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
