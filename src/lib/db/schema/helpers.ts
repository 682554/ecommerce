import { z } from "zod";

export const dimensionsSchema = z.object({
  length: z.number().nonnegative(),
  width: z.number().nonnegative(),
  height: z.number().nonnegative(),
});

export type Dimensions = z.infer<typeof dimensionsSchema>;

export const slugSchema = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/);

export const hexColorSchema = z
  .string()
  .trim()
  .regex(/^#(?:[0-9A-Fa-f]{3}|[0-9A-Fa-f]{6})$/);

export const moneyStringSchema = z
  .string()
  .regex(/^\d+(\.\d{1,2})?$/);
