import "reflect-metadata";
import 'dotenv/config';
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import { generalRateLimiter } from './middleware/rateLimit';
import { requestIdMiddleware } from './middleware/requestId';
import { requestLogger } from './middleware/requestLogger';

import authRoutes from './routes/auth';
import restaurantsRoutes from './routes/restaurants';
import meRoutes from './routes/me';
import adminRoutes from './routes/admin';
import restaurantsAdminRoutes from './routes/restaurantsAdmin';

import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';

import fs from 'fs';
import path from 'path';
import db from "./db/db";

import { errorHandler } from "./errors/errorHandler";
import { logger } from "./logger";

const app = express();
app.set("trust proxy", 1);
app.use(requestIdMiddleware);
app.use(requestLogger);

// CORS configuration
const corsOptions = {
  origin: process.env.CORS_ORIGIN || (process.env.NODE_ENV === "production" ? false : "*"),
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,
};
app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));
app.use(morgan('dev'));
app.use(generalRateLimiter);

// Swagger
const spec = swaggerJsdoc({
  definition:{
    openapi:"3.0.0",
    info:{ title:"Tailor Hub Restaurants API", version:"1.0.0" }
  },
  apis: ["./swagger/swagger.yaml"]
});
app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec, {
  customCss: `
    .swagger-ui .topbar { display: none }
    .swagger-ui .models { display: none !important; }
    .swagger-ui .model-container { display: none !important; }
    .swagger-ui section.models { display: none !important; }
    .swagger-ui .model-box { display: none !important; }
  `,
  customSiteTitle: "Tailor Hub Restaurants API",
  swaggerOptions: {
    defaultModelsExpandDepth: -1,
    docExpansion: 'list',
    filter: false,
    showExtensions: false
  }
}));

// Routes
app.get('/', (_req, res) => {
  res.json({
    message: 'Tailor Hub Restaurants API',
    version: '1.0.0',
    docs: '/docs',
    health: '/health',
    endpoints: {
      auth: '/auth',
      restaurants: '/restaurants',
      me: '/me',
      admin: '/admin'
    }
  });
});

app.use('/auth', authRoutes);
app.use('/restaurants', restaurantsRoutes);
app.use('/admin/restaurants', restaurantsAdminRoutes);
app.use('/me', meRoutes);
app.use('/admin', adminRoutes);

app.get('/health', (_req,res)=>res.json({status:"ok"}));

app.use(errorHandler);

const PORT = Number(process.env.PORT) || 3000;
app.listen(PORT, "0.0.0.0", () => logger.info(`API running on port ${PORT}`));