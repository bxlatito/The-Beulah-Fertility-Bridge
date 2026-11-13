# Connecting the React frontend to the BFBF backend

The backend never requires changes to the frontend's layout, only the three `onSubmit` handlers.
Field names below match the table in the brief; camelCase aliases (`firstName`, `whoFor`, `supportTypes`,
`financialNeed`) are also accepted by the API.

## 1. Environment

`frontend/.env.example`
```
VITE_API_URL=http://localhost:8000
```
Copy to `frontend/.env` (production: your API URL, e.g. `https://api.your-domain.org`).

Backend `.env`: `CORS_ORIGINS=http://localhost:5173` for dev; in production
`CORS_ORIGINS=https://your-domain.org` (comma-separate several origins, no trailing slash needed).

## 2. `frontend/src/lib/api.ts`

```ts
const BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export type FieldErrors = Record<string, string>;

export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public fieldErrors: FieldErrors = {},
  ) {
    super(message);
  }
}

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  let res: Response;
  try {
    res = await fetch(`${BASE}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  } catch {
    throw new ApiError("Could not reach the server. Please check your connection and try again.", 0);
  }
  const data = await res.json().catch(() => ({}));
  if (res.ok) return data as T;

  if (res.status === 422 && Array.isArray(data.errors)) {
    const fieldErrors: FieldErrors = {};
    for (const e of data.errors) fieldErrors[e.field] ??= e.message;
    throw new ApiError("Please check the highlighted fields.", 422, fieldErrors);
  }
  if (res.status === 429) {
    throw new ApiError("Too many attempts. Please wait a minute and try again.", 429);
  }
  throw new ApiError(typeof data.detail === "string" ? data.detail : "Something went wrong.", res.status);
}

export const api = {
  contact: (b: ContactBody) => postJson<{ id: string; message: string }>("/api/contact", b),
  support: (b: SupportBody) => postJson<{ id: string; message: string }>("/api/support", b),
  donate: (b: DonateBody) =>
    postJson<{ id: string; reference: string; status: "pending"; amount: string; currency: string }>("/api/donate", b),
};

export interface ContactBody { firstname: string; lastname: string; email: string; subject: string; message: string; consent: boolean }
export interface SupportBody {
  name: string; email: string; phone?: string; who_for: string; support_types: string[];
  financial_need?: string; journey?: string; consent: boolean;
}
export interface DonateBody { amount: number; currency: "NGN" | "USD"; name?: string; email?: string; message?: string; consent: boolean }
```

## 3. Form mapping

| Form | Endpoint | Request body | On success (201) | On error |
|---|---|---|---|---|
| Contact `/contact` | `POST /api/contact` | `firstname, lastname, email, subject, message, consent` | navigate to `/thank-you` (or show inline message) | 422: show `fieldErrors`; 429: wait message; network: retry message |
| Get Support `/get-support` | `POST /api/support` | `name, email, phone?, who_for, support_types[], financial_need?, journey?, consent` | same | same |
| Donate `/donate` | `POST /api/donate` | `amount, currency, name?, email?, message?, consent` | keep `PAYMENT_READY = false` behaviour; show "intention recorded" + `reference` | same |

`journey` is limited to 1,500 characters. Keep the existing warning telling people not to share detailed medical history.

## 4. Replacing `onSubmit={(e) => e.preventDefault()}`

Shared pattern (Contact shown; Support and Donate are identical with a different `api.*` call and body):

```tsx
import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { api, ApiError, type FieldErrors } from "../lib/api";

export default function Contact() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (loading) return;
    const form = e.currentTarget;
    const data = new FormData(form);
    setLoading(true);
    setError(null);
    setFieldErrors({});
    try {
      await api.contact({
        firstname: String(data.get("firstname") ?? ""),
        lastname: String(data.get("lastname") ?? ""),
        email: String(data.get("email") ?? ""),
        subject: String(data.get("subject") ?? ""),
        message: String(data.get("message") ?? ""),
        consent: data.get("consent") === "on",
      });
      form.reset();
      navigate("/thank-you", { state: { from: "contact" } });
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
        setFieldErrors(err.fieldErrors);
      } else {
        setError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} noValidate>
      {/* existing inputs; use name="firstname", "lastname", "email", "subject", "message", "consent" */}
      {/* show fieldErrors.email etc. next to the matching input */}
      {error && <p role="alert">{error}</p>}
      <button type="submit" disabled={loading}>{loading ? "Sending…" : "Send message"}</button>
    </form>
  );
}
```

**Get Support** differences: collect checkboxes with `data.getAll("support_types").map(String)`, send `phone`,
`financial_need`, `journey` as `undefined` when blank, and `who_for` from the select.

**Donate** differences: `amount: Number(data.get("amount"))`, `currency` as `"NGN" | "USD"`.
Do not call any payment gateway while `PAYMENT_READY` is `false`; show the returned `reference` instead
(for example, "Your donation intention is recorded (ref BFBF-1A2B3C4D). No payment has been taken.").

Optional: add a `/thank-you` route/page (this is the only new frontend file besides `lib/api.ts`).

## 5. Running both together

```bash
# terminal 1: backend
cd backend && source .venv/bin/activate && alembic upgrade head && uvicorn app.main:app --reload

# terminal 2: frontend
cd frontend && npm run dev          # http://localhost:5173
```
Submit a form, then open http://localhost:8000/admin to see it. Confirmation and team emails print in the
uvicorn terminal (console backend).

## 6. Production checklist

- `VITE_API_URL` set at build time (`npm run build` bakes it in).
- Backend `CORS_ORIGINS` contains the exact site origin (scheme + host, no path).
- Serve the API over HTTPS; set `TRUST_PROXY_HEADERS=true` only behind a trusted proxy.
