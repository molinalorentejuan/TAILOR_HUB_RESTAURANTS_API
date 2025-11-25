import { injectable } from "tsyringe";
import db from "../db/db";

export interface RestaurantRow {
  id: number;
  name: string;
  neighborhood: string | null;
  photograph: string | null;
  address: string | null;
  lat: number | null;
  lng: number | null;
  image: string | null;
  cuisine_type: string | null;
  rating: number;
}

@injectable()
export class RestaurantRepository {
  listRestaurants(
    whereSql: string,
    params: any[],
    orderSql: string,
    limit: number,
    offset: number,
    ratingFilter?: number
  ): {
    data: RestaurantRow[];
    pagination: {
      total: number;
      limit: number;
      page: number;
    };
  } {
    let finalWhereSql = whereSql?.trim() || "";
    const finalParams = [...params];

    if (ratingFilter !== undefined) {
      finalWhereSql += finalWhereSql ? " AND " : "WHERE ";
      finalWhereSql += "COALESCE(avg_ratings.avg_rating, 0) >= ?";
      finalParams.push(ratingFilter);
    }

    const avgJoin = `
      FROM restaurants r
      LEFT JOIN (
        SELECT restaurant_id, AVG(rating) AS avg_rating
        FROM reviews
        GROUP BY restaurant_id
      ) AS avg_ratings ON avg_ratings.restaurant_id = r.id
    `;

    const total = db
      .prepare(`SELECT COUNT(*) as c ${avgJoin} ${finalWhereSql}`)
      .get(...finalParams).c;

    const rows = db
      .prepare(
        `
        SELECT
          r.id,
          r.name,
          r.neighborhood,
          r.photograph,
          r.address,
          r.lat,
          r.lng,
          r.image,
          r.cuisine_type,
          COALESCE(avg_ratings.avg_rating, 0) AS rating
        ${avgJoin}
        ${finalWhereSql}
        ${orderSql}
        LIMIT ? OFFSET ?
      `
      )
      .all(...finalParams, limit, offset) as RestaurantRow[];

    return {
      data: rows,
      pagination: {
        total,
        limit,
        page: offset / limit + 1,
      },
    };
  }

  findRestaurantById(id: number): any {
    const restaurant = db
      .prepare(
        `
        SELECT
          r.*,
          COALESCE(avg_ratings.avg_rating, 0) AS rating
        FROM restaurants r
        LEFT JOIN (
          SELECT restaurant_id, AVG(rating) AS avg_rating
          FROM reviews
          GROUP BY restaurant_id
        ) AS avg_ratings ON avg_ratings.restaurant_id = r.id
        WHERE r.id = ?
      `
      )
      .get(id);

    if (!restaurant) return undefined;

    const operating_hours = db
      .prepare(`
        SELECT day, hours
        FROM operating_hours
        WHERE restaurant_id = ?
        ORDER BY id ASC
      `)
      .all(id);

    return {
      ...restaurant,
      operating_hours,
    };
  }

  restaurantExists(id: number): boolean {
    return !!db.prepare("SELECT id FROM restaurants WHERE id=?").get(id);
  }
}