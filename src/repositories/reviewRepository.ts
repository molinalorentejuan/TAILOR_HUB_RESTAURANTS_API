import { injectable } from "tsyringe";
import db from "../db/db";

export interface ReviewRow {
  id: number;
  user_id: number;
  restaurant_id: number;
  rating: number;
  comments: string | null;
  date: string | null;
  created_at: string;
}

export interface UserReviewRow extends ReviewRow {
  restaurant_name: string;
}

export interface RestaurantReviewRow extends ReviewRow {
  user_email: string;
}

@injectable()
export class ReviewRepository {

  userHasReview(userId: number, restaurantId: number): boolean {
    const row = db
      .prepare(
        `
        SELECT id
        FROM reviews
        WHERE user_id = ? AND restaurant_id = ?
      `
      )
      .get(userId, restaurantId);

    return !!row;
  }

  listReviewsByUser(userId: number): UserReviewRow[] {
    return db
      .prepare(
        `
        SELECT rv.*, r.name AS restaurant_name
        FROM reviews rv
        JOIN restaurants r ON r.id = rv.restaurant_id
        WHERE rv.user_id = ?
        ORDER BY rv.created_at DESC
      `
      )
      .all(userId) as UserReviewRow[];
  }

  findUserReview(
    reviewId: number,
    userId: number
  ): ReviewRow | undefined {
    return db
      .prepare(`
        SELECT *
        FROM reviews
        WHERE id=? AND user_id=?
      `)
      .get(reviewId, userId) as ReviewRow | undefined;
  }

  updateReview(
    reviewId: number,
    rating: number,
    comments?: string | null
  ) {
    const updates: string[] = ["rating = ?"];
    const values: any[] = [rating];

    if (comments !== undefined) {
      updates.push("comments = ?");
      values.push(comments);
    }

    values.push(reviewId);
    const sql = `UPDATE reviews SET ${updates.join(", ")} WHERE id = ?`;
    return db.prepare(sql).run(...values);
  }

  deleteReview(reviewId: number) {
    return db
      .prepare(`DELETE FROM reviews WHERE id=?`)
      .run(reviewId);
  }

  listReviewsForRestaurant(
    restaurantId: number
  ): RestaurantReviewRow[] {
    return db
      .prepare(
        `
        SELECT rv.*, u.email AS user_email
        FROM reviews rv
        JOIN users u ON u.id = rv.user_id
        WHERE rv.restaurant_id = ?
        ORDER BY rv.created_at DESC
      `
      )
      .all(restaurantId) as RestaurantReviewRow[];
  }

  insertReview(
    userId: number,
    restaurantId: number,
    rating: number,
    comments?: string
  ): "DUPLICATE" | { lastInsertRowid: number } {
    try {
      const info = db
        .prepare(
          `
          INSERT INTO reviews (user_id, restaurant_id, rating, comments)
          VALUES (?, ?, ?, ?)
          `
        )
        .run(userId, restaurantId, rating, comments ?? null);

      return { lastInsertRowid: Number(info.lastInsertRowid) };
    } catch (err: any) {
      // Duplicate review check - SQLite error code 2067
      if (err?.code === "SQLITE_CONSTRAINT_UNIQUE" || 
          err?.code === 2067 ||
          String(err?.message || err).includes("UNIQUE constraint")) {
        return "DUPLICATE";
      }
      throw err;
    }
  }

  findReviewById(reviewId: number): ReviewRow | undefined {
    return db
      .prepare(`
        SELECT *
        FROM reviews
        WHERE id = ?
      `)
      .get(reviewId) as ReviewRow | undefined;
  }

    deleteForRestaurant(restaurantId: number) {
      db.prepare(`DELETE FROM reviews WHERE restaurant_id=?`)
        .run(restaurantId);
    }

}