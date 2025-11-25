import { injectable, inject } from "tsyringe";
import { AdminRepository } from "../repositories/adminRepository";
import { AppError } from "../errors/appError";
import { AdminStatsDTO } from "../dto/responseDTO";

@injectable()
export class AdminService {
  constructor(
    @inject(AdminRepository)
    private adminRepo: AdminRepository
  ) {}

  getAdminStats() {
    try {
      const stats = {
        users_count: this.adminRepo.countUsers(),
        reviews_count: this.adminRepo.countReviews(),
        restaurants_count: this.adminRepo.countRestaurants(),
        top_rated: this.adminRepo.getTopRated(),
        most_reviewed: this.adminRepo.getMostReviewed(),
      };

      return AdminStatsDTO.parse(stats);

    } catch (err: any) {
      throw new AppError("Failed to load admin stats", 500, "ADMIN_STATS_ERROR");
    }
  }
}