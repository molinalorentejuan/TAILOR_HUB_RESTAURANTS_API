import Database from "better-sqlite3";
import path from "path";

const isProd = process.env.NODE_ENV === "production";

const dbPath = isProd
  ? "/app/data/restaurants.db"
  : path.join(process.cwd(), "src", "db", "restaurants.db");

const db = new Database(dbPath);

db.pragma("foreign_keys = ON");

export default db;