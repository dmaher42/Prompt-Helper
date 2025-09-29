# PromptHelper

PromptHelper is a collaborative prompt management platform that helps marketing teams curate reusable AI prompt templates, categorize them for fast discovery, and keep track of what works. The app ships with a secure backend, modern React frontend, automated tests, and CI for production readiness.

## Prerequisites
- Node.js 20+
- npm 9+
- Docker & Docker Compose (for the full dev environment)

## Getting Started

### 1. Clone & Install
```bash
npm install
```

### 2. Environment Variables
Copy `.env.example` to `.env` and adjust as needed.

### 3. Development
Start everything (frontend, backend, and database) with:
```bash
npm run dev
```
The backend will be available at http://localhost:4000 and the frontend at http://localhost:5173.

### 4. Running Tests
```bash
npm test
```
This runs both backend and frontend test suites.

### 5. Linting
```bash
npm run lint
```

## Environment Variables
| Name | Description | Default |
| ---- | ----------- | ------- |
| `PORT` | Backend HTTP port | `4000` |
| `CLIENT_ORIGIN` | Allowed frontend origin for CORS | `http://localhost:5173` |
| `DATABASE_URL` | Prisma database connection string | `file:./dev.db` |
| `JWT_SECRET` | Secret for signing authentication tokens | _required_ |
| `SESSION_COOKIE_NAME` | Name of the auth cookie | `prompt_helper_token` |
| `SESSION_COOKIE_SECURE` | If `true`, only send cookie via HTTPS | `false` |
| `DATABASE_PROVIDER` | Prisma provider (`sqlite` or `postgresql`) | `sqlite` |
| `VITE_API_BASE_URL` | Frontend API base URL | `http://localhost:4000` |

## Deployment Notes
- Configure a Postgres database and set `DATABASE_PROVIDER=postgresql` with the appropriate `DATABASE_URL` before deploying.
- Run `infra/scripts/migrate.sh` during deployment to apply migrations and seed baseline data.
- For production HTTPS, set `SESSION_COOKIE_SECURE=true` and serve the frontend behind a CDN or reverse proxy.
- CI (GitHub Actions) automatically installs dependencies, lints, and runs tests for both frontend and backend.

## Trade-offs & Assumptions
- Authentication uses stateless JWT cookies; role management is deferred for a future iteration.
- SQLite is used locally for simplicity while remaining compatible with Postgres in production.
