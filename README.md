# Planora — Backend

REST API for the Planora event management platform. Handles authentication,
event CRUD, invitations, participant management, SSLCommerz payments, reviews,
and admin/dashboard analytics.

---

## 🔗 Live URLs

| Resource          | URL                                          |
| ----------------- | -------------------------------------------- |
| **Backend Live**  | https://planora-backend.vercel.app           |
| **Frontend Live** | https://planora-frontend-two.vercel.app      |
| **Backend Repo**  | https://github.com/asad9340/planora-backend  |
| **Frontend Repo** | https://github.com/asad9340/planora-frontend |

---

## 🛠️ Tech Stack

| Layer       | Technologies                                        |
| ----------- | --------------------------------------------------- |
| Runtime     | Node.js + Express (TypeScript)                      |
| ORM         | Prisma (PostgreSQL)                                 |
| Auth        | Better Auth (session tokens) + JWT (access/refresh) |
| Validation  | Zod                                                 |
| File Upload | Multer + Cloudinary                                 |
| Payment     | SSLCommerz                                          |
| Email       | Nodemailer (SMTP)                                   |
| Deployment  | Vercel (serverless)                                 |

---

## ✨ Features

- **Authentication** — Register, Login, Email OTP Verification, Google OAuth,
  Refresh Token rotation, Logout
- **Role-Based Access Control** — `ADMIN` and `USER` roles with separate
  permission checks on every protected route
- **Event CRUD** — Create, read, update, delete events with status management
  (Draft → Published → Completed/Cancelled)
- **Visibility & Fee Types** — Public/Private events, Free/Paid registration
- **Invitation System** — Send, accept, decline, and cancel event invitations
  with status tracking
- **Participation Workflow** — Request to join, approve/reject, withdraw
  participation
- **Payment Integration** — SSLCommerz session init, success/fail/cancel/IPN
  callbacks
- **Review System** — Post-event ratings and reviews linked to verified
  participants
- **Profile Management** — Update name, upload avatar to Cloudinary
- **Admin Endpoints** — User management, event moderation, dashboard stats
- **Global Error Handling** — Centralised Zod + AppError handler with consistent
  JSON shape

---

## 📁 Project Structure

```
src/
├── app/
│   ├── config/        # env, cloudinary, multer config
│   ├── errorHelpers/  # AppError, Zod error formatter
│   ├── interfaces/    # Shared TypeScript interfaces
│   ├── lib/           # Prisma client, Better Auth instance
│   ├── middleware/    # checkAuth, validateRequest, globalErrorHandler, notFound
│   ├── modules/       # Feature modules: auth, user, event, participation,
│   │                  #   invitation, payment, review, admin, dashboard
│   ├── routes/        # Centralised route index
│   ├── shared/        # sendResponse, catchAsync
│   ├── templates/     # EJS email templates
│   └── utils/         # jwt, cookie, query helpers
├── prisma/
│   ├── schema/        # Split Prisma schema files
│   └── migrations/    # Prisma migration history
└── api/
    └── index.mjs      # Vercel serverless entrypoint
```

---

## ⚙️ Getting Started

### 1. Install dependencies

```bash
pnpm install
```

### 2. Create `.env`

```env
NODE_ENV=development
PORT=5000
DATABASE_URL=postgresql://...

FRONTEND_URL=http://localhost:3000
BETTER_AUTH_SECRET=...
BETTER_AUTH_URL=http://localhost:5000

ACCESS_TOKEN_SECRET=...
REFRESH_TOKEN_SECRET=...
ACCESS_TOKEN_EXPIRES_IN=1d
REFRESH_TOKEN_EXPIRES_IN=30d
BETTER_AUTH_SESSION_TOKEN_EXPIRES_IN=1d
BETTER_AUTH_SESSION_TOKEN_UPDATE_AGE=1d

# Email
EMAIL_SENDER_SMTP_USER=you@gmail.com
EMAIL_SENDER_SMTP_PASS=app_password
EMAIL_SENDER_SMTP_HOST=smtp.gmail.com
EMAIL_SENDER_SMTP_PORT=465
EMAIL_SENDER_SMTP_FROM=you@gmail.com

# Google OAuth
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...
GOOGLE_CALLBACK_URL=http://localhost:5000/api/auth/callback/google

# Cloudinary
CLOUDINARY_CLOUD_NAME=...
CLOUDINARY_API_KEY=...
CLOUDINARY_API_SECRET=...

# SSLCommerz
SSL_STORE_ID=...
SSL_STORE_PASSWORD=...
SSL_IS_LIVE=false

# OpenRouter Chatbot
OPENROUTER_API_KEY=...
OPENROUTER_API_URL=https://openrouter.ai/api/v1/chat/completions
OPENROUTER_MODEL=google/gemini-2.0-flash-lite-001
OPENROUTER_FALLBACK_MODEL=meta-llama/llama-3.1-8b-instruct:free
```

### 3. Prisma setup

```bash
pnpm migrate    # prisma migrate dev
pnpm generate   # prisma generate
```

### 4. Run development server

```bash
pnpm dev
```

API base URL: `http://localhost:5000/api/v1`

---

## 📜 Scripts

| Script          | Description                                      |
| --------------- | ------------------------------------------------ |
| `pnpm dev`      | Run development server with file watching        |
| `pnpm build`    | Prisma deploy + generate + bundle for serverless |
| `pnpm lint`     | Lint source files                                |
| `pnpm migrate`  | `prisma migrate dev`                             |
| `pnpm generate` | `prisma generate`                                |
| `pnpm studio`   | Open Prisma Studio                               |
| `pnpm push`     | `prisma db push`                                 |
| `pnpm pull`     | `prisma db pull`                                 |

---

## 🗺️ API Route Groups

| Route                             | Description                    |
| --------------------------------- | ------------------------------ |
| `POST /api/v1/auth/register`      | Register new user              |
| `POST /api/v1/auth/login`         | Login with credentials         |
| `GET  /api/v1/auth/me`            | Get authenticated user profile |
| `POST /api/v1/auth/refresh-token` | Rotate access/refresh tokens   |
| `GET  /api/v1/events`             | List/filter events             |
| `POST /api/v1/events`             | Create event                   |
| `PATCH /api/v1/events/:id`        | Update event                   |
| `DELETE /api/v1/events/:id`       | Delete event                   |
| `GET  /api/v1/participations`     | List participations            |
| `POST /api/v1/participations`     | Join/request to join event     |
| `POST /api/v1/invitations`        | Send invitation                |
| `POST /api/v1/payments/initiate`  | Initiate SSLCommerz payment    |
| `POST /api/v1/payments/success`   | Payment success callback       |
| `GET  /api/v1/reviews`            | List reviews                   |
| `POST /api/v1/reviews`            | Submit review                  |
| `GET  /api/v1/dashboard`          | Dashboard analytics            |
| `GET  /api/v1/admin/users`        | Admin: list users              |

---

## 👤 Admin Credentials (Demo)

| Field    | Value             |
| -------- | ----------------- |
| Email    | admin@planora.com |
| Password | Admin@123         |

---

## 💳 Payment Notes

- SSLCommerz is used for paid event registration.
- Set `SSL_IS_LIVE=false` for sandbox mode.
- Success, fail, cancel, and IPN callbacks are handled under
  `/api/v1/payments/`.

---

## 🚀 Deployment

This backend is configured for **Vercel serverless** deployment via
`api/index.mjs`.

- Set all production environment variables in Vercel project settings.
- Run `pnpm build` locally before deploying to ensure Prisma client is up to
  date.
- Redeploy after any environment variable changes.
