import z from "zod";

export const chapterSchema = z.object({
  title: z
    .string()
    .min(1, "Tiêu đề không được để trống")
    .max(255, "Tiêu đề không được quá 255 ký tự"),
  description: z
    .string()
    .min(1, "Mô tả không được để trống")
    .max(1000, "Mô tả không được quá 1000 ký tự"),
  status: z.enum(["PUBLIC", "HIDDEN"]).refine((val) => val, {
    message: "Vui lòng chọn trạng thái",
  }),
});

export type ChapterFormData = z.infer<typeof chapterSchema>;
export type DeleteConfirmData = { confirmText: string };
export const deleteConfirmSchema = z.object({
  confirmText: z.string().refine((v) => v === "OK", {
    message: 'Vui lòng nhập "OK" để xác nhận',
  }),
});
