import { container } from "tsyringe";

/* REPOSITORIES */
import { AdminRepository } from "./repositories/adminRepository";
import { AuthRepository } from "./repositories/authRepository";
import { FavoriteRepository } from "./repositories/favoriteRepository";
import { RestaurantAdminRepository } from "./repositories/restaurantAdminRepository";
import { RestaurantRepository } from "./repositories/restaurantRepository";
import { ReviewRepository } from "./repositories/reviewRepository";
import { UserRepository } from "./repositories/userRepository";
import { OperatingHoursRepository } from "./repositories/operatingHoursRepository";

/* SERVICES */
import { AuthService } from "./services/authService";
import { AdminService } from "./services/adminService";
import { RestaurantAdminService } from "./services/restaurantAdminService";
import { RestaurantService } from "./services/restaurantService";
import { UserService } from "./services/userService";

/* REGISTER REPOSITORIES */
container.registerSingleton(AdminRepository, AdminRepository);
container.registerSingleton(AuthRepository, AuthRepository);
container.registerSingleton(FavoriteRepository, FavoriteRepository);
container.registerSingleton(RestaurantAdminRepository, RestaurantAdminRepository);
container.registerSingleton(RestaurantRepository, RestaurantRepository);
container.registerSingleton(ReviewRepository, ReviewRepository);
container.registerSingleton(UserRepository, UserRepository);
container.registerSingleton(OperatingHoursRepository, OperatingHoursRepository);

/* REGISTER SERVICES */
container.registerSingleton(AuthService, AuthService);
container.registerSingleton(AdminService, AdminService);
container.registerSingleton(RestaurantAdminService, RestaurantAdminService);
container.registerSingleton(RestaurantService, RestaurantService);
container.registerSingleton(UserService, UserService);

export { container };