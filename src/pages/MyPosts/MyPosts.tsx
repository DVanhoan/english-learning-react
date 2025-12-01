import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Link, useSearchParams } from "react-router-dom";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  FolderX,
  Loader2,
} from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import {
  useMutation,
  useQuery,
  useQueryClient,
  keepPreviousData,
} from "@tanstack/react-query";
import { PostApi } from "@/api/post.api";
import { CategoriesPostApi } from "@/api/categoriesPost.api";
import { toast } from "react-toastify";
import dayjs from "dayjs";
import Pagination from "@/components/Pagination/Pagination";
import { AppUtils } from "@/utils/appUtils";
import routes from "@/routes/routes.const";

export default function MyPosts() {
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

  useEffect(() => {
    if (sorts && sorts.includes(":")) {
      const [sField, sOrder] = sorts.split(":");
      const current = searchForm.getValues();
      if (!current.sortBy && !current.order) {
        searchForm.setValue("sortBy", sField || undefined);
        searchForm.setValue("order", sOrder || undefined);
      }
    }
  }, [sorts, searchForm]);

  const {
    data: myPostsData,
    isError,
    error,
  } = useQuery({
    queryKey: ["my-posts", pageNumber, pageSize, keyword, sorts, categoryId],
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
      return PostApi.getMyPosts(
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
    queryKey: ["categories-post", 1, 1000, ""],
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
        queryKey: [
          "my-posts",
          pageNumber,
          pageSize,
          keyword,
          sorts,
          categoryId,
        ],
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
    const labels = {
      PUBLIC: "Đã đăng",
      DRAFT: "Bản nháp",
      PENDING: "Chờ duyệt",
    } as const;
    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {labels[status as keyof typeof labels] || status}
      </Badge>
    );
  };

  const handleDeletePost = (postId: number) => {
    if (confirm("Bạn có chắc chắn muốn xóa bài viết này?")) {
      deletePostMutation.mutate(postId);
    }
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
    <div className="min-h-screen bg-gray-50">
      <div className="main-layout py-8">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-primary-color">
            Bài viết của tôi
          </h1>
          <Button
            className="bg-primary-color hover:bg-hover-primary-color w-full sm:w-auto"
            asChild
          >
            <Link to={routes.USER_CREATE_POST}>
              <Plus className="h-4 w-4 mr-2" />
              <span className="sm:inline">Tạo bài viết mới</span>
            </Link>
          </Button>
        </div>

        {isError && (
          <div className="mb-4 rounded-md border border-red-200 bg-red-50 p-3 text-red-700">
            {(error as any)?.response?.data?.message ||
              "Tải danh sách bài viết thất bại"}
          </div>
        )}

        <Card className="mb-6">
          <CardContent className="pt-6">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const form = searchForm.getValues();
                handleSearch(form);
              }}
              className="space-y-4"
            >
              {/* Desktop: horizontal single row, Mobile: stacked with labels */}
              <div className="lg:flex lg:items-center lg:space-x-0 space-y-4 lg:space-y-0">
                {/* Search input */}
                <div className="relative lg:flex-1">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Tìm kiếm bài viết..."
                    className="pl-10 h-9 lg:rounded-r-none lg:border-r-0"
                    {...searchForm.register("keyword")}
                  />
                </div>

                {/* Category */}
                <div className="lg:hidden space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Danh mục
                  </label>
                </div>
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
                      <SelectTrigger className="h-9 lg:rounded-none lg:border-r-0 lg:w-[140px]">
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

                {/* Sort by */}
                <div className="lg:hidden space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Sắp xếp theo
                  </label>
                </div>
                <Controller
                  control={searchForm.control}
                  name="sortBy"
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-9 lg:rounded-none lg:border-r-0 lg:w-[130px]">
                        <SelectValue placeholder="Sắp xếp" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="createdAt">Ngày tạo</SelectItem>
                        <SelectItem value="updatedAt">Ngày cập nhật</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                <div className="lg:hidden space-y-1">
                  <label className="text-sm font-medium text-gray-700">
                    Thứ tự
                  </label>
                </div>
                <Controller
                  control={searchForm.control}
                  name="order"
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger className="h-9 lg:rounded-none lg:border-r-0 lg:w-[110px]">
                        <SelectValue placeholder="Thứ tự" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asc">Tăng dần</SelectItem>
                        <SelectItem value="desc">Giảm dần</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />

                <Button
                  type="submit"
                  className="h-9 lg:rounded-l-none bg-primary-color hover:bg-hover-primary-color text-white w-full lg:w-auto"
                >
                  <Search className="h-4 w-4 mr-2" />
                  Tìm kiếm
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {(myPostsData?.data?.items?.length ?? 0) === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                <FolderX className="h-12 w-12 mb-3 text-gray-400" />
                <p className="text-lg font-medium">Bạn chưa có bài viết nào.</p>
                <Button
                  className="mt-4 bg-primary-color hover:bg-hover-primary-color"
                  asChild
                >
                  <Link to="/my-posts/create">Tạo bài viết đầu tiên</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
              {myPostsData?.data.items.map((post) => (
                <Card key={post.id}>
                  <CardContent className="p-4">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <img
                        src={post.thumbnailUrl || "/placeholder.svg"}
                        alt={post.title}
                        className="w-full sm:w-32 md:w-40 h-24 object-cover rounded-md flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0 w-full">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                          <Badge className="bg-primary-color text-white text-xs">
                            {post.category.title}
                          </Badge>
                          {getStatusBadge(post.status)}
                        </div>
                        <h3 className="font-semibold text-base sm:text-lg line-clamp-2 mb-2">
                          <Link
                            to={`/posts/${encodeURIComponent(
                              AppUtils.renderSlug(post.slug, post.id)
                            )}`}
                            className="hover:text-primary-color"
                          >
                            {post.title}
                          </Link>
                        </h3>
                        <p className="text-sm text-gray-600 line-clamp-2 mb-3">
                          {post.excerpt}
                        </p>

                        {/* Info row - responsive */}
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-sm text-gray-500 mb-3">
                          <div className="flex items-center gap-1">
                            <Eye className="h-4 w-4" />
                            <span>{post.readingTimeMinutes} phút đọc</span>
                          </div>
                          <span className="text-xs sm:text-sm">
                            Ngày tạo:{" "}
                            {dayjs(post.createdAt).format("DD/MM/YYYY")}
                          </span>
                          {post.tags && (
                            <span className="text-xs sm:text-sm max-w-full sm:max-w-[200px] truncate">
                              {handleTags(post.tags)}
                            </span>
                          )}
                        </div>

                        {/* Action buttons - always at bottom on mobile */}
                        <div className="flex gap-2 justify-end sm:justify-start">
                          <Button variant="outline" size="icon" asChild>
                            <Link to={`/my-posts/edit/${post.id}`}>
                              <Edit className="h-4 w-4" />
                              <span className="sr-only">Chỉnh sửa</span>
                            </Link>
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            className="disabled:cursor-not-allowed"
                            disabled={deletePostMutation.isPending}
                            onClick={() => handleDeletePost(post.id)}
                          >
                            {deletePostMutation.isPending ? (
                              <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                              <Trash2 className="h-4 w-4" />
                            )}
                            <span className="sr-only">Xóa</span>
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {myPostsData?.data && myPostsData.data.totalPages > 0 && (
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 px-4 py-3">
                <div className="text-sm text-muted-foreground text-center sm:text-left">
                  {(() => {
                    const current = myPostsData.data.pageNumber || 1;
                    const totalPages = myPostsData.data.totalPages || 1;
                    const start =
                      (myPostsData.data.pageNumber - 1) *
                        myPostsData.data.pageSize +
                      1;
                    const end = start + myPostsData.data.numberOfElements - 1;
                    return (
                      <span className="block sm:inline">
                        Trang <span className="font-medium">{current}</span> /{" "}
                        <span className="font-medium">{totalPages}</span>
                        <span className="hidden sm:inline mx-2">·</span>
                        <span className="block sm:inline">
                          Hiển thị <span className="font-medium">{start}</span>{" "}
                          - <span className="font-medium">{end}</span>
                        </span>
                      </span>
                    );
                  })()}
                </div>

                <div className="flex justify-center">
                  <Pagination
                    totalPages={myPostsData.data.totalPages}
                    pageParamName="pageNumber"
                    maxVisiblePages={5}
                    activeButtonClassName="bg-primary-color text-white hover:text-white hover:bg-hover-primary-color"
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
