import { z } from "zod";

export const loginSchema = z.object({
  username: z.string().min(1, "Digite seu usuário"),
  password: z.string().min(1, "Digite sua senha"),
});

export type LoginFormData = z.infer<typeof loginSchema>;
