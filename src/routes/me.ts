import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import { validateBody, validateParams } from "../middleware/validate";
import { UpdateReviewDTO, ReviewParamsDTO } from "../dto/reviewDTO";
import { FavoriteParamsDTO } from "../dto/favoriteDTO";
import { invalidateCache } from "../middleware/cache";
import { container } from "../container";
import { UserService } from "../services/userService";

import { StatusCodes } from "http-status-codes";

const router = Router();
const userService = container.resolve(UserService);

/**
 * GET /me
 */
router.get("/", authMiddleware, (req: AuthRequest, res, next) => {
  try {
    const result = userService.getUserById(req.user!.id);
    return res.status(StatusCodes.OK).json(result); // DTO ALREADY BUILT BY SERVICE
  } catch (err) {
    next(err);
  }
});

/**
 * GET /me/reviews
 */
router.get("/reviews", authMiddleware, (req: AuthRequest, res, next) => {
  try {
    const result = userService.listReviewsByUser(req.user!.id);
    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    next(err);
  }
});

/**
 * PUT /me/reviews/:review_id
 */
router.put(
  "/reviews/:review_id",
  authMiddleware,
  validateParams(ReviewParamsDTO),
  validateBody(UpdateReviewDTO),
  (req: AuthRequest, res, next) => {
    try {
      const reviewId = Number(req.params.review_id);
      const { rating, comments } = req.body;

      const result = userService.updateUserReview(
        { review_id: reviewId },
        { rating, comments },
        req.user!.id
      );

      invalidateCache();
      return res.status(StatusCodes.OK).json(result);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /me/reviews/:review_id
 */
router.delete(
  "/reviews/:review_id",
  authMiddleware,
  validateParams(ReviewParamsDTO),
  (req: AuthRequest, res, next) => {
    try {
      const reviewId = Number(req.params.review_id);

      userService.deleteUserReview({ review_id: reviewId }, req.user!.id);

      invalidateCache();
      return res.status(StatusCodes.NO_CONTENT).send();
    } catch (err) {
      next(err);
    }
  }
);

/**
 * POST /me/favorites/:restaurant_id
 */
router.post(
  "/favorites/:restaurant_id",
  authMiddleware,
  validateParams(FavoriteParamsDTO),
  (req: AuthRequest, res, next) => {
    try {
      const restaurantId = Number(req.params.restaurant_id);

      const result = userService.addFavorite(req.user!.id, restaurantId);

      invalidateCache();
      return res.status(StatusCodes.CREATED).json(result);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /me/favorites/:restaurant_id
 */
router.delete(
  "/favorites/:restaurant_id",
  authMiddleware,
  validateParams(FavoriteParamsDTO),
  (req: AuthRequest, res, next) => {
    try {
      const restaurantId = Number(req.params.restaurant_id);

      userService.removeFavorite(req.user!.id, restaurantId);

      invalidateCache();
      return res.status(StatusCodes.NO_CONTENT).send();
    } catch (err) {
      next(err);
    }
  }
);

/**
 * GET /me/favorites
 */
router.get("/favorites", authMiddleware, (req: AuthRequest, res, next) => {
  try {
    const result = userService.listFavoritesByUser(req.user!.id);
    return res.status(StatusCodes.OK).json(result);
  } catch (err) {
    next(err);
  }
});

export default router;