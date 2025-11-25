import { injectable } from "tsyringe";
import db from "../db/db";

export interface UserBasic {
  id: number;
  email: string;
  role: "USER" | "ADMIN";
}

@injectable()
export class UserRepository {
  findUserById(id: number): UserBasic | undefined {
    return db
      .prepare(`
        SELECT id, email, role
        FROM users
        WHERE id = ?
      `)
      .get(id) as UserBasic | undefined;
  }
}