import { injectable, inject } from "tsyringe";
import { RestaurantRepository } from "../repositories/restaurantRepository";
import { ReviewRepository } from "../repositories/reviewRepository";
import { AppError } from "../errors/appError";

import { RestaurantsQueryInput } from "../dto/restaurantDTO";
import { CreateReviewServiceInput } from "../types/types";

import {
  RestaurantListItemDTO,
  RestaurantDetailDTO,
  RestaurantReviewListDTO,
  ReviewIdResponseDTO,
} from "../dto/responseDTO";

@injectable()
export class RestaurantService {
  constructor(
    @inject(RestaurantRepository)
    private restaurantRepo: RestaurantRepository,

    @inject(ReviewRepository)
    private reviewRepo: ReviewRepository
  ) {}

  listRestaurants(query: RestaurantsQueryInput) {
    const { page, limit, cuisine_type, rating, neighborhood, sort } = query;

    const where: string[] = [];
    const params: any[] = [];

    if (cuisine_type) {
      where.push("cuisine_type = ?");
      params.push(cuisine_type);
    }

    if (neighborhood) {
      where.push("neighborhood = ?");
      params.push(neighborhood);
    }

    const ratingFilter = rating;
    const whereSql = where.length ? `WHERE ${where.join(" AND ")}` : "";

    let orderSql = "";
    if (sort) {
      const [field, dir] = sort.split(":");
      const safeField = ["name", "rating", "cuisine_type", "neighborhood"].includes(field)
        ? field
        : "name";

      orderSql = `ORDER BY ${safeField} ${dir === "desc" ? "DESC" : "ASC"}`;
    }

    const offset = (page - 1) * limit;

    const rows = this.restaurantRepo.listRestaurants(
      whereSql,
      params,
      orderSql,
      limit,
      offset,
      ratingFilter
    );

    return {
      data: RestaurantListItemDTO.array().parse(rows.data),
      pagination: rows.pagination,
    };
  }

  getRestaurantById(id: number) {
    const restaurant = this.restaurantRepo.findRestaurantById(id);
    if (!restaurant) {
      throw new AppError("Restaurant not found", 404, "RESTAURANT_NOT_FOUND");
    }
    return RestaurantDetailDTO.parse(restaurant);
  }

  listReviewsForRestaurant(id: number) {
    if (!this.restaurantRepo.restaurantExists(id)) {
      throw new AppError("Restaurant not found", 404, "RESTAURANT_NOT_FOUND");
    }
    const reviews = this.reviewRepo.listReviewsForRestaurant(id);
    return RestaurantReviewListDTO.parse(reviews);
  }

  createReviewForRestaurant(input: CreateReviewServiceInput) {
    const { user_id, restaurant_id, rating, comments } = input;
    if (!this.restaurantRepo.restaurantExists(restaurant_id)) {
          throw new AppError("Restaurant not found", 404, "RESTAURANT_NOT_FOUND");
    }
    if (this.reviewRepo.userHasReview(user_id, restaurant_id)) {
      throw new AppError("You already reviewed this restaurant", 409, "ALREADY_REVIEWED");
    }
    const result = this.reviewRepo.insertReview(
      user_id,
      restaurant_id,
      rating,
      comments
    );

    if (result === "DUPLICATE") {
          throw new AppError("You already reviewed this restaurant", 409, "ALREADY_REVIEWED");
    }

    return ReviewIdResponseDTO.parse({
      id: Number(result.lastInsertRowid),
    });
  }
}