# Arquitectura de la Aplicación - Tailor Restaurants API

## Diagrama 1: Arquitectura Actual

```mermaid
flowchart LR

subgraph CLIENT[Capa Cliente]
    WEB[Web]
    MOBILE[Móvil]
    API_CLIENT[Cliente API]
end

subgraph API[API Express]
    EXPRESS[Aplicación Express]

    subgraph MIDDLEWARE[Middleware]
        REQ_ID[ID de Petición]
        LOGGER[Logger]
        CORS[CORS]
        RATE_LIMIT[Límite de Peticiones]
        CACHE[Caché]
        AUTH_MW[Autenticación]
        ROLE_MW[Comprobación de Rol]
        VALIDATE[Validación]
        ERR_HANDLER[Manejador de Errores]
    end
end

subgraph ROUTES[Rutas]
    AUTH_R[Auth]
    REST_R[Restaurantes]
    ME_R[Mi Usuario]
    ADMIN_R[Admin]
    REST_ADMIN_R[Admin Restaurantes]
end

subgraph SERVICES[Servicios]
    AUTH_S[AuthService]
    REST_S[RestaurantService]
    USER_S[UserService]
    ADMIN_S[AdminService]
    ADMIN_REST_S[RestaurantAdminService]
end

subgraph REPOS[Repositorios]
    AUTH_REPO[AuthRepo]
    REST_REPO[RestaurantRepo]
    REV_REPO[ReviewRepo]
    FAV_REPO[FavoriteRepo]
    USER_REPO[UserRepo]
    ADM_REPO[AdminRepo]
    HOURS_REPO[HoursRepo]
end

subgraph DATA[Base de Datos]
    SQLITE[(SQLite DB)]
    INDEXES[Índices]
end

subgraph INFRA[Infraestructura]
    DI[Contenedor DI]
    I18N[i18n]
end

WEB --> EXPRESS
MOBILE --> EXPRESS
API_CLIENT --> EXPRESS

EXPRESS --> REQ_ID --> LOGGER --> CORS --> RATE_LIMIT --> CACHE --> AUTH_MW --> ROLE_MW --> VALIDATE --> ERR_HANDLER

ERR_HANDLER --> AUTH_R
ERR_HANDLER --> REST_R
ERR_HANDLER --> ME_R
ERR_HANDLER --> ADMIN_R
ERR_HANDLER --> REST_ADMIN_R

AUTH_R --> AUTH_S
REST_R --> REST_S
ME_R --> USER_S
ADMIN_R --> ADMIN_S
REST_ADMIN_R --> ADMIN_REST_S

AUTH_S --> AUTH_REPO
REST_S --> REST_REPO
REST_S --> REV_REPO
USER_S --> USER_REPO
USER_S --> FAV_REPO
USER_S --> REV_REPO
ADMIN_S --> ADM_REPO
ADMIN_REST_S --> HOURS_REPO

AUTH_REPO --> SQLITE
REST_REPO --> SQLITE
REV_REPO --> SQLITE
FAV_REPO --> SQLITE
USER_REPO --> SQLITE
ADM_REPO --> SQLITE
HOURS_REPO --> SQLITE

SQLITE --> INDEXES

DI -.-> AUTH_S
DI -.-> REST_S
DI -.-> USER_S
DI -.-> ADMIN_S
DI -.-> ADMIN_REST_S

I18N -.-> ERR_HANDLER
```

## Diagrama 2: Arquitectura Escalada (100k usuarios/semana)

