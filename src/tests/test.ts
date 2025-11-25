import "reflect-metadata";
import express from "express";
import request from "supertest";

import authRoutes from "../routes/auth";
import restaurantsRoutes from "../routes/restaurants";
import restaurantsAdminRoutes from "../routes/restaurantsAdmin";
import meRoutes from "../routes/me";
import adminRoutes from "../routes/admin";

import db from "../db/db";
import { signToken, verifyToken } from "../utils/jwt";
import { errorHandler } from "../errors/errorHandler";
import { AppError } from "../errors/appError";

process.env.NODE_ENV = "test";

jest.mock("../middleware/rateLimit", () => ({
  authRateLimiter: (_req: any, _res: any, next: any) => next(),
  generalRateLimiter: (_req: any, _res: any, next: any) => next(),
}));

function buildApp() {
  const app = express();
  app.use(express.json());

  app.use("/auth", authRoutes);
  app.use("/restaurants", restaurantsRoutes);
  app.use("/restaurants", restaurantsAdminRoutes);
  app.use("/me", meRoutes);
  app.use("/admin", adminRoutes);

  // health
  app.get("/health", (_req, res) => res.json({ ok: true }));

  app.use(errorHandler);
  return app;
}

const app = buildApp();

/* CREATE user/admin*/

function createUser() {
  const email = `u_${Date.now()}_${Math.random()
    .toString(16)
    .slice(2)}@test.com`;

  const r = db
    .prepare(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
    )
    .run("UserTest", email, "dummy-pass", "USER");

  const id = Number(r.lastInsertRowid);
  const token = signToken({ id, role: "USER" });

  return { id, email, token };
}

function createAdmin() {
  const email = `a_${Date.now()}_${Math.random()
    .toString(16)
    .slice(2)}@test.com`;

  const r = db
    .prepare(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)"
    )
    .run("AdminTest", email, "dummy-pass", "ADMIN");

  const id = Number(r.lastInsertRowid);
  const token = signToken({ id, role: "ADMIN" });

  return { id, email, token };
}

/* CLEAN */

beforeEach(() => {
  db.prepare("DELETE FROM reviews").run();
  db.prepare("DELETE FROM favorites").run();
  db.prepare("DELETE FROM users").run();
});

/* UNIT TESTS*/

describe("JWT – Unit", () => {
  it("signToken -> verifyToken devuelve el mismo payload", () => {
    const token = signToken({ id: 99, role: "USER" });
    const payload = verifyToken(token);

    expect(payload.id).toBe(99);
    expect(payload.role).toBe("USER");
  });

  it("verifyToken lanza TOKEN_INVALID si no es un JWT válido", () => {
    expect(() => verifyToken("xxx.yyy.zzz")).toThrow(AppError);

    try {
      verifyToken("xxx.yyy.zzz");
    } catch (e: any) {
      expect(e.code).toBe("TOKEN_INVALID");
      expect(e.status).toBe(401);
    }
  });
});

/* HEALTH */

describe("Health", () => {
  it("GET /health devuelve ok", async () => {
    const r = await request(app).get("/health");
    expect(r.status).toBe(200);
    expect(r.body.ok).toBe(true);
  });
});

/* /ME */

describe("ME", () => {
  it("retorna datos del usuario autenticado", async () => {
    const { token, email } = createUser();

    const r = await request(app)
      .get("/me")
      .set("Authorization", `Bearer ${token}`);

    expect(r.status).toBe(200);
    expect(r.body.email).toBe(email);
    expect(r.body.role).toBe("USER");
  });
});

/* RESTAURANTS */

describe("Restaurants", () => {
  it("GET /restaurants devuelve lista válida", async () => {
    const r = await request(app).get("/restaurants");
    expect(r.status).toBe(200);
    expect(Array.isArray(r.body.data)).toBe(true);
    expect(r.body.pagination).toBeDefined();
  });

  it("GET /restaurants/1 devuelve 200 o 404", async () => {
    const r = await request(app).get("/restaurants/1");
    expect([200, 404]).toContain(r.status);
  });
});

/* REVIEWS */

describe("Reviews", () => {
  it("crear + listar", async () => {
    const { token } = createUser();

    const create = await request(app)
      .post("/restaurants/1/reviews")
      .set("Authorization", `Bearer ${token}`)
      .send({ rating: 5, comments: "Buen sitio" });

    expect([201, 404]).toContain(create.status);

    const list = await request(app).get("/restaurants/1/reviews");
    expect([200, 404]).toContain(list.status);
  });
});

/* FAVORITES */

describe("Favorites", () => {
  it("añadir + listar", async () => {
    const { token } = createUser();

    const add = await request(app)
      .post("/me/favorites/1")
      .set("Authorization", `Bearer ${token}`);

    expect([201, 409, 404]).toContain(add.status);

    const list = await request(app)
      .get("/me/favorites")
      .set("Authorization", `Bearer ${token}`);

    expect(list.status).toBe(200);
    expect(Array.isArray(list.body)).toBe(true);
  });
});

/* ADMIN */

describe("Admin", () => {
  it("usuario normal → 403", async () => {
    const { token } = createUser();

    const r = await request(app)
      .get("/admin/stats")
      .set("Authorization", `Bearer ${token}`);

    expect(r.status).toBe(403);
  });

  it("admin → OK", async () => {
    const { token } = createAdmin();

    const r = await request(app)
      .get("/admin/stats")
      .set("Authorization", `Bearer ${token}`);

    expect(r.status).toBe(200);

    expect(r.body).toHaveProperty("users_count");
    expect(r.body).toHaveProperty("reviews_count");
    expect(r.body).toHaveProperty("restaurants_count");
    expect(r.body).toHaveProperty("top_rated");
    expect(r.body).toHaveProperty("most_reviewed");
  });
});