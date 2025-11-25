import { Request, Response, NextFunction } from "express";
import crypto from "crypto";

export function requestIdMiddleware(req: Request, res: Response, next: NextFunction) {
  const requestId = crypto.randomUUID();
  (req as any).request_id = requestId;
  res.locals.request_id = requestId;
  res.setHeader("X-Request-Id", requestId);

  next();
}