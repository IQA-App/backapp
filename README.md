# Rakamakafo CRM — Backend

Backend API for **Rakamakafo CRM**: NestJS, TypeORM, PostgreSQL. Handles auth, users, orders, partners, email, and optional Telegram integration.

---

## High-level architecture

![High-level architecture](docs/architecture-high-level.svg)

- **Browser** → **Ingress** (HTTPS, host `dev0pz.com`) → **frontapp** (/) or **backapp** (/api).
- **backapp** talks to **PostgreSQL** and (optionally) **Email** and **Telegram**.

---

## Backend (NestJS) module structure

![Backend module structure](docs/architecture-backend.svg)

- **AppModule** imports Config, TypeORM, Health, User, Email, Auth, Orders, Telegram, Partners.
- **Auth** uses **User** and **Email**. **Orders** and **Partners** use **Telegram**. All shaded modules use **TypeORM** for persistence.

---

## Prerequisites

- **Node.js** 18+ (LTS recommended)
- **npm** (or yarn/pnpm)
- **PostgreSQL** 14+ (or use Docker)
- **.env** with required variables (see below)

---

## Environment variables

Create a `.env` in the project root (see `.gitignore`; never commit real secrets). Example:

| Variable | Description |
|----------|-------------|
| `DB_HOST` | PostgreSQL host (e.g. `localhost`) |
| `DB_PORT` | PostgreSQL port (e.g. `5432`) |
| `DB_USERNAME` | DB user |
| `DB_PASSWORD` | DB password |
| `DB_NAME` | Database name |
| `JWT_SECRET` | Secret for JWT signing (use a long random string) |
| `EMAIL_TRANSPORT_USER` | SMTP user for email |
| `EMAIL_TRANSPORT_PASSWORD` | SMTP password |
| `PROJECT2_URL` | Optional; used by Orders (external project URL) |
| `TELEGRAM_TOKEN` | Optional; for Telegram bot (when TelegramModule enabled) |

---

## Install and run

```bash
# Install dependencies
npm install

# Development (watch mode)
npm run start:dev
```

API base: **http://localhost:3000/api** (e.g. `POST /api/auth/login`).

```bash
# Production build and run
npm run build
npm run start:prod
```

---

## Tests

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage
npm run test:cov

# E2E
npm run test:e2e
```

---

## API docs (Swagger)

With the app running:

- **http://localhost:3000/api/docs**

Bearer auth: use the token from `POST /api/auth/login` or `POST /api/user` in the Swagger “Authorize” box.

---

## Scripts reference

| Script | Description |
|--------|-------------|
| `npm run start` | Start once (no watch) |
| `npm run start:dev` | Start in watch mode |
| `npm run start:debug` | Start with debug (watch) |
| `npm run start:prod` | Run production build (`node dist/main.js`) |
| `npm run build` | Build for production |
| `npm run lint` | Run ESLint |
| `npm run format` | Prettier-format source |

---

## Project structure (src)

| Path | Purpose |
|------|---------|
| `main.ts` | Bootstrap, global prefix `api`, Swagger, validation pipe |
| `app.module.ts` | Root module, TypeORM and feature modules |
| `auth/` | Login, JWT, forgot/reset password, confirmation codes |
| `user/` | User CRUD, roles |
| `orders/` | Orders and addresses |
| `partners/` | Partners (optional) |
| `telegram/` | Telegram bot integration (optional) |
| `email-service/` | Email sending (e.g. reset password) |
| `health/` | Health check endpoint |
| `utils/`, `types/`, `custom-decorators/` | Shared utilities and types |

---

## Tech stack

- **NestJS** 10, **TypeScript** 5
- **TypeORM** + **PostgreSQL**
- **Passport** (local + JWT), **bcryptjs**, **class-validator** / **class-transformer**
- **Swagger** (OpenAPI) for API docs
- **Nodemailer** for email; **node-telegram-bot-api** when Telegram is enabled

---

## License

UNLICENSED — IQA Co. Private use.
