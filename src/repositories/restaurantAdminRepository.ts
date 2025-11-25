import { injectable } from "tsyringe";
import db from "../db/db";

@injectable()
export class RestaurantAdminRepository {
  insertRestaurant(
    name: string,
    neighborhood: string | null,
    cuisine_type: string | null,
    address: string | null,
    photograph: string | null,
    lat: number | null,
    lng: number | null,
    image: string | null
  ): number {
    const info = db
      .prepare(
        `
        INSERT INTO restaurants
          (name, neighborhood, cuisine_type, address, photograph, lat, lng, image)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
      `
      )
      .run(
        name,
        neighborhood,
        cuisine_type,
        address,
        photograph,
        lat,
        lng,
        image
      );

    return Number(info.lastInsertRowid);
  }

  updateRestaurant(
    id: number,
    name: string | null | undefined,
    neighborhood: string | null | undefined,
    cuisine_type: string | null | undefined,
    address: string | null | undefined,
    photograph: string | null | undefined,
    lat: number | null | undefined,
    lng: number | null | undefined,
    image: string | null | undefined
  ) {
    const updates: string[] = [];
    const values: any[] = [];

    if (name !== undefined) {
      updates.push("name = ?");
      values.push(name);
    }
    if (neighborhood !== undefined) {
      updates.push("neighborhood = ?");
      values.push(neighborhood);
    }
    if (cuisine_type !== undefined) {
      updates.push("cuisine_type = ?");
      values.push(cuisine_type);
    }
    if (address !== undefined) {
      updates.push("address = ?");
      values.push(address);
    }
    if (photograph !== undefined) {
      updates.push("photograph = ?");
      values.push(photograph);
    }
    if (lat !== undefined) {
      updates.push("lat = ?");
      values.push(lat);
    }
    if (lng !== undefined) {
      updates.push("lng = ?");
      values.push(lng);
    }
    if (image !== undefined) {
      updates.push("image = ?");
      values.push(image);
    }

    if (updates.length === 0) {
      return;
    }

    values.push(id);
    const sql = `UPDATE restaurants SET ${updates.join(", ")} WHERE id=?`;
    db.prepare(sql).run(...values);
  }

  deleteRestaurant(id: number) {
    db.prepare("DELETE FROM restaurants WHERE id=?").run(id);
  }
}