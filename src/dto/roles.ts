import { z } from "zod";

export const UpdateRoles = z.object({
  roleId: z.string(),
});

export type IUpdateRoles = z.infer<typeof UpdateRoles>;
