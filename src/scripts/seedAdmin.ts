import db from "../db/db";
import bcrypt from 'bcryptjs';
import { logger } from "../logger";

function main() {
  const email = 'admin@tailor.test';

  const exists = db.prepare('SELECT id FROM users WHERE email=?').get(email);
  if (exists) {
    logger.info("Admin already exists", { email });
    return;
  }

  const password = 'Admin123';
  const hash = bcrypt.hashSync(password, 10);

  db.prepare(
    'INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)'
  ).run('Admin', email, hash, 'ADMIN');

  logger.info("Admin created", { email, password });
}

main();