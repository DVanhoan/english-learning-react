import { Link, useSearchParams } from "react-router-dom";
import { useState } from "react";
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Plus, Search, Edit, Trash2, Eye } from "lucide-react";
import Pagination from "@/components/Pagination";
import { CourseApi } from "@/api/course.api";
import type { Course } from "@/types/course.type";
import { toast } from "react-toastify";
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { useForm, Controller } from "react-hook-form";
import { CategoriesCourseApi } from "@/api/categoriesCourse.api";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FolderX } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

export default function CoursesManagement() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<Course | null>(null);
  const pageSize = 10;
  const pageNumber = Number(searchParams.get("pageNumber")) || 1;
  const keyword = searchParams.get("keyword") || "";
  const categoryId = searchParams.get("categoryId")
    ? Number(searchParams.get("categoryId"))
    : undefined;
  const sortsParam = searchParams.get("sorts") || "";

  const searchForm = useForm<{
    keyword: string;
    categoryId?: string | undefined;
    sortBy?: string | undefined;
    order?: string | undefined;
  }>({
    defaultValues: {
      keyword: keyword || "",
      categoryId: categoryId ? categoryId.toString() : undefined,
      sortBy: undefined,
      order: undefined,
    },
  });
  if (sortsParam && sortsParam.includes(":")) {
    const [sField, sOrder] = sortsParam.split(":");
    const current = searchForm.getValues();
    if (!current.sortBy && !current.order) {
      searchForm.setValue("sortBy", sField || undefined);
      searchForm.setValue("order", sOrder || undefined);
    }
  }

  type DeleteConfirmData = { confirmText: string };
  const deleteConfirmSchema = z.object({
    confirmText: z.string().refine((v) => v === "OK", {
      message: 'Vui lòng nhập "OK" để xác nhận',
    }),
  });

  const deleteForm = useForm<DeleteConfirmData>({
    resolver: zodResolver(deleteConfirmSchema),
    defaultValues: { confirmText: "" },
  });

  const isConfirmOK = deleteForm.watch("confirmText") === "OK";

  const openDeleteDialog = (course: Course) => {
    setCourseToDelete(course);
    deleteForm.reset({ confirmText: "" });
    setIsDeleteOpen(true);
  };

  const handleConfirmDelete = async (_data: DeleteConfirmData) => {
    if (!courseToDelete) return;
    try {
      await deleteCourseMutation.mutateAsync(courseToDelete.id);
      setIsDeleteOpen(false);
      setCourseToDelete(null);
    } catch (_) {
      // empty
    }
  };

  const { data: coursesData } = useQuery({
    queryKey: [
      "courses",
      pageNumber,
      pageSize,
      keyword,
      sortsParam,
      categoryId,
    ],
    queryFn: ({ queryKey }) => {
      const [_k, pageNumber, pageSize, keyword, sortsParam, categoryId] =
        queryKey as [
          string,
          number,
          number,
          string,
          string,
          number | undefined
        ];

      const sorts = sortsParam ? sortsParam.split(",") : ["createdAt:desc"];
      return CourseApi.getAll(
        pageNumber,
        pageSize,
        keyword,
        sorts,
        categoryId
      ).catch((error) => {
        toast.error("Tải danh sách khoá học thất bại");
        throw error;
      });
    },
    placeholderData: keepPreviousData,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories_course", 1, 1000, ""],
    queryFn: ({ queryKey }) => {
      const [_, pn, ps, kw] = queryKey as [string, number, number, string];
      return CategoriesCourseApi.getCategories(pn, ps, kw);
    },
    placeholderData: keepPreviousData,
  });

  const deleteCourseMutation = useMutation({
    mutationFn: (id: number) => CourseApi.delete(id),
    onSuccess: () => {
      toast.success("Xoá khoá học thành công");
      queryClient.invalidateQueries({
        queryKey: [
          "courses",
          pageNumber,
          pageSize,
          keyword,
          sortsParam,
          categoryId,
        ],
      });
    },
    onError: () => toast.error("Xoá khoá học thất bại"),
  });

  const handleSearch = (values: {
    keyword: string;
    categoryId?: string;
    sortBy?: string;
    order?: string;
  }) => {
    setSearchParams((prev) => {
      const newParams = new URLSearchParams(prev);
      newParams.delete("pageNumber");
      if (values.keyword && values.keyword.trim())
        newParams.set("keyword", values.keyword.trim());
      else newParams.delete("keyword");
      if (values.categoryId) newParams.set("categoryId", values.categoryId);
      else newParams.delete("categoryId");
      if (values.sortBy) {
        const order = values.order || "asc";
        newParams.set("sorts", `${values.sortBy}:${order}`);
      } else {
        newParams.delete("sorts");
      }
      return newParams;
    });
  };

  const getStatusBadge = (status: Course["status"]) => {
    const colors: Record<Course["status"], string> = {
      PUBLIC: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
      HIDDEN: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
    };
    const labels: Record<Course["status"], string> = {
      PUBLIC: "Công khai",
      HIDDEN: "Tạm ẩn",
    };
    return (
      <Badge
        className={`rounded-full px-2.5 py-0.5 text-xs font-medium ring-inset ${colors[status]}`}
      >
        {labels[status]}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Quản lý khoá học
          </h2>
          <p className="text-muted-foreground">
            Quản lý những khoá học trên nền tảng
          </p>
        </div>
        <Link to="/admin/courses/create">
          <Button className="bg-[#155e94] hover:bg-[#0b4674]">
            <Plus className="mr-2 h-4 w-4" />
            Tạo khoá học
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tất cả khoá học</CardTitle>
          <CardDescription>Danh sách khoá học và trạng thái</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2 mb-4">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = searchForm.getValues();
                handleSearch(form);
              }}
              className="flex items-center w-full"
            >
              <div className="relative flex-1">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Tìm khoá học..."
                  className="pl-10 h-9 rounded-r-none border-r-0"
                  {...searchForm.register("keyword")}
                />
              </div>

              <div>
                <Controller
                  control={searchForm.control}
                  name="categoryId"
                  render={({ field }) => (
                    <Select
                      value={field.value ?? "__ALL__"}
                      onValueChange={(v) =>
                        field.onChange(v === "__ALL__" ? undefined : v)
                      }
                    >
                      <SelectTrigger className="h-9 rounded-none border-r-0">
                        <SelectValue placeholder="Danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="__ALL__">Tất cả</SelectItem>
                        {categoriesData?.data.items.map((c) => (
                          <SelectItem key={c.id} value={c.id.toString()}>
                            {c.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <Controller
                  control={searchForm.control}
                  name="sortBy"
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-9 rounded-none border-r-0">
                        <SelectValue placeholder="Sắp xếp" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="createdAt">Ngày tạo</SelectItem>
                        <SelectItem value="updatedAt">Ngày cập nhật</SelectItem>
                        <SelectItem value="title">Tiêu đề</SelectItem>
                        <SelectItem value="price">Giá gốc</SelectItem>
                        <SelectItem value="discountPrice">
                          Giá đã giảm
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div>
                <Controller
                  control={searchForm.control}
                  name="order"
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-9 rounded-none border-r-0">
                        <SelectValue placeholder="Thứ tự" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Tăng dần</SelectItem>
                        <SelectItem value="desc">Giảm dần</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <Button
                type="submit"
                className="h-9 rounded-l-none bg-[#155e94] hover:bg-[#0b4674] text-white px-4"
              >
                <Search className="mr-1 h-4 w-4" />
                Tìm kiếm
              </Button>
            </form>
          </div>

          <div className="rounded-md border">
            {coursesData?.data.items.length ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="max-w-[250px]">Khoá học</TableHead>
                      <TableHead>Hình ảnh</TableHead>
                      <TableHead>Giảng viên</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Giá gốc</TableHead>
                      <TableHead>Giá khuyến mãi</TableHead>
                      <TableHead>Ngày tạo</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {coursesData?.data.items.map((course) => (
                      <TableRow key={course.id}>
                        <TableCell className="max-w-[250px] truncate whitespace-nowrap">
                          <div className="font-medium truncate">
                            {course.title}
                          </div>
                        </TableCell>
                        <TableCell>
                          <img
                            src={course.thumbnailUrl}
                            alt="Thumbnail"
                            className="h-10 w-18 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell className="max-w-[180px] truncate whitespace-nowrap">
                          <div className="truncate">
                            {course.teacher?.fullName}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className="rounded-full px-2.5 py-0.5 text-xs font-medium border-slate-200 text-slate-600 max-w-[200px]"
                          >
                            <div className="truncate">
                              {(course.category as any)?.title ||
                                (course.category as any)?.name}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {getStatusBadge(course.status)}
                        </TableCell>
                        <TableCell className="font-medium whitespace-nowrap">
                          {course.isFree
                            ? "Miễn phí"
                            : new Intl.NumberFormat("vi-VN").format(
                                course.price
                              ) + " đ"}
                        </TableCell>
                        <TableCell className="font-medium whitespace-nowrap">
                          {course.isFree ||
                          !course.discountPrice ||
                          course.discountPrice <= 0
                            ? "-"
                            : new Intl.NumberFormat("vi-VN").format(
                                course.discountPrice
                              ) + " đ"}
                        </TableCell>
                        <TableCell className="whitespace-nowrap">
                          {new Date(course.createdAt).toLocaleDateString(
                            "vi-VN"
                          )}
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
                              <DropdownMenuItem asChild>
                                <Link
                                  to={`/courses/${course.id}`}
                                  target="_blank"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Xem khoá học
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link
                                  to={`/admin/courses/${course.id}/chapters`}
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Quản lý chương học
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem asChild>
                                <Link to={`/admin/courses/edit/${course.id}`}>
                                  <Edit className="mr-2 h-4 w-4" />
                                  Chỉnh sửa
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => openDeleteDialog(course)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xoá khoá học
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {coursesData?.data && (
                  <div className="flex items-center justify-between px-4 py-3 border-t">
                    <div className="text-sm text-muted-foreground">
                      {(() => {
                        const current = coursesData.data.pageNumber || 1;
                        const total = coursesData.data.totalPages || 1;
                        const start =
                          (coursesData.data.pageNumber - 1) *
                            coursesData.data.pageSize +
                          1;
                        const end =
                          start + coursesData.data.numberOfElements - 1;
                        return (
                          <span>
                            Trang <span className="font-medium">{current}</span>{" "}
                            / <span className="font-medium">{total}</span>
                            <span className="mx-2">·</span>
                            Hiển thị{" "}
                            <span className="font-medium">{start}</span> -{" "}
                            <span className="font-medium">{end}</span>
                          </span>
                        );
                      })()}
                    </div>

                    <div>
                      <Pagination
                        totalPages={coursesData.data.totalPages}
                        pageParamName="pageNumber"
                        maxVisiblePages={7}
                        activeButtonClassName="bg-primary-color text-white hover:text-white hover:bg-hover-primary-color"
                      />
                    </div>
                  </div>
                )}
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
        </CardContent>
      </Card>

      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Xác nhận xoá khoá học</DialogTitle>
            <DialogDescription>
              Hành động này không thể hoàn tác. Vui lòng nhập "OK" để xác nhận
              xoá khoá học{courseToDelete ? `: ${courseToDelete.title}` : ""}.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={deleteForm.handleSubmit(handleConfirmDelete)}
            className="space-y-4"
          >
            <div className="space-y-2">
              <Label htmlFor="delete-confirm">Nhập OK để xác nhận</Label>
              <Input
                id="delete-confirm"
                placeholder="Nhập OK để xác nhận"
                {...deleteForm.register("confirmText")}
              />
              {deleteForm.formState.errors.confirmText && (
                <p className="text-sm text-red-600">
                  {String(deleteForm.formState.errors.confirmText.message)}
                </p>
              )}
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsDeleteOpen(false)}
                disabled={deleteCourseMutation.isPending}
              >
                Huỷ
              </Button>
              <Button
                type="submit"
                className="bg-red-600 hover:bg-red-700 text-white"
                disabled={deleteCourseMutation.isPending || !isConfirmOK}
              >
                {deleteCourseMutation.isPending
                  ? "Đang xoá..."
                  : "Xác nhận xoá"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
