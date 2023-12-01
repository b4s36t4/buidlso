import { z } from "zod";

export const CreateUser = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password length is invalid"),
});

export type ICreateUser = z.infer<typeof CreateUser>;

export const User = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string(),
  roles: z.array(z.string()),
});

export type IUser = z.infer<typeof User>;

export const UpdateUser = z.object({
  roles: z.array(z.string()),
});

export type IUpdateUser = z.infer<typeof UpdateUser>;
