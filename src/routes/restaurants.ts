import { Router } from "express";
import { cacheMiddleware, invalidateCache } from "../middleware/cache";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import {
  validateQuery,
  validateBody,
  validateParams,
} from "../middleware/validate";

import {
  RestaurantsQueryDTO,
  RestaurantParamsDTO,
} from "../dto/restaurantDTO";

import { CreateReviewDTO } from "../dto/reviewDTO";
import { container } from "../container";
import { RestaurantService } from "../services/restaurantService";
import { StatusCodes } from "http-status-codes";

const router = Router();
const restaurantService = container.resolve(RestaurantService);

/**
 * GET /restaurants
 */
router.get(
  "/",
  validateQuery(RestaurantsQueryDTO),
  cacheMiddleware,
  (req, res, next) => {
    try {
      const query = req.query as any;
      const response = restaurantService.listRestaurants(query);
      return res.status(StatusCodes.OK).json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /restaurants/:restaurant_id
 */
router.get(
  "/:restaurant_id",
  validateParams(RestaurantParamsDTO),
  cacheMiddleware,
  (req, res, next) => {
    try {
      const restaurantId = Number(req.params.restaurant_id);
      const response = restaurantService.getRestaurantById(restaurantId);
      return res.status(StatusCodes.OK).json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /restaurants/:restaurant_id/reviews
 */
router.get(
  "/:restaurant_id/reviews",
  validateParams(RestaurantParamsDTO),
  cacheMiddleware,
  (req, res, next) => {
    try {
      const restaurantId = Number(req.params.restaurant_id);
      const response = restaurantService.listReviewsForRestaurant(restaurantId);
      return res.status(StatusCodes.OK).json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /restaurants/:restaurant_id/reviews
 */
router.post(
  "/:restaurant_id/reviews",
  authMiddleware,
  validateParams(RestaurantParamsDTO),
  validateBody(CreateReviewDTO),
  (req: AuthRequest, res, next) => {
    try {
      const restaurantId = Number(req.params.restaurant_id);
      const { rating, comments } = req.body;

      const response = restaurantService.createReviewForRestaurant({
        user_id: req.user!.id,
        restaurant_id: restaurantId,
        rating,
        comments,
      });

      invalidateCache();
      return res.status(StatusCodes.CREATED).json(response);
    } catch (err) {
      next(err);
    }
  }
);

export default router;