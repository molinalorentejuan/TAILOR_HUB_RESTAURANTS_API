import { Router } from "express";
import { authMiddleware, roleMiddleware } from "../middleware/auth";
import { container } from "../container";
import { AdminService } from "../services/adminService";
import { StatusCodes } from "http-status-codes";

const router = Router();
const adminService = container.resolve(AdminService);

/**
 * GET /admin/stats
 */
router.get(
  "/stats",
  authMiddleware,
  roleMiddleware(["ADMIN"]),
  (req, res, next) => {
    try {
      const response = adminService.getAdminStats();
      return res.status(StatusCodes.OK).json(response);
    } catch (err) {
      next(err);
    }
  }
);

export default router;