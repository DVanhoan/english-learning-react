import z from "zod";

export const lessonSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề không được để trống")
    .max(255, "Tiêu đề không được quá 255 ký tự"),
  description: z
    .string()
    .max(1000, "Mô tả không được quá 1000 ký tự")
    .optional()
    .transform((v) => v ?? ""),
  content: z.string().min(1, "Nội dung không được để trống"),
  isPreview: z.boolean(),
  status: z.enum(["PUBLIC", "HIDDEN"] as const),
});

export type LessonFormData = z.infer<typeof lessonSchema>;
export type DeleteConfirmData = { confirmText: string };
export const deleteConfirmSchema = z.object({
  confirmText: z.string().refine((v) => v === "OK", {
    message: 'Vui lòng nhập "OK" để xác nhận',
  }),
});
