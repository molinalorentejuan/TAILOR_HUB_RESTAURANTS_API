import { z } from "zod";

export const RestaurantsQueryDTO = z.object({
  page: z
    .coerce.number()
    .int()
    .min(1, { message: "INVALID_PAGE" })
    .default(1),

  limit: z
    .coerce.number()
    .int()
    .min(1, { message: "INVALID_LIMIT" })
    .max(100, { message: "INVALID_LIMIT" })
    .default(10),

  cuisine_type: z.string().trim().max(100, { message: "CUISINE_TYPE_TOO_LONG" }).optional().nullable(),

  neighborhood: z.string().trim().max(100, { message: "NEIGHBORHOOD_TOO_LONG" }).optional().nullable(),

  rating: z.coerce
    .number()
    .min(0, { message: "RATING_MIN" })
    .max(5, { message: "RATING_MAX" })
    .optional(),

  sort: z
    .string()
    .regex(/^[a-z_]+:(asc|desc)$/i, { message: "INVALID_SORT" })
    .optional(),
});

export const CreateRestaurantDTO = z.object({
  name: z.string({ message: "NAME_REQUIRED" }).min(1, { message: "NAME_REQUIRED" }).max(200, { message: "NAME_TOO_LONG" }).trim(),

  neighborhood: z.string().trim().max(100, { message: "NEIGHBORHOOD_TOO_LONG" }).optional().nullable(),
  cuisine_type: z.string().trim().max(100, { message: "CUISINE_TYPE_TOO_LONG" }).optional().nullable(),
  address: z.string().trim().max(500, { message: "ADDRESS_TOO_LONG" }).optional().nullable(),
  photograph: z.string().trim().max(1000, { message: "PHOTOGRAPH_TOO_LONG" }).optional().nullable(),
  image: z.string().trim().max(1000, { message: "IMAGE_TOO_LONG" }).optional().nullable(),

  lat: z.number({ message: "INVALID_LAT" }).min(-90, { message: "INVALID_LAT" }).max(90, { message: "INVALID_LAT" }).optional(),
  lng: z.number({ message: "INVALID_LNG" }).min(-180, { message: "INVALID_LNG" }).max(180, { message: "INVALID_LNG" }).optional(),

  hours: z
    .array(
      z.object({
        day: z.string({ message: "INVALID_DAY" }).trim().max(20, { message: "INVALID_DAY" }),
        hours: z.string({ message: "INVALID_HOURS" }).trim().max(100, { message: "INVALID_HOURS" }),
      })
    )
    .optional(),
});

export const UpdateRestaurantDTO = CreateRestaurantDTO.partial();

export const RestaurantParamsDTO = z.object({
  restaurant_id: z
    .coerce.number()
    .int()
    .positive({ message: "INVALID_RESTAURANT_ID" }),
});

/* TYPES */
export type RestaurantsQueryInput = z.infer<typeof RestaurantsQueryDTO>;
export type CreateRestaurantInput = z.infer<typeof CreateRestaurantDTO>;
export type UpdateRestaurantInput = z.infer<typeof UpdateRestaurantDTO>;
export type RestaurantParamsInput = z.infer<typeof RestaurantParamsDTO>;