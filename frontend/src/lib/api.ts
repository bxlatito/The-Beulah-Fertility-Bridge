const BASE = (import.meta.env.VITE_API_URL ?? "http://localhost:8000").replace(/\/$/, "");

export type FieldErrors = Record<string, string>;

export class ApiError extends Error {
  status: number;
  fieldErrors: FieldErrors;

  constructor(message: string, status: number, fieldErrors: FieldErrors = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
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
    throw new ApiError("Could not reach the server. Please try again.", 0);
  }
  const data = await res.json().catch(() => ({}));
  if (res.ok) return data as T;
  if (res.status === 422 && Array.isArray(data.errors)) {
    const fieldErrors: FieldErrors = {};
    for (const e of data.errors) fieldErrors[e.field] ??= e.message;
    throw new ApiError("Please check the highlighted fields.", 422, fieldErrors);
  }
  if (res.status === 429) throw new ApiError("Too many attempts. Please wait a minute.", 429);
  throw new ApiError(typeof data.detail === "string" ? data.detail : "Something went wrong.", res.status);
}