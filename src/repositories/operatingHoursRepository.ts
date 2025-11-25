import { injectable } from "tsyringe";
import db from "../db/db";

@injectable()
export class OperatingHoursRepository {
  insertHours(restaurantId: number, day: string, hours: string) {
    db.prepare(
      `INSERT INTO operating_hours (restaurant_id, day, hours)
       VALUES (?, ?, ?)`
    ).run(restaurantId, day, hours);
  }

  deleteForRestaurant(restaurantId: number) {
    db.prepare(`DELETE FROM operating_hours WHERE restaurant_id=?`)
      .run(restaurantId);
  }

  listByRestaurant(restaurantId: number) {
    return db.prepare(
      `SELECT day, hours FROM operating_hours WHERE restaurant_id=?`
    ).all(restaurantId);
  }
}