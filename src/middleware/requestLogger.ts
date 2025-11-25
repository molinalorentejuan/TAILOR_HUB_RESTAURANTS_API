import { Request, Response, NextFunction } from "express";
import { logger } from "../logger";

export function requestLogger(req: Request, _res: Response, next: NextFunction) {
  logger.info("REQUEST", {
    request_id: req.request_id,
    method: req.method,
    path: req.originalUrl,
  });
  next();
}