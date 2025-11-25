import { Router } from "express";
import { authMiddleware, roleMiddleware, AuthRequest } from "../middleware/auth";
import { validateBody, validateParams } from "../middleware/validate";
import { invalidateCache } from "../middleware/cache";
import {
  CreateRestaurantDTO,
  UpdateRestaurantDTO,
  RestaurantParamsDTO,
} from "../dto/restaurantDTO";

import { container } from "../container";
import { RestaurantAdminService } from "../services/restaurantAdminService";
import { StatusCodes } from "http-status-codes";

const router = Router();
const adminService = container.resolve(RestaurantAdminService);

/**
 * POST /admin/restaurants
 */
router.post(
  "/",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateBody(CreateRestaurantDTO),
  (req: AuthRequest, res, next) => {
    try {
      const response = adminService.createRestaurant(req.body);
      invalidateCache();
      return res.status(StatusCodes.CREATED).json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * PUT /admin/restaurants/:restaurant_id
 */
router.put(
  "/:restaurant_id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateParams(RestaurantParamsDTO),
  validateBody(UpdateRestaurantDTO),
  (req: AuthRequest, res, next) => {
    try {
      const restaurantId = Number(req.params.restaurant_id);
      const response = adminService.updateRestaurant(restaurantId, req.body);
      invalidateCache();
      return res.status(StatusCodes.OK).json(response);
    } catch (err) {
      next(err);
    }
  }
);

/**
 * DELETE /admin/restaurants/:restaurant_id
 */
router.delete(
  "/:restaurant_id",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  validateParams(RestaurantParamsDTO),
  (req: AuthRequest, res, next) => {
    try {
      const restaurantId = Number(req.params.restaurant_id);
      adminService.deleteRestaurant(restaurantId);
      invalidateCache();
      return res.status(StatusCodes.NO_CONTENT).send();
    } catch (err) {
      next(err);
    }
  }
);

export default router;