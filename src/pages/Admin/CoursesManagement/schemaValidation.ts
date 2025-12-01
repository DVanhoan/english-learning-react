import z from "zod";

export const courseSchema = z
  .object({
    title: z.string().min(1, "Tiêu đề không được để trống").max(200),
    whatYouWillLearn: z
      .string()
      .min(1, "Nội dung 'bạn sẽ học được gì' không được để trống"),
    description: z.string().min(1, "Mô tả không được để trống"),
    requirements: z.string().min(1, "Yêu cầu đầu vào không được để trống"),
    status: z.enum(["PUBLIC", "HIDDEN"]),
    categoryId: z.coerce.number().int().gt(0, "Vui lòng chọn danh mục"),
    isFree: z.boolean().default(false),
    price: z.coerce.number().min(0, "Giá phải >= 0"),
    discountPrice: z
      .union([z.coerce.number().min(0, "Giá đã giảm phải >= 0"), z.null()])
      .optional(),
    teacherId: z.coerce.number().int().gt(0, "Vui lòng chọn giảng viên"),
    thumbnailFile: z.any().optional(),
    shortDescription: z.string().min(1, "Mô tả ngắn không được để trống"),
  })
  .refine(
    (data) =>
      data.isFree ||
      data.discountPrice == null ||
      (typeof data.discountPrice === "number" &&
        data.discountPrice <= data.price),
    {
      path: ["discountPrice"],
      message: "Giá đã giảm phải nhỏ hơn hoặc bằng giá gốc",
    }
  );

export type CourseFormData = z.infer<typeof courseSchema>;
