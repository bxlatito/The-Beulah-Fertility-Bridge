# BFBF Backend (FastAPI)

API + admin dashboard for the Beulah Fertility Bridge Foundation website.
Education and support only: **no medical advice, and no detailed medical history is stored.**

## Run locally (SQLite, console email)

```bash
cd backend
python -m venv .venv && source .venv/bin/activate      # Windows: .venv\Scripts\activate
pip install -r requirements.txt
cp .env.example .env        # set ADMIN_EMAIL and ADMIN_PASSWORD_INIT (and SECRET_KEY if you like)
alembic upgrade head
uvicorn app.main:app --reload
```

- API docs: http://localhost:8000/docs (also `/api/docs`)
- Admin UI: http://localhost:8000/admin (log in with `ADMIN_EMAIL` / `ADMIN_PASSWORD_INIT`)
- Emails in dev are printed to the uvicorn terminal. Nothing is sent.

## Tests

```bash
pip install -r requirements-dev.txt
pytest            # includes coverage
ruff check app
```

## Endpoints

| Method | Path | Notes |
|---|---|---|
| GET | `/api/health` | `{"status":"ok"}` |
| POST | `/api/contact` | 201, rate limited |
| POST | `/api/support` | 201, rate limited |
| POST | `/api/donate` | 201, **intent only**, `status: pending` + `reference`; no payment is processed |
| GET | `/api/pages/{slug}` | published editable page content |
| POST | `/api/admin/login` · `/logout` | JWT (Bearer) and HttpOnly SameSite=Strict cookie |
| GET | `/api/admin/me` · `/dashboard-stats` | |
| GET | `/api/admin/submissions` | filters: `type`, `status`, `q`, `date_from`, `date_to`, `page`, `page_size` |
| GET / DELETE | `/api/admin/submissions/{id}` | ids look like `contact-1`, `support-2`, `donation-3` |
| PATCH | `/api/admin/submissions/{id}/status` | `{"status": "...", "note": "..."}` |
| GET | `/api/admin/export` | CSV (same filters; formula-injection safe) |
| PUT | `/api/admin/pages/{slug}` | create/update editable page content |

Statuses: `new`, `read`, `replied`, `closed`, `archived`.
Validation errors return 422 as `{"detail": "Validation failed.", "errors": [{"field", "message"}]}`.

## Production

1. Set `ENVIRONMENT=prod`, a strong `SECRET_KEY` (32+ chars), `DATABASE_URL=postgresql://...`,
   `CORS_ORIGINS=https://your-domain`, `FRONTEND_URL`, `BACKEND_URL`, `EMAIL_BACKEND=smtp` + `SMTP_*`.
2. `alembic upgrade head`, then `uvicorn app.main:app --host 0.0.0.0 --port 8000` behind HTTPS.
   In prod, cookies are `Secure` and HSTS is sent.
3. Remove `ADMIN_PASSWORD_INIT` after the first login.
4. Behind a trusted proxy set `TRUST_PROXY_HEADERS=true` so rate limiting uses the real client IP.

## Docker

```bash
cp .env.example .env     # set POSTGRES_PASSWORD, SECRET_KEY, ADMIN_EMAIL, ADMIN_PASSWORD_INIT
docker compose up --build
```
API on :8000, MailHog (captured email) on http://localhost:8025.

## Layout

```
app/main.py            app factory, CORS, security headers, validation handler
app/core/              config (env), database, security (bcrypt/JWT/CSRF), rate_limit
app/models/            SQLAlchemy 2.0 models (contact, support, donation, admin_user, page)
app/schemas/           Pydantic v2 request/response schemas + sanitisation
app/crud/              business logic (submissions, admin, pages)
app/api/               routers: health, public forms, pages, admin JSON API
app/admin/             server-rendered admin UI (Jinja2 templates, no build step)
app/email.py           console + SMTP backends, confirmation/team templates
app/tests/             pytest suite
alembic/               migrations (0001 initial schema)
```

## Design notes

- Consent is required on every form; the consent timestamp is stored server-side.
- Team notification emails contain only type + reference, never submission content.
- Rate limiting is in-memory (per process). For multiple workers/hosts, use Redis or a proxy limiter.
- Deleting a submission is a hard delete (right to erasure). Use the `archived` status to keep a record.
