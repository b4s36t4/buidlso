import { z } from "zod";

export const CreatePermission = z.object({
  name: z.string(),
  resource: z.string(),
});

export type ICreatePermission = z.infer<typeof CreatePermission>;
