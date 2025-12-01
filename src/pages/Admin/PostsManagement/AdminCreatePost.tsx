import { useEffect, useState, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import RichTextEditor from "@/components/RichTextEditor";
import { ArrowLeft, Save, UploadCloud, Loader2 } from "lucide-react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "react-toastify";
import { Textarea } from "@/components/ui/textarea";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { UserApi } from "@/api/users.api";
import { CategoriesPostApi } from "@/api/categoriesPost.api";
import { postSchema, type PostFormValues } from "./schemaValidation";
import type { PostRequest } from "@/types/post.type";
import { PostApi } from "@/api/post.api";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "@/types/common.type";
import routes from "@/routes/routes.const";

export default function AdminCreatePost() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const location = useLocation();
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { id } = useParams();

  console.log(location.pathname);

  const [categories, setCategories] = useState<{ id: number; title: string }[]>(
    []
  );
  const [users, setUsers] = useState<{ id: number; fullName: string }[]>([]);
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (location.pathname.includes("/admin/posts/edit")) {
      if (isNaN(Number(id)) || Number(id) < 1) {
        navigate(routes.POSTS_MANAGEMENT);
      }
    }
  }, [location.pathname, id, navigate]);

  useQuery({
    queryKey: ["posts", id],
    queryFn: () =>
      PostApi.getPost(Number(id))
        .then((response) => {
          setIsEdit(true);
          reset({
            title: response.data.title,
            excerpt: response.data.excerpt,
            content: response.data.content,
            categoryId: response.data.category.id,
            authorId: response.data.author.id,
            status: response.data.status,
          });
          setThumbnailPreview(response.data.thumbnailUrl);
          return response;
        })
        .catch((error) => {
          navigate(routes.POSTS_MANAGEMENT);
          throw error;
        }),
    enabled:
      location.pathname.includes("/admin/posts/edit") &&
      !isNaN(Number(id)) &&
      Number(id) > 0,
  });

  const {
    control,
    register,
    handleSubmit,
    setError,
    reset,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      categoryId: undefined,
      authorId: undefined,
      status: "",
    },
  });

  useQuery({
    queryKey: ["users", 1, 100000, ""],
    queryFn: ({ queryKey }) => {
      const [_, pageNumber, pageSize, keyword] = queryKey as [
        string,
        number,
        number,
        string
      ];
      return UserApi.getUsers(pageNumber, pageSize, keyword)
        .then((response) => {
          const data = response.data.items;
          if (data.length > 0)
            setUsers(data.map((u) => ({ id: u.id, fullName: u.fullName })));
        })
        .catch(() => toast.error("Tải danh sách người dùng thất bại"));
    },
  });

  useEffect(() => {
    return () => {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    };
  }, [thumbnailPreview]);

  const handleThumbnailChange = (e: any) => {
    const file = e?.target?.files?.[0] ?? null;
    if (!file) {
      if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
      setThumbnailFile(null);
      setThumbnailPreview(null);
      return;
    }
    if (thumbnailPreview) URL.revokeObjectURL(thumbnailPreview);
    setThumbnailFile(file);
    setThumbnailPreview(URL.createObjectURL(file));
  };

  useQuery({
    queryKey: ["categories_post", 1, 100000, ""],
    queryFn: ({ queryKey }) => {
      const [_, pageNumber, pageSize, keyword] = queryKey as [
        string,
        number,
        number,
        string
      ];
      return CategoriesPostApi.getCategories(pageNumber, pageSize, keyword)
        .then((response) => {
          const data = response.data.items;
          if (data.length > 0)
            setCategories(data.map((u) => ({ id: u.id, title: u.title })));
        })
        .catch(() => toast.error("Tải danh sách danh mục thất bại"));
    },
  });

  const createPostMutation = useMutation({
    mutationFn: (data: { payload: PostRequest; thumbnail: File }) => {
      return PostApi.createPost(data.payload, data.thumbnail);
    },
    onSuccess: () => {
      toast.success("Tạo bài viết thành công");
      navigate(routes.POSTS_MANAGEMENT);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (!error.response.data.errors) {
        toast.error(error.response.data.message);
      } else {
        error.response.data.errors.forEach((fieldError) => {
          if (fieldError.fieldName === "thumbnail") {
            toast.error("Chỉ chấp nhận thumbnail là file ảnh");
          } else {
            setError(fieldError.fieldName as keyof PostFormValues, {
              type: "manual",
              message: fieldError.message,
            });
          }
        });
      }
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: (data: { payload: PostRequest; thumbnail: File }) => {
      return PostApi.updatePost(data.payload, data.thumbnail, Number(id));
    },
    onSuccess: () => {
      toast.success("Cập nhật viết thành công");
      queryClient.invalidateQueries({ queryKey: ["posts", id] });
      navigate(routes.POSTS_MANAGEMENT);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (!error.response.data.errors) {
        toast.error(error.response.data.message);
      } else {
        error.response.data.errors.forEach((fieldError) => {
          setError(fieldError.fieldName as keyof PostFormValues, {
            type: "manual",
            message: fieldError.message,
          });
        });
      }
    },
  });

  const onSubmit = (data: PostFormValues) => {
    const payload = {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      categoryId: data.categoryId,
      authorId: data.authorId,
      status: data.status,
    };
    if (!thumbnailFile && !isEdit) {
      toast.error(
        "Vui lòng chọn ảnh đại diện (thumbnail) trước khi tạo bài viết"
      );
      return;
    }
    if (!isEdit)
      createPostMutation.mutate({ payload, thumbnail: thumbnailFile });
    else updatePostMutation.mutate({ payload, thumbnail: thumbnailFile });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => navigate("/admin/posts")}
            className="mb-2 px-2 py-1 bg-[#e6f6ff] text-[#155e94] hover:bg-[#cfeefe] rounded-md self-start"
          >
            <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại danh sách bài viết
          </Button>
          <div>
            <h2 className="text-3xl font-bold tracking-tight">
              {isEdit ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
            </h2>
            <p className="text-muted-foreground">
              {isEdit
                ? "Cập nhật bài viết"
                : "Viết và xuất bản bài viết mới đi"}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            className="bg-[#155e94] hover:bg-[#0b4674] disabled:cursor-not-allowed"
            onClick={handleSubmit(onSubmit)}
            disabled={
              createPostMutation.isPending || updatePostMutation.isPending
            }
          >
            {createPostMutation.isPending || updatePostMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "Đang cập nhật..." : "Đang tạo..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEdit ? "Cập nhật" : "Lưu"}
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Nội dung bài viết</CardTitle>
              <CardDescription>
                Viết nội dung bài viết bằng công cụ soạn thảo bên dưới.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tiêu đề</Label>
                <Input
                  id="title"
                  {...register("title")}
                  placeholder="Nhập tiêu đề bài viết..."
                />
                {errors.title && (
                  <p className="text-sm text-red-600">
                    {String((errors as any).title?.message)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="excerpt">Tóm tắt</Label>
                <Textarea
                  rows={5}
                  id="excerpt"
                  {...register("excerpt")}
                  placeholder="Mô tả ngắn về bài viết..."
                />
                {errors.excerpt && (
                  <p className="text-sm text-red-600">
                    {String((errors as any).excerpt?.message)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label>Nội dung</Label>
                <p className="text-sm text-muted-foreground">
                  Ghi chú: nếu muốn dùng hashtag, hãy bắt đầu bằng dấu # (ví dụ:
                  #nguphap)
                </p>
                <div>
                  <Controller
                    control={control}
                    name="content"
                    render={({ field }) => (
                      <RichTextEditor
                        content={field.value || ""}
                        onChange={(val) => field.onChange(val)}
                        placeholder="Bắt đầu viết nội dung bài viết..."
                      />
                    )}
                  />
                  {errors.content && (
                    <p className="text-sm text-red-600">
                      {String((errors as any).content?.message)}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="mt-6">
            <input
              id="thumbnail"
              ref={thumbnailInputRef}
              type="file"
              accept="image/*"
              onChange={handleThumbnailChange}
              className="hidden"
            />
            <label htmlFor="thumbnail" className="block">
              {!thumbnailPreview ? (
                <div className="flex flex-col items-center justify-center gap-3 p-8 border-2 border-dashed rounded cursor-pointer hover:bg-gray-50">
                  <UploadCloud className="h-12 w-12 text-muted-foreground" />
                  <div className="text-center">
                    <div className="text-lg font-medium">
                      Kéo thả hoặc nhấn để chọn ảnh đại diện
                    </div>
                    <div className="text-sm text-muted-foreground">
                      PNG, JPG. Ảnh sẽ hiển thị ở đây sau khi chọn
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative border rounded overflow-hidden">
                  <img
                    src={thumbnailPreview}
                    alt="thumbnail-preview"
                    className="w-full h-80 object-cover"
                  />
                  <button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      if (thumbnailPreview && !isEdit)
                        URL.revokeObjectURL(thumbnailPreview);
                      setThumbnailFile(null);
                      setThumbnailPreview(null);
                      if (thumbnailInputRef.current)
                        thumbnailInputRef.current.value = "";
                    }}
                    className="absolute top-2 right-2 bg-white/80 text-sm px-2 py-1 rounded shadow"
                  >
                    Xóa
                  </button>
                </div>
              )}
            </label>
          </div>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Cài đặt bài viết</CardTitle>
              <CardDescription>
                Thiết lập trạng thái và phân loại bài viết.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="status">Trạng thái</Label>
                <Controller
                  control={control}
                  name="status"
                  render={({ field }) => (
                    <Select
                      value={field.value || ""}
                      onValueChange={field.onChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn trạng thái" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DRAFT">Bản nháp</SelectItem>
                        <SelectItem value="PENDING">Chờ duyệt</SelectItem>
                        <SelectItem value="PUBLIC">Công khai</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.status && (
                  <p className="text-sm text-red-600">
                    {String(errors.status.message)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="categoryId">Danh mục</Label>
                <Controller
                  control={control}
                  name="categoryId"
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString() || ""}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn danh mục" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((c) => (
                          <SelectItem key={c.id} value={c.id.toString()}>
                            {c.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.categoryId && (
                  <p className="text-sm text-red-600">
                    {String((errors as any).categoryId?.message)}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="authorId">Tác giả</Label>
                <Controller
                  control={control}
                  name="authorId"
                  render={({ field }) => (
                    <Select
                      value={field.value?.toString() || ""}
                      onValueChange={(v) => field.onChange(Number(v))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Chọn tác giả" />
                      </SelectTrigger>
                      <SelectContent>
                        {users.map((u) => (
                          <SelectItem key={u.id} value={u.id.toString()}>
                            {u.fullName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                />
                {errors.authorId && (
                  <p className="text-sm text-red-600">
                    {String((errors as any).authorId?.message)}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Xuất bản</CardTitle>
              <CardDescription>
                Thiết lập cách bài viết được xuất bản.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-sm text-muted-foreground">
                <p>Trạng thái:</p>
                <p>
                  <span className="font-medium">
                    Công khai: Xuất bản ngay lập tức
                  </span>
                </p>
                <p>
                  <span className="font-medium">
                    Bản nháp: Lưu bản nháp, chưa xuất bản
                  </span>
                </p>
                <p>
                  <span className="font-medium">
                    Chờ duyệt: Chờ quản trị viên duyệt
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
