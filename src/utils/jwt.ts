import "dotenv/config";
import jwt, { JsonWebTokenError, TokenExpiredError } from "jsonwebtoken";
import { AppError } from "../errors/appError";
import { logger } from "../logger";

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET || JWT_SECRET === "dev_fallback_key" || JWT_SECRET.length < 32) {
  if (process.env.NODE_ENV === "production") {
    throw new Error("JWT_SECRET must be set and at least 32 characters long in production");
  }
  logger.warn("Using insecure JWT_SECRET. Set JWT_SECRET in .env for production!", {
    environment: process.env.NODE_ENV,
  });
}

const SECRET = JWT_SECRET || "dev_fallback_key";
export const EXPIRES_IN = Number(process.env.JWT_EXPIRES_IN) || 604800;

export interface JwtPayload {
  id: number;
  role: "USER" | "ADMIN";
  iat?: number;
  exp?: number;
}

export function signToken(payload: Pick<JwtPayload, "id" | "role">): string {
  return (jwt as any).sign(payload, SECRET, {
    expiresIn: EXPIRES_IN,
  });
}

export function verifyToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, SECRET) as JwtPayload;
  } catch (err) {
    if (err instanceof TokenExpiredError) {
      throw new AppError("Token expired", 401, "TOKEN_EXPIRED");
    }
    if (err instanceof JsonWebTokenError) {
      throw new AppError("Invalid token", 401, "TOKEN_INVALID");
    }
    throw new AppError("Auth error", 401, "AUTH_ERROR");
  }
}