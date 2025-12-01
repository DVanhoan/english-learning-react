import z from "zod";

export const categorySchema = z.object({
  title: z
    .string()
    .min(3, "Tiêu đề phải có ít nhất 3 ký tự")
    .max(255, "Tiêu đề tối đa 255 ký tự"),
  description: z.string().max(2000).optional(),
});

export type CategoryFormData = z.infer<typeof categorySchema>;
