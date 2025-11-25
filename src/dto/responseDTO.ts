import { z } from "zod";

/* -------------------------------------------- */
/* USER                                          */
/* -------------------------------------------- */
export const UserResponseDTO = z.object({
  id: z.number(),
  email: z.string().email().trim().toLowerCase(),
  role: z.enum(["USER", "ADMIN"]),
});

export const AuthResponseDTO = z.object({
  token: z.string(),
  user: UserResponseDTO,
  expires_in: z.number(), // segundos
});

/* -------------------------------------------- */
/* RESTAURANTS                                   */
/* -------------------------------------------- */
export const RestaurantDTO = z.object({
  id: z.number(),
  name: z.string(),
  neighborhood: z.string().nullable(),
  cuisine_type: z.string().nullable(),
  rating: z.number(),
  address: z.string().nullable(),
  photograph: z.string().nullable(),
  lat: z.number().nullable(),
  lng: z.number().nullable(),
  image: z.string().nullable(),
});

export const RestaurantListItemDTO = RestaurantDTO.pick({
  id: true,
  name: true,
  neighborhood: true,
  cuisine_type: true,
  rating: true,
  image: true,
});

export const RestaurantListResponseDTO = z.object({
  data: z.array(RestaurantListItemDTO),
  pagination: z.object({
    page: z.number(),
    limit: z.number(),
    total: z.number(),
  }),
});

export const OperatingHoursDTO = z.object({
  day: z.string(),
  hours: z.string(),
});

export const RestaurantDetailDTO = RestaurantDTO.extend({
  operating_hours: z.array(OperatingHoursDTO).optional(),
});

export const FavoriteRestaurantDTO = RestaurantDTO;

export const FavoriteRestaurantListDTO = z.array(FavoriteRestaurantDTO);

/* -------------------------------------------- */
/* REVIEWS                                       */
/* -------------------------------------------- */
export const ReviewBaseDTO = z.object({
  id: z.number(),
  user_id: z.number(),
  restaurant_id: z.number(),
  rating: z.number(),
  comments: z.string().nullable().optional(),
  created_at: z.string(),
});

export const UserReviewDTO = ReviewBaseDTO.extend({
  restaurant_name: z.string(),
});

export const UserReviewListDTO = z.array(UserReviewDTO);

export const RestaurantReviewDTO = ReviewBaseDTO.extend({
  user_email: z.string().email(),
});

export const RestaurantReviewListDTO = z.array(RestaurantReviewDTO);

export const ReviewIdResponseDTO = z.object({
  id: z.number(),
});

export const RestaurantIdResponseDTO = z.object({
  id: z.number(),
});

/* -------------------------------------------- */
/* FAVORITES                                     */
/* -------------------------------------------- */
export const FavoriteActionResponseDTO = z.object({
  restaurant_id: z.number(),
});

/* -------------------------------------------- */
/* ADMIN STATS                                   */
/* -------------------------------------------- */
export const TopRatedRestaurantDTO = z.object({
  id: z.number(),
  name: z.string(),
  cuisine_type: z.string().nullable(),
  neighborhood: z.string().nullable(),
  avg_rating: z.number().nullable(),
});

export const MostReviewedRestaurantDTO = z.object({
  id: z.number(),
  name: z.string(),
  cuisine_type: z.string().nullable(),
  reviews: z.number(),
});

export const AdminStatsDTO = z.object({
  users_count: z.number(),
  reviews_count: z.number(),
  restaurants_count: z.number(),
  top_rated: z.array(TopRatedRestaurantDTO),
  most_reviewed: z.array(MostReviewedRestaurantDTO),
});