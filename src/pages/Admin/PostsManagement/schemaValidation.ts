import z from "zod";

export const postSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề không được để trống")
    .max(255, "Tiêu đề tối đa 255 ký tự"),
  excerpt: z
    .string()
    .min(1, "Tóm tắt không được để trống")
    .max(1000, "Tóm tắt tối đa 1000 ký tự"),
  content: z.string().min(1, "Nội dung không được để trống"),
  categoryId: z.preprocess(
    (val) => (typeof val === "string" && val.trim() ? Number(val) : val),
    z
      .number("Danh mục không hợp lệ")
      .refine((v) => typeof v === "number" && !isNaN(v) && v >= 1, {
        message: "Danh mục không hợp lệ",
      })
  ),
  authorId: z.preprocess(
    (val) => (typeof val === "string" && val.trim() ? Number(val) : val),
    z
      .number("Tác giả không hợp lệ")
      .refine((v) => typeof v === "number" && !isNaN(v) && v >= 1, {
        message: "Tác giả không hợp lệ",
      })
  ),
  status: z.enum(["DRAFT", "PENDING", "PUBLIC"], {
    message: "Trạng thái không hợp lệ",
  }),
});

export type PostFormValues = z.infer<typeof postSchema>;
