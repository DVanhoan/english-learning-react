import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams, Link } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { ArrowLeft, Save, Upload, Loader2 } from "lucide-react";
import SimpleRichText from "@/components/RichTextEditor/SimpleRichText";
import type { User } from "@/types/user.type";
import { CategoriesCourseApi } from "@/api/categoriesCourse.api";
import { UserApi } from "@/api/users.api";
import { CourseApi } from "@/api/course.api";
import type { CourseRequest } from "@/types/course.type";
import { toast } from "react-toastify";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useQuery, keepPreviousData, useMutation } from "@tanstack/react-query";
import { courseSchema, type CourseFormData } from "./schemaValidation";

export default function CreateCourse() {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEdit = Boolean(id);

  useEffect(() => {
    if (!isEdit) return;
    const nid = Number(id);
    if (!id || isNaN(nid) || nid < 1) {
      toast.error("Khoá học không hợp lệ");
      navigate("/admin/courses");
    }
  }, [id, isEdit, navigate]);

  const { data: categoriesRes } = useQuery({
    queryKey: ["categories_course", 1, 100000, ""],
    queryFn: () => CategoriesCourseApi.getCategories(1, 100000, ""),
    placeholderData: keepPreviousData,
  });

  const { data: teachersRes } = useQuery({
    queryKey: ["teachers"],
    queryFn: () => UserApi.getTeachers(),
    placeholderData: keepPreviousData,
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);

  const form = useForm<any>({
    resolver: zodResolver(courseSchema),
    defaultValues: {
      title: "",
      whatYouWillLearn: "",
      description: "",
      requirements: "",
      status: "PUBLIC",
      categoryId: 0,
      isFree: false,
      price: 0,
      discountPrice: null,
      teacherId: 0,
      thumbnailFile: undefined,
      shortDescription: "",
    },
  });

  useEffect(() => {
    const subscription = form.watch((values, { name }) => {
      if (
        (name === "price" || name === "discountPrice" || name === "isFree") &&
        values
      ) {
        const p = Number(values.price ?? 0);
        const d = values.discountPrice as number | undefined | null;
        if (values.isFree) {
          console.log("Setting prices to 0 because isFree is true");
          form.setValue("price", 0);
          form.setValue("discountPrice", 0);
          form.clearErrors(["price", "discountPrice"]);
          return;
        }
        if (typeof d === "number" && d > p) {
          form.setError("discountPrice", {
            type: "manual",
            message: "Giá đã giảm phải nhỏ hơn hoặc bằng giá gốc",
          });
        } else {
          form.clearErrors("discountPrice");
        }
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  const courseMutation = useMutation({
    mutationFn: async (data: CourseFormData) => {
      const payload: CourseRequest = {
        title: data.title,
        shortDescription: data.shortDescription ?? "",
        detailDescription: data.description,
        learningOutcomes: data.whatYouWillLearn,
        requirements: data.requirements ?? "",
        status: data.status,
        price: data.isFree ? 0 : Number(data.price ?? 0),
        discountPrice: data.isFree
          ? 0
          : data.discountPrice == null
          ? null
          : Number(data.discountPrice),
        categoryId: Number(data.categoryId),
        teacherId: Number(data.teacherId),
        isFree: Boolean(data.isFree),
      };

      if (isEdit) {
        return CourseApi.update(
          Number(id),
          payload,
          data.thumbnailFile ?? null
        );
      } else {
        if (!data.thumbnailFile) {
          throw new Error("Vui lòng chọn ảnh thumbnail");
        }
        return CourseApi.create(payload, data.thumbnailFile);
      }
    },
    onSuccess: () => {
      toast.success(
        isEdit ? "Cập nhật khóa học thành công" : "Tạo khóa học thành công"
      );
      navigate("/admin/courses");
    },
    onError: (e: any) => {
      toast.error(e?.response?.data?.message || e?.message || "Có lỗi xảy ra");
    },
  });

  const onSubmit = (data: CourseFormData) => {
    courseMutation.mutate(data);
  };

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setThumbnailPreview(url);
      form.setValue("thumbnailFile", file);
    }
  };

  useQuery({
    queryKey: ["course", id],
    queryFn: () =>
      CourseApi.getById(Number(id))
        .then((res) => {
          const c = res.data;
          form.reset({
            title: c.title,
            shortDescription: c.shortDescription ?? "",
            whatYouWillLearn: c.learningOutcomes ?? "",
            description: c.detailDescription ?? "",
            requirements: c.requirements ?? "",
            status: (c.status as any) ?? "PUBLIC",
            categoryId: c.category?.id ?? 0,
            isFree: Boolean(c.isFree),
            price: c.price ?? 0,
            discountPrice: c.discountPrice ?? null,
            teacherId: c.teacher?.id ?? 0,
            thumbnailFile: undefined,
          });
          if (c.thumbnailUrl) setThumbnailPreview(c.thumbnailUrl);
          return res;
        })
        .catch((error) => {
          navigate("/admin/courses");
          throw error;
        }),
    enabled: Boolean(isEdit && id && !isNaN(Number(id)) && Number(id) > 0),
  });

  return (
    <div className="space-y-6">
      <div>
        <Link to="/admin/courses">
          <Button variant="ghost" size="sm">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Quay lại quản lý khóa học
          </Button>
        </Link>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            {isEdit ? "Cập nhật khoá học" : "Tạo khoá học mới"}
          </h2>
          <p className="text-muted-foreground">
            {isEdit
              ? "Chỉnh sửa thông tin khoá học"
              : "Nhập thông tin chi tiết khoá học"}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            type="button"
            className="bg-[#155e94] hover:bg-[#0b4674] disabled:cursor-not-allowed"
            onClick={form.handleSubmit((d) => onSubmit(d as CourseFormData))}
            disabled={courseMutation.isPending}
          >
            {courseMutation.isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {isEdit ? "Đang cập nhật..." : "Đang tạo..."}
              </>
            ) : (
              <>
                <Save className="mr-2 h-4 w-4" />
                {isEdit ? "Cập nhật" : "Xuất bản"}
              </>
            )}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((d) => onSubmit(d as CourseFormData))}
          className="grid gap-6 lg:grid-cols-3"
        >
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cơ bản</CardTitle>
                <CardDescription>
                  Nhập các thông tin cơ bản của khoá học.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Tiêu đề *</FormLabel>
                      <FormControl>
                        <Input placeholder="Nhập tiêu đề khoá học" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="shortDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả ngắn</FormLabel>
                      <FormControl>
                        <Textarea
                          rows={4}
                          placeholder="Mô tả ngắn gọn"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="whatYouWillLearn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bạn sẽ học được gì *</FormLabel>
                      <FormControl>
                        <div>
                          <SimpleRichText
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Mô tả các kiến thức/kỹ năng học viên nhận được"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mô tả chi tiết *</FormLabel>
                      <FormControl>
                        <div>
                          <SimpleRichText
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="Mô tả chi tiết nội dung khoá học"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="requirements"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Yêu cầu đầu vào</FormLabel>
                      <FormControl>
                        <div>
                          <SimpleRichText
                            value={field.value || ""}
                            onChange={field.onChange}
                            placeholder="Các yêu cầu/kỹ năng cần có trước khi học"
                          />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Hình ảnh</CardTitle>
                <CardDescription>
                  Tải lên và xem trước thumbnail của khoá học.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Ảnh thumbnail</Label>
                  <div className="border-2 border-dashed rounded-lg p-6 text-center">
                    {thumbnailPreview ? (
                      <img
                        src={thumbnailPreview}
                        alt="Thumbnail"
                        className="mx-auto max-h-48 rounded"
                      />
                    ) : (
                      <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    )}
                    <div className="mt-3">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => fileInputRef.current?.click()}
                      >
                        Chọn ảnh
                      </Button>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleThumbnailChange}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      PNG, JPG tối đa 2MB (1280x720 khuyến nghị)
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Cài đặt</CardTitle>
                <CardDescription>
                  Thiết lập trạng thái, danh mục, giảng viên và giá.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trạng thái *</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn trạng thái" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="PUBLIC">CÔNG KHAI</SelectItem>
                          <SelectItem value="HIDDEN">TẠM ẨN</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Danh mục *</FormLabel>
                      <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(v) => field.onChange(Number(v))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn danh mục" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categoriesRes?.data.items.map((c) => (
                            <SelectItem key={c.id} value={c.id.toString()}>
                              {c.title}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="teacherId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giảng viên *</FormLabel>
                      <Select
                        value={field.value ? String(field.value) : ""}
                        onValueChange={(v) => field.onChange(Number(v))}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn giảng viên" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {teachersRes?.data.map((t: User) => (
                            <SelectItem key={t.id} value={t.id.toString()}>
                              {t.fullName}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="isFree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại khóa học</FormLabel>
                      <Select
                        value={field.value ? "true" : "false"}
                        onValueChange={(v) => {
                          const isFree = v === "true";
                          field.onChange(isFree);
                          if (isFree) {
                            form.setValue("price", 0);
                            form.setValue("discountPrice", 0);
                            form.clearErrors(["price", "discountPrice"]);
                          }
                        }}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Chọn loại" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="false">Trả phí</SelectItem>
                          <SelectItem value="true">Miễn phí</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá gốc (VND) *</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="1000"
                          min={0}
                          disabled={form.watch("isFree")}
                          value={field.value ?? 0}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber)
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="discountPrice"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Giá đã giảm (VND)</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          step="1000"
                          min={0}
                          disabled={form.watch("isFree")}
                          value={
                            field.value === null || field.value === undefined
                              ? ""
                              : field.value
                          }
                          onChange={(e) => {
                            const v = e.target.value;
                            if (v === "") field.onChange(null);
                            else field.onChange(e.target.valueAsNumber);
                          }}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </div>
        </form>
      </Form>
    </div>
  );
}
