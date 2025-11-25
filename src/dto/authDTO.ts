import { z } from "zod";

export const RegisterDTO = z.object({
  email: z
    .string()
    .email({ message: "INVALID_EMAIL" })
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(8, { message: "PASSWORD_TOO_SHORT" })
    .max(128, { message: "PASSWORD_TOO_LONG" })
    .regex(/[A-Z]/, { message: "PASSWORD_UPPERCASE_REQUIRED" })
    .regex(/[a-z]/, { message: "PASSWORD_LOWERCASE_REQUIRED" })
    .regex(/[0-9]/, { message: "PASSWORD_NUMBER_REQUIRED" })
    .trim(),

  name: z
    .string()
    .min(1, { message: "NAME_REQUIRED" })
    .max(200, { message: "NAME_TOO_LONG" })
    .trim(),
}).strict();

export const LoginDTO = z.object({
  email: z
    .string()
    .email({ message: "INVALID_EMAIL" })
    .trim()
    .toLowerCase(),

  password: z
    .string()
    .min(1, { message: "PASSWORD_REQUIRED" }),
});

/* TYPES */
export type RegisterParamsInput = z.infer<typeof RegisterDTO>;
export type LoginParamsInput = z.infer<typeof LoginDTO>;