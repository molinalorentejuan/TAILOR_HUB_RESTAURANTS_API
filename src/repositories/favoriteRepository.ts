import { injectable } from "tsyringe";
import db from "../db/db";

@injectable()
export class FavoriteRepository {

  favoriteExists(userId: number, restaurantId: number): boolean {
    const row = db
      .prepare(
        `
        SELECT 1
        FROM favorites
        WHERE user_id = ? AND restaurant_id = ?
      `
      )
      .get(userId, restaurantId);

    return !!row;
  }
  insertFavorite(
    userId: number,
    restaurantId: number
  ): "OK" | "DUPLICATE" {
    if (this.favoriteExists(userId, restaurantId)) {
      return "DUPLICATE";
    }

    db.prepare(
      "INSERT INTO favorites (user_id, restaurant_id) VALUES (?, ?)"
    ).run(userId, restaurantId);

    return "OK";
  }

  deleteFavorite(userId: number, restaurantId: number) {
    return db
      .prepare("DELETE FROM favorites WHERE user_id=? AND restaurant_id=?")
      .run(userId, restaurantId);
  }

  listFavoritesByUser(userId: number) {
    return db
      .prepare(
        `
        SELECT
          r.id,
          r.name,
          r.neighborhood,
          r.cuisine_type,
          r.address,
          r.photograph,
          r.lat,
          r.lng,
          r.image,
          COALESCE(avg_ratings.avg_rating, 0) AS rating
        FROM favorites f
        JOIN restaurants r ON r.id = f.restaurant_id
        LEFT JOIN (
          SELECT restaurant_id, AVG(rating) AS avg_rating
          FROM reviews
          GROUP BY restaurant_id
        ) AS avg_ratings ON avg_ratings.restaurant_id = r.id
        WHERE f.user_id=?
      `
      )
      .all(userId);
  }

    deleteForRestaurant(restaurantId: number) {
      db.prepare(`DELETE FROM favorites WHERE restaurant_id=?`)
        .run(restaurantId);
    }

}