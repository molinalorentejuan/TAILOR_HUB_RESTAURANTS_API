import { injectable } from "tsyringe";
import db from "../db/db";

@injectable()
export class AdminRepository {
  countUsers(): number {
    return db.prepare("SELECT COUNT(*) as c FROM users").get().c;
  }

  countReviews(): number {
    return db.prepare("SELECT COUNT(*) as c FROM reviews").get().c;
  }

  countRestaurants(): number {
    return db.prepare("SELECT COUNT(*) as c FROM restaurants").get().c;
  }

  /**
   * TOP 3 mejor valorados
   * Calculo del rating medio desde reviews
   */
  getTopRated() {
    return db
      .prepare(
        `
        SELECT
          r.id,
          r.name,
          r.cuisine_type,
          r.neighborhood,
          AVG(rv.rating) AS avg_rating
        FROM restaurants r
        LEFT JOIN reviews rv ON rv.restaurant_id = r.id
        GROUP BY r.id
        ORDER BY avg_rating DESC
        LIMIT 3
      `
      )
      .all();
  }

  /**
   * TOP 3 más reseñados
   */
  getMostReviewed() {
    return db
      .prepare(
        `
        SELECT
          r.id,
          r.name,
          r.cuisine_type,
          COUNT(rv.id) AS reviews
        FROM restaurants r
        LEFT JOIN reviews rv ON rv.restaurant_id = r.id
        GROUP BY r.id
        ORDER BY reviews DESC
        LIMIT 3
      `
      )
      .all();
  }

   getStats() {
      return {
         users_count: this.countUsers(),
         restaurants_count: this.countRestaurants(),
         reviews_count: this.countReviews(),
         top_rated: this.getTopRated(),
         most_reviewed: this.getMostReviewed(),
   };
 }

}