import { injectable, inject } from "tsyringe";
import { UserRepository } from "../repositories/userRepository";
import { ReviewRepository } from "../repositories/reviewRepository";
import { FavoriteRepository } from "../repositories/favoriteRepository";
import { RestaurantRepository } from "../repositories/restaurantRepository";
import { AppError } from "../errors/appError";

import {
  ReviewIdResponseDTO,
  FavoriteActionResponseDTO,
  UserResponseDTO,
  UserReviewListDTO,
  FavoriteRestaurantListDTO
} from "../dto/responseDTO";

import { UpdateReviewInput, ReviewParamsInput } from "../dto/reviewDTO";

@injectable()
export class UserService {
  constructor(
    @inject(UserRepository)
    private userRepo: UserRepository,

    @inject(ReviewRepository)
    private reviewRepo: ReviewRepository,

    @inject(FavoriteRepository)
    private favoriteRepo: FavoriteRepository,

    @inject(RestaurantRepository)
    private restaurantRepo: RestaurantRepository
  ) {}

  getUserById(id: number) {
    const user = this.userRepo.findUserById(id);
    if (!user) {
      throw new AppError("USER_NOT_FOUND", 404, "USER_NOT_FOUND");
    }

    return UserResponseDTO.parse(user);
  }

  listReviewsByUser(userId: number) {
    const reviews = this.reviewRepo.listReviewsByUser(userId);

    return UserReviewListDTO.parse(reviews);
  }

  updateUserReview(
    params: ReviewParamsInput,
    data: UpdateReviewInput,
    userId: number
  ) {
    const review = this.reviewRepo.findUserReview(params.review_id, userId);

    if (!review) {
      throw new AppError("REVIEW_NOT_FOUND", 404, "REVIEW_NOT_FOUND");
    }

    this.reviewRepo.updateReview(
      params.review_id,
      data.rating,
      data.comments
    );

    return ReviewIdResponseDTO.parse({ id: params.review_id });
  }

  deleteUserReview(params: ReviewParamsInput, userId: number) {
    const review = this.reviewRepo.findUserReview(params.review_id, userId);

    if (!review) {
      throw new AppError("REVIEW_NOT_FOUND", 404, "REVIEW_NOT_FOUND");
    }

    this.reviewRepo.deleteReview(params.review_id);

    return ReviewIdResponseDTO.parse({ id: params.review_id });
  }

  addFavorite(userId: number, restaurantId: number) {
    const restaurant = this.restaurantRepo.findRestaurantById(restaurantId);

    if (!restaurant) {
      throw new AppError("RESTAURANT_NOT_FOUND", 404, "RESTAURANT_NOT_FOUND");
    }

    if (this.favoriteRepo.favoriteExists(userId, restaurantId)) {
      throw new AppError("ALREADY_FAVORITE", 409, "ALREADY_FAVORITE");
    }

    const result = this.favoriteRepo.insertFavorite(userId, restaurantId);

    if (result === "DUPLICATE") {
      throw new AppError("ALREADY_FAVORITE", 409, "ALREADY_FAVORITE");
    }

    return FavoriteActionResponseDTO.parse({
      restaurant_id: restaurantId,
    });
  }

  removeFavorite(userId: number, restaurantId: number) {
    this.favoriteRepo.deleteFavorite(userId, restaurantId);

    return FavoriteActionResponseDTO.parse({
      restaurant_id: restaurantId,
    });
  }

  listFavoritesByUser(userId: number) {
    const favs = this.favoriteRepo.listFavoritesByUser(userId);

    return FavoriteRestaurantListDTO.parse(favs);
  }
}