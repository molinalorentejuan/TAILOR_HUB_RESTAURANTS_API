import { z } from "zod";

export const CreateReviewDTO = z.object({
  rating: z.coerce.number()
    .int()
    .min(1, { message: "RATING_MIN" })
    .max(5, { message: "RATING_MAX" }),

  comments: z.string().trim().max(5000, { message: "COMMENTS_TOO_LONG" }).optional().nullable(),
});

export const UpdateReviewDTO = z.object({
  rating: z.coerce.number()
    .int()
    .min(1, { message: "RATING_MIN" })
    .max(5, { message: "RATING_MAX" }),

  comments: z.string().trim().max(5000, { message: "COMMENTS_TOO_LONG" }).optional().nullable(),
});

export const ReviewParamsDTO = z.object({
  review_id: z.coerce.number()
    .int()
    .positive({ message: "INVALID_REVIEW_ID" }),
});

/* TYPES */
export type CreateReviewInput = z.infer<typeof CreateReviewDTO>;
export type UpdateReviewInput = z.infer<typeof UpdateReviewDTO>;
export type ReviewParamsInput = z.infer<typeof ReviewParamsDTO>;