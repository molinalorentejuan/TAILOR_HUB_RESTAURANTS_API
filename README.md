# Tailor Restaurants API

API REST en TypeScript para el challenge técnico de Tailor Hub gestionando restaurantes, reseñas y favoritos con control de acceso y despliegue listo para Railway.

## Stack y funcionalidades
- TypeScript + Express
- better-sqlite3 (sin ORM) con inyección de dependencias (tsyringe)
- Autenticación JWT y roles `USER` / `ADMIN`
- CRUD de restaurantes, reseñas y favoritos
- Filtros, paginación, orden dinámico y cache en memoria
- Rate limiting global
- Swagger UI (`/docs`)
- Tests con Jest + Supertest
- Dockerfile multistage y Procfile para Railway
- Deploy en Railways https://tailorbackendtest2-production.up.railway.app

## Puesta en marcha
```bash
npm install
npm run dev
```
Servicios disponibles:
- API: http://localhost:3000
- Documentación: http://localhost:3000/docs
- Healthcheck: http://localhost:3000/health

Para build y ejecución en modo producción:
```bash
npm run build
npm start
```

## Autenticación y roles
- Tokens firmados con `JWT_SECRET`.
- Middleware `authMiddleware` valida la firma y `roleMiddleware` restringe rutas de admin.
- Roles:
    - **USER**: CRUD de sus reseñas y gestión de favoritos.
    - **ADMIN**: CRUD de restaurantes + métricas agregadas (`/admin/stats`).

## Endpoints principales
**Públicos**
- `GET /restaurants`
- `GET /restaurants/:id`
- `GET /restaurants/:id/reviews`
- `POST /auth/login`
- `POST /auth/register`

**Usuario autenticado**
- `GET /me`
- `GET /me/reviews`
- `POST /restaurants/:id/reviews`
- `PUT /me/reviews/:id`
- `DELETE /me/reviews/:id`
- `POST /me/favorites/:restaurantId`
- `DELETE /me/favorites/:restaurantId`
- `GET /me/favorites`

**Administrador**
- `POST /restaurants`
- `PUT /restaurants/:id`
- `DELETE /restaurants/:id`
- `GET /admin/stats`


## Modelo de datos
Se reutiliza el `restaurants.db`

## Tests
```bash
npm test
```

## Docker
```bash
docker build -t tailor-restaurants-api .
docker run -p 3000:3000 tailor-restaurants-api
```
Expone la app compilada.

## Railway
https://tailorbackendtest2-production.up.railway.app

- `Procfile`:
  ```
  web: npm start
  ```
- Build command: `npm install && npm run build`
- Start command: `npm start`

## Seed de admin
```bash
npm run seed:admin
```
Crea `admin@tailor.test / Admin123`.

## Variables de entorno
Crear `.env`:
```
PORT=3000
JWT_SECRET=change_me
CORS_ORIGIN=http://localhost:3000 
```

## Estructura resumida
```
src/
 ├── container.ts           
 ├── db/
 │   ├── db.ts              # conexión SQLite
 │   └── restaurants.db     # base de datos original
 ├── dto/                   # Zod schemas
 ├── middleware/
 ├── repositories/
 ├── routes/
 ├── scripts/
 │   └── seedAdmin.ts
 ├── services/
 ├── tests/
 ├── types/
 └── utils/
swagger/
Dockerfile
Procfile
package.json
tsconfig.json
diagrams.md
README.md
```

Diagramas de la arquitectura actual y la versión escalada en [diagrams.md](diagrams.md).
