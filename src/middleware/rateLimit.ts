import rateLimit from "express-rate-limit";
import { t } from "../i18n";
import { AppError } from "../errors/appError";

export const authRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 10, // 10 peticiones por minuto
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, _res, next) => {
    next(new AppError(t(req, "TOO_MANY_REQUESTS"), 429, "RATE_LIMIT_AUTH"));
  },

  skipFailedRequests: false,
  skipSuccessfulRequests: false,
});

export const generalRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minuto
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, _res, next) => {
    next(new AppError(t(req, "TOO_MANY_REQUESTS"), 429, "RATE_LIMIT_GENERAL"));
  },

  skipFailedRequests: false,
  skipSuccessfulRequests: false,
});