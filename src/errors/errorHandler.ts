import { Request, Response, NextFunction } from "express";
import { AppError } from "./appError";
import { t } from "../i18n";
import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import { logger } from "../logger";

export function errorHandler(
  err: any,
  req: Request,
  res: Response,
  _next: NextFunction
) {
  logger.error("Error occurred", {
    error: err instanceof Error ? err.message : String(err),
    stack: err instanceof Error ? err.stack : undefined,
    request_id: req.request_id,
    path: req.path,
    method: req.method,
  });

  if (err instanceof ZodError) {
    const issue = err.issues[0];

    const field = issue?.path?.join(".") || "unknown_field";
    const reason = issue?.message || "VALIDATION_ERROR";

    let translated;

    if (reason === "Required") {
      translated = t(req, "REQUIRED") + ` ${field}`;
    }

    else {
      translated = t(req, reason);
    }

    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "VALIDATION_ERROR",
      message: translated,
      request_id: req.request_id,
    });
  }

  if (err instanceof AppError) {
    return res.status(err.status).json({
      error: err.code,
      message: t(req, err.message),
      request_id: req.request_id,
    });
  }

  if (err instanceof SyntaxError && "body" in err) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: "INVALID_JSON",
      message: t(req, "INVALID_JSON"),
      request_id: req.request_id,
    });
  }

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    error: "INTERNAL_ERROR",
    message: t(req, "INTERNAL_ERROR"),
    request_id: req.request_id,
  });
}