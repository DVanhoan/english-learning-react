import z from "zod";

export const createUserFormSchema = z
  .object({
    fullName: z.string().min(2, "Họ tên phải có ít nhất 2 ký tự"),
    email: z
      .string()
      .min(1, "Email không được để trống")
      .regex(
        /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]{0,63}[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]{0,253}[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/,
        "Email không hợp lệ"
      ),
    phoneNumber: z
      .string()
      .regex(/^(?:\+84|0)[35789][0-9]{8}$/, "Số điện thoại không hợp lệ")
      .optional()
      .or(z.literal("")),
    address: z
      .string()
      .min(5, "Địa chỉ phải có ít nhất 5 ký tự")
      .or(z.literal("")),
    gender: z
      .enum(["MALE", "FEMALE", "OTHER"])
      .refine((value) => ["MALE", "FEMALE", "OTHER"].includes(value), {
        message: "Vui lòng chọn giới tính",
      }),
    birthDate: z
      .string()
      .min(1, "Vui lòng chọn ngày sinh")
      .refine((val) => !isNaN(Date.parse(val)), {
        message: "Ngày sinh không hợp lệ",
      })
      .refine(
        (val) => {
          const date = new Date(val);
          const now = new Date();
          return date < now;
        },
        {
          message: "Ngày sinh phải nhỏ hơn ngày hiện tại",
        }
      ),
    role: z
      .enum(["USER", "TEACHER", "ADMIN"])
      .refine((value) => ["USER", "TEACHER", "ADMIN"].includes(value), {
        message: "Vui lòng chọn vai trò",
      }),
    status: z
      .enum(["ACTIVE", "PENDING", "BANNED"])
      .refine((value) => ["ACTIVE", "PENDING", "BANNED"].includes(value), {
        message: "Vui lòng chọn trạng thái",
      }),
    password: z
      .string()
      .min(1, "Vui lòng nhập mật khẩu")
      .min(8, "Mật khẩu phải có ít nhất 8 ký tự"),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Mật khẩu xác nhận không khớp",
    path: ["confirmPassword"],
  });

export const editUserFormSchema = createUserFormSchema.omit({
  password: true,
  confirmPassword: true,
});

export const deleteConfirmSchema = z.object({
  confirmText: z.string().refine((value) => value === "OK", {
    message: 'Vui lòng nhập "OK" để xác nhận',
  }),
});

export type CreateUserFormData = z.infer<typeof createUserFormSchema>;
export type EditUserFormData = z.infer<typeof editUserFormSchema>;
export type DeleteConfirmData = z.infer<typeof deleteConfirmSchema>;
