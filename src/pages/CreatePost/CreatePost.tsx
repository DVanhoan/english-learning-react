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
import { useMutation, useQuery } from "@tanstack/react-query";
import { CategoriesPostApi } from "@/api/categoriesPost.api";
import { userPostSchema, type UserPostFormValues } from "./schemaValidation";
import type { PostRequest } from "@/types/post.type";
import { PostApi } from "@/api/post.api";
import type { AxiosError } from "axios";
import type { ErrorResponse } from "@/types/common.type";
import routes from "@/routes/routes.const";
import useAuth from "@/context/AuthContext";

export default function CreatePost() {
  const navigate = useNavigate();
  const location = useLocation();
  const { state } = useAuth();
  const user = state.user;
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const { id } = useParams();

  const [categories, setCategories] = useState<{ id: number; title: string }[]>(
    []
  );
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const thumbnailInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (location.pathname.includes("/my-posts/edit")) {
      if (isNaN(Number(id)) || Number(id) < 1) {
        navigate(routes.MY_POSTS);
      }
    }
  }, [location.pathname, id, navigate]);

  useQuery({
    queryKey: ["posts", id],
    queryFn: () =>
      PostApi.getPost(Number(id))
        .then((response) => {
          if (response.data.author.id !== user?.id) {
            navigate(routes.MY_POSTS);
            throw new Error("Bạn không có quyền chỉnh sửa bài viết này");
          }
          setIsEdit(true);
          reset({
            title: response.data.title,
            excerpt: response.data.excerpt,
            content: response.data.content,
            categoryId: response.data.category.id,
          });
          setThumbnailPreview(response.data.thumbnailUrl);
          return response;
        })
        .catch((error) => {
          navigate(routes.MY_POSTS);
          throw error;
        }),
    enabled:
      location.pathname.includes("/my-posts/edit") &&
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
    resolver: zodResolver(userPostSchema),
    defaultValues: {
      title: "",
      excerpt: "",
      content: "",
      categoryId: undefined,
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
      return PostApi.createMyPost(data.payload, data.thumbnail);
    },
    onSuccess: () => {
      toast.success("Tạo bài viết thành công! Bài viết đang chờ duyệt.");
      navigate(routes.MY_POSTS);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (!error.response.data.errors) {
        toast.error(error.response.data.message);
      } else {
        error.response.data.errors.forEach((fieldError) => {
          if (fieldError.fieldName === "thumbnail") {
            toast.error("Chỉ chấp nhận thumbnail là file ảnh");
          } else {
            setError(fieldError.fieldName as keyof UserPostFormValues, {
              type: "manual",
              message: fieldError.message,
            });
          }
        });
      }
    },
  });

  const updatePostMutation = useMutation({
    mutationFn: (data: { payload: PostRequest; thumbnail: File | null }) => {
      return PostApi.updateMyPost(data.payload, data.thumbnail, Number(id));
    },
    onSuccess: () => {
      toast.success("Cập nhật bài viết thành công!");
      navigate(routes.MY_POSTS);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (!error.response.data.errors) {
        toast.error(error.response.data.message);
      } else {
        error.response.data.errors.forEach((fieldError) => {
          setError(fieldError.fieldName as keyof UserPostFormValues, {
            type: "manual",
            message: fieldError.message,
          });
        });
      }
    },
  });

  const onSubmit = (data: UserPostFormValues) => {
    const payload = {
      title: data.title,
      excerpt: data.excerpt,
      content: data.content,
      categoryId: data.categoryId,
      authorId: null,
      status: "PENDING" as const,
    };

    if (!thumbnailFile && !isEdit) {
      toast.error(
        "Vui lòng chọn ảnh đại diện (thumbnail) trước khi tạo bài viết"
      );
      return;
    }

    if (!isEdit) {
      createPostMutation.mutate({ payload, thumbnail: thumbnailFile });
    } else {
      updatePostMutation.mutate({ payload, thumbnail: thumbnailFile });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="main-layout py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex flex-col">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate(routes.MY_POSTS)}
              className="mb-2 px-2 py-1 bg-[#e6f6ff] text-[#155e94] hover:bg-[#cfeefe] rounded-md self-start"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Quay lại bài viết của tôi
            </Button>
            <div>
              <h2 className="text-3xl font-bold tracking-tight">
                {isEdit ? "Chỉnh sửa bài viết" : "Tạo bài viết mới"}
              </h2>
              <p className="text-muted-foreground">
                {isEdit
                  ? "Cập nhật bài viết của bạn"
                  : "Tạo bài viết mới và chia sẻ kiến thức"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              className="bg-primary-color hover:bg-hover-primary-color disabled:cursor-not-allowed"
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
                    Ghi chú: nếu muốn dùng hashtag, hãy bắt đầu bằng dấu # (ví
                    dụ: #nguphap)
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
                  Chọn danh mục phù hợp cho bài viết của bạn.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
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
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin xuất bản</CardTitle>
                <CardDescription>
                  Thông tin về việc xuất bản bài viết.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-sm text-muted-foreground space-y-2">
                  <p>
                    <span className="font-medium">Tác giả:</span>{" "}
                    {user?.fullName}
                  </p>
                  <p>
                    <span className="font-medium">Trạng thái:</span>{" "}
                    {isEdit ? "Chờ duyệt (sau khi cập nhật)" : "Chờ duyệt"}
                  </p>
                  <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                    <p className="text-blue-800 text-sm">
                      <strong>Lưu ý:</strong> Bài viết của bạn sẽ được gửi để
                      quản trị viên duyệt trước khi xuất bản công khai.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
