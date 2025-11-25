import { z } from "zod";

export const FavoriteParamsDTO = z.object({
  restaurant_id: z.coerce.number()
    .int()
    .positive({ message: "INVALID_RESTAURANT_ID" }),
});

/* TYPES */
export type FavoriteParamsInput = z.infer<typeof FavoriteParamsDTO>;