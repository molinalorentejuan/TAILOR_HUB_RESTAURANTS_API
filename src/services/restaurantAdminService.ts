import { injectable, inject } from "tsyringe";
import { RestaurantAdminRepository } from "../repositories/restaurantAdminRepository";
import { RestaurantRepository } from "../repositories/restaurantRepository";
import { OperatingHoursRepository } from "../repositories/operatingHoursRepository";
import { ReviewRepository } from "../repositories/reviewRepository";
import { FavoriteRepository } from "../repositories/favoriteRepository";
import db from "../db/db";
import { AppError } from "../errors/appError";

import {
  CreateRestaurantInput,
  UpdateRestaurantInput,
} from "../dto/restaurantDTO";

import { RestaurantIdResponseDTO } from "../dto/responseDTO";

@injectable()
export class RestaurantAdminService {
  constructor(
    @inject(RestaurantAdminRepository)
    private restaurantAdminRepo: RestaurantAdminRepository,

    @inject(RestaurantRepository)
    private restaurantRepo: RestaurantRepository,

    @inject(OperatingHoursRepository)
    private hoursRepo: OperatingHoursRepository,

    @inject(ReviewRepository)
    private reviewRepo: ReviewRepository,

    @inject(FavoriteRepository)
    private favoriteRepo: FavoriteRepository
  ) {}

  createRestaurant(data: CreateRestaurantInput) {
    const {
      name,
      cuisine_type,
      neighborhood,
      address,
      photograph,
      lat,
      lng,
      image,
      hours,
    } = data;

    const tx = db.transaction(() => {
      const id = this.restaurantAdminRepo.insertRestaurant(
        name,
        neighborhood ?? null,
        cuisine_type ?? null,
        address ?? null,
        photograph ?? null,
        lat ?? null,
        lng ?? null,
        image ?? null
      );

      if (hours && hours.length > 0) {
        for (const h of hours) {
          this.hoursRepo.insertHours(id, h.day, h.hours);
        }
      }

      return id;
    });

    const id = tx();

    return RestaurantIdResponseDTO.parse({ id });
  }

  updateRestaurant(id: number, data: UpdateRestaurantInput) {
    if (!this.restaurantRepo.restaurantExists(id)) {
      throw new AppError("Restaurant not found", 404, "RESTAURANT_NOT_FOUND");
    }

    const {
      name,
      cuisine_type,
      neighborhood,
      address,
      photograph,
      lat,
      lng,
      image,
      hours,
    } = data;

    const tx = db.transaction(() => {
      this.restaurantAdminRepo.updateRestaurant(
        id,
        name, // undefined si no viene, valor si viene
        neighborhood,
        cuisine_type,
        address,
        photograph,
        lat,
        lng,
        image
      );

      this.hoursRepo.deleteForRestaurant(id);

      if (hours && hours.length > 0) {
        for (const h of hours) {
          this.hoursRepo.insertHours(id, h.day, h.hours);
        }
      }
    });

    tx();

    return RestaurantIdResponseDTO.parse({ id });
  }

  deleteRestaurant(id: number) {
    if (!this.restaurantRepo.restaurantExists(id)) {
      throw new AppError("Restaurant not found", 404, "RESTAURANT_NOT_FOUND");
    }

    const tx = db.transaction(() => {
      this.reviewRepo.deleteForRestaurant(id);
      this.favoriteRepo.deleteForRestaurant(id);
      this.hoursRepo.deleteForRestaurant(id);
      this.restaurantAdminRepo.deleteRestaurant(id);
    });

    tx();

    return RestaurantIdResponseDTO.parse({ id });
  }
}