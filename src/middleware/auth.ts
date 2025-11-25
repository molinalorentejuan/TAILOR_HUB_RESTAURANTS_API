import { NextFunction, Response, Request } from "express";
import { verifyToken } from "../utils/jwt";
import { t } from "../i18n";
import { AppError } from "../errors/appError";

export interface AuthRequest extends Request {
  user?: {
    id: number;
    role: "USER" | "ADMIN";
  };
}

export function authMiddleware(
  req: AuthRequest,
  _res: Response,
  next: NextFunction
) {
  const authHeader = req.headers["authorization"];

  if (!authHeader) {
    return next(
      new AppError(t(req, "UNAUTHORIZED"), 401, "UNAUTHORIZED")
    );
  }

  const [scheme, token] = authHeader.split(" ");

  if (scheme !== "Bearer" || !token) {
    return next(
      new AppError(t(req, "UNAUTHORIZED"), 401, "UNAUTHORIZED")
    );
  }

  try {
    const payload = verifyToken(token) as { id: number; role: "USER" | "ADMIN" };
    req.user = payload;
    return next();
  } catch {
    return next(
      new AppError(t(req, "UNAUTHORIZED"), 401, "UNAUTHORIZED")
    );
  }
}

export function roleMiddleware(roles: Array<"USER" | "ADMIN">) {
  return (req: AuthRequest, _res: Response, next: NextFunction) => {
    if (!req.user) {
      return next(
        new AppError(t(req, "UNAUTHORIZED"), 401, "UNAUTHORIZED")
      );
    }

    if (!roles.includes(req.user.role)) {
      return next(
        new AppError(t(req, "FORBIDDEN"), 403, "FORBIDDEN")
      );
    }

    return next();
  };
}