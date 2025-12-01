import { Link } from "react-router-dom";
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
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreHorizontal,
  Plus,
  Search,
  Eye,
  Edit,
  Trash2,
  FolderX,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "react-router-dom";
import { useForm, Controller } from "react-hook-form";
import { CategoriesPostApi } from "@/api/categoriesPost.api";
import { keepPreviousData } from "@tanstack/react-query";
import { PostApi } from "@/api/post.api";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import Pagination from "@/components/Pagination/Pagination";
import { AppUtils } from "@/utils/appUtils";

export default function PostsManagement() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const pageSize = 10;
  const pageNumber = Number(searchParams.get("pageNumber")) || 1;
  const keyword = searchParams.get("keyword") || "";
  const categoryId = searchParams.get("categoryId")
    ? Number(searchParams.get("categoryId"))
    : undefined;
  const sorts = searchParams.get("sorts") || "";

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

  if (sorts && sorts.includes(":")) {
    const [sField, sOrder] = sorts.split(":");
    const current = searchForm.getValues();
    if (!current.sortBy && !current.order) {
      searchForm.setValue("sortBy", sField || undefined);
      searchForm.setValue("order", sOrder || undefined);
    }
  }

  const { data: postsData } = useQuery({
    queryKey: ["posts", pageNumber, pageSize, keyword, sorts, categoryId],
    queryFn: ({ queryKey }) => {
      const [_k, pageNumber, pageSize, keyword, sorts, categoryId] =
        queryKey as [
          string,
          number,
          number,
          string,
          string,
          number | undefined
        ];
      return PostApi.getPosts(
        false,
        pageNumber,
        pageSize,
        keyword,
        sorts,
        categoryId
      ).catch((error) => {
        toast.error("Tải danh sách bài viết thất bại");
        throw error;
      });
    },
    placeholderData: keepPreviousData,
  });

  const { data: categoriesData } = useQuery({
    queryKey: ["categories_post", 1, 1000, ""],
    queryFn: ({ queryKey }) => {
      const [_, pageNumber, pageSize, keyword] = queryKey as [
        string,
        number,
        number,
        string
      ];
      return CategoriesPostApi.getCategories(pageNumber, pageSize, keyword);
    },
    placeholderData: keepPreviousData,
  });

  const deletePostMutation = useMutation({
    mutationFn: (id: number) => PostApi.deletePost(id),
    onSuccess: () => {
      toast.success("Xoá bài viết thành công");
      queryClient.invalidateQueries({
        queryKey: ["posts", pageNumber, pageSize, keyword, sorts, categoryId],
      });
    },
    onError: () => {
      toast.error("Xoá bài viết thất bại");
    },
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

  const getStatusBadge = (status: string) => {
    const colors = {
      PUBLIC: "bg-green-100 text-green-800",
      DRAFT: "bg-yellow-100 text-yellow-800",
      PENDING: "bg-blue-100 text-blue-800",
    } as const;
    return (
      <Badge className={colors[status as keyof typeof colors]}>{status}</Badge>
    );
  };

  const handleDeletePost = (postId: number) => {
    deletePostMutation.mutate(postId);
  };
  const handleTags = (input: string): string => {
    const matches = Array.from(input.matchAll(/\|([^|]+)\|/g)).map((m) => m[1]);
    const arrayTags = Array.from(new Set(matches));
    const res = arrayTags.reduce((acc, tag) => {
      return `${acc} #${tag}`;
    }, "");
    return res.trim();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Quản lý bài viết
          </h2>
          <p className="text-muted-foreground">
            Quản lý những bài viết trên nền tảng
          </p>
        </div>
        <Link to="/admin/posts/create">
          <Button className="bg-[#155e94] hover:bg-[#0b4674]">
            <Plus className="mr-1 h-4 w-4" />
            Tạo bài viết
          </Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tất cả bài viết</CardTitle>
          <CardDescription>
            Danh sách tất cả các bài đăng trên blog bao gồm trạng thái, tác
            giả,...
          </CardDescription>
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
                  placeholder="Tìm bài viết..."
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
                <Search />
                Tìm
              </Button>
            </form>
          </div>

          <div className="rounded-md border">
            {postsData?.data.items.length > 0 ? (
              <>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="max-w-[320px]">Tiêu đề</TableHead>
                      <TableHead className="max-w-[160px]">Tác giả</TableHead>
                      <TableHead>Danh mục</TableHead>
                      <TableHead>Trạng thái</TableHead>
                      <TableHead>Hình đại diện</TableHead>
                      <TableHead className="max-w-[160px]">Tags</TableHead>
                      <TableHead>Thời gian tạo</TableHead>
                      <TableHead className="text-right">Hành động</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {postsData?.data.items.map((post) => (
                      <TableRow key={post.id}>
                        <TableCell className="max-w-[200px] truncate whitespace-nowrap">
                          <div className="truncate">{post.title}</div>
                        </TableCell>
                        <TableCell className="max-w-[160px] truncate whitespace-nowrap">
                          <div className="truncate">{post.author.fullName}</div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="max-w-[160px]">
                            <div className="truncate">
                              {post.category.title}
                            </div>
                          </Badge>
                        </TableCell>
                        <TableCell>{getStatusBadge(post.status)}</TableCell>
                        <TableCell>
                          <img
                            src={post.thumbnailUrl}
                            alt="Thumbnail"
                            className="h-10 w-18 object-cover rounded"
                          />
                        </TableCell>
                        <TableCell className="max-w-[160px] truncate whitespace-nowrap">
                          <div className="truncate">
                            {post.tags ? handleTags(post.tags) : "Chưa có"}
                          </div>
                        </TableCell>
                        <TableCell>
                          {dayjs(post.createdAt).format("DD/MM/YYYY HH:mm:ss")}
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
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuItem>
                                <Link
                                  to={`/posts/${encodeURIComponent(
                                    AppUtils.renderSlug(post.slug, post.id)
                                  )}`}
                                  target="_blank"
                                  className="flex flex-row items-center"
                                >
                                  <Eye className="mr-2 h-4 w-4" />
                                  Xem bài viết
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                <Link
                                  to={`/admin/posts/edit/${post.id}`}
                                  className="flex flex-row items-center"
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  Chỉnh sửa
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuItem
                                className="text-red-600 cursor-pointer"
                                onClick={() => handleDeletePost(post.id)}
                              >
                                <Trash2 className="mr-2 h-4 w-4" />
                                Xoá
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
                {postsData?.data && (
                  <div className="flex items-center justify-between px-4 py-3 border-t">
                    <div className="text-sm text-muted-foreground">
                      {(() => {
                        const current = postsData.data.pageNumber || 1;
                        const totalPages = postsData.data.totalPages || 1;
                        const start =
                          (postsData.data.pageNumber - 1) *
                          postsData.data.pageSize +
                          1;
                        const end = start + postsData.data.numberOfElements - 1;
                        return (
                          <span>
                            Trang <span className="font-medium">{current}</span>{" "}
                            / <span className="font-medium">{totalPages}</span>
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
                        totalPages={postsData.data.totalPages}
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
    </div>
  );
}