```mermaid
graph TB

subgraph CDN_LAYER["CDN y entrada"]
    CDN[CDN Cloudflare u otra]
end

subgraph LB_LAYER["Balanceador"]
    LB[Load balancer con SSL]
end

subgraph GATEWAY["Reverse proxy"]
    NGINX[Nginx - routing y pequeño rate limit]
end

subgraph APP_LAYER["API Express escalada"]
    APP1[Instancia API 1 Docker en Railway]
    APP2[Instancia API 2 Docker en Railway]
    APP3[Instancia API N auto escalada]
end

subgraph CACHE["Caché distribuida"]
    REDIS[Redis para cache y rate limit]
end

subgraph DB_LAYER["Base de datos"]
    POSTGRES[PostgreSQL principal]
    REPLICA[Replica solo lectura]
end

subgraph STORAGE["Ficheros"]
    S3[Almacén de imágenes y estáticos]
end

subgraph OBS["Monitorización sencilla"]
    LOGS[Logs centralizados]
    METRICS[Métricas básicas]
    ALERTS[Alertas simples]
end

subgraph CICD["CI/CD"]
    GITHUB[GitHub Actions tests y build]
    DOCKER_REGISTRY[Registro Docker]
end

%% FLUJOS PRINCIPALES
CDN --> LB --> NGINX

NGINX --> APP1
NGINX --> APP2
NGINX --> APP3

APP1 --> REDIS
APP2 --> REDIS
APP3 --> REDIS

APP1 --> POSTGRES
APP2 --> POSTGRES
APP3 --> POSTGRES
POSTGRES --> REPLICA

APP1 --> S3
APP2 --> S3

APP1 --> LOGSa
APP1 --> METRICS
APP1 --> ALERTS
```

# Explicación de cada componente de la arquitectura escalada

A continuación se explica la función concreta de cada bloque del diagrama de escalado.

## CDN (Cloudflare)
CDN que entrega archivos estáticos (imágenes, CSS, JS) desde ubicaciones cercanas al usuario.  
Reduce latencia y carga en la API.

## WAF (Protección DDoS)
Firewall de aplicaciones que filtra tráfico malicioso, bloquea bots y protege contra ataques antes de que lleguen al backend.

## Load Balancer (con SSL)
Reparte el tráfico entrante entre varias instancias de la API Express.  
Además termina el SSL, descargando al backend del trabajo de cifrado/descifrado.

## Nginx (Reverse Proxy)
Proxy ligero delante de las instancias de la API que se encarga de:
- Routing limpio
- Compresión de respuestas
- Pequeño rate limit
- Mejor gestión de conexiones concurrentes

## Instancia API 1 (Docker en Railway)
Primera instancia de la API Express empaquetada con Docker y desplegada en Railway.  
Atiende parte del tráfico recibido por el load balancer.

## Instancia API 2 (Docker en Railway)
Segunda instancia idéntica que trabaja en paralelo.

## Instancia API N (Auto-escala)
Instancias adicionales que Railway/infra añade automáticamente durante picos de tráfico (auto-scaling horizontal).

## Redis (Cache y Rate Limit)
Sistema de almacenamiento en memoria compartido entre todas las instancias para:
- Cachear respuestas frecuentes
- Guardar el estado del rate limiting
- Reducir la presión sobre la base de datos

## PostgreSQL Principal
Motor relacional pensado para producción y carga concurrente. Sustituye a SQLite porque:
- Permite múltiples escrituras en paralelo sin bloquear toda la BBDD
- Ofrece replicación, backups consistentes y planes de ejecución más eficientes

## Réplica (Solo Lectura)
Copia sincronizada del PostgreSQL principal.  
Las lecturas intensivas (restaurants list, reviews, stats…) pueden ir aquí para no saturar el servidor principal.

## S3 / Almacén de imágenes
Servicio de almacenamiento donde se guardan:
- Fotografías de restaurantes
- Assets estáticos
- Backups

Evita saturar el servidor de aplicación con ficheros grandes.

## Workers (Background Jobs)
Procesos separados que consumen tareas de la cola y las ejecutan.  
Permiten que la API responda rápido sin esperar a trabajos pesados.

## Logs Centralizados
Servicio donde todas las instancias envían logs de:
- Errores
- Performance
- Peticiones

Facilita depuración cuando hay varias instancias.

## Métricas (Prometheus)
Colección de métricas básicas de salud:
- CPU
- RAM
- Latencia
- Throughput

## Alertas (Slack/Email)
Sistema de alertas que avisa automáticamente cuando:
- La API empieza a fallar
- Sube mucho la latencia
- Aumenta la tasa de errores

## GitHub Actions (CI)
Pipeline de integración continua que ejecuta:
- Tests
- Análisis estático
- Build del proyecto

## Docker Registry
Registro donde se suben las imágenes Docker generadas por la CI.  
Railway o la plataforma de despliegue toma las imágenes desde aquí para lanzar nuevas versiones de la API.