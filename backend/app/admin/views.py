"""Server-rendered admin UI (Jinja2, no build step). Cookie auth + CSRF token on every POST."""
from __future__ import annotations

from datetime import date
from pathlib import Path
from typing import Any
from urllib.parse import urlencode

from fastapi import APIRouter, Depends, Form, Request
from fastapi.responses import HTMLResponse, RedirectResponse, Response
from fastapi.templating import Jinja2Templates
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.admin import set_session_cookie
from app.api.deps import extract_token, resolve_admin
from app.core.config import get_settings
from app.core.database import get_session
from app.core.rate_limit import rate_limit
from app.core.security import create_access_token, csrf_token, verify_csrf
from app.crud import admin as admin_crud
from app.crud import submissions
from app.models import STATUSES, AdminUser

router = APIRouter(prefix="/admin", include_in_schema=False)
templates = Jinja2Templates(directory=str(Path(__file__).parent / "templates"))
PAGE_SIZE = 20


def _to_date(value: str | None) -> date | None:
    try:
        return date.fromisoformat(value) if value else None
    except ValueError:
        return None


def _redirect(url: str) -> RedirectResponse:
    return RedirectResponse(url, status_code=303)


async def _auth(request: Request, session: AsyncSession) -> tuple[AdminUser, str] | None:
    token = extract_token(request)
    user = await resolve_admin(session, token)
    return (user, token) if user and token else None


def _render(request: Request, name: str, context: dict[str, Any], status_code: int = 200) -> HTMLResponse:
    return templates.TemplateResponse(request, name, context, status_code=status_code)


@router.get("/login", response_class=HTMLResponse)
async def login_page(request: Request) -> HTMLResponse:
    return _render(request, "login.html", {"error": None})


@router.post(
    "/login", response_class=HTMLResponse,
    dependencies=[Depends(rate_limit("login", "login_rate_limit_per_minute"))],
)
async def login_submit(
    request: Request, email: str = Form(...), password: str = Form(...),
    session: AsyncSession = Depends(get_session),
) -> Response:
    user = await admin_crud.authenticate(session, email.strip(), password)
    if user is None:
        return _render(request, "login.html", {"error": "Incorrect email or password."}, 401)
    response = _redirect("/admin")
    set_session_cookie(response, create_access_token(user.email))
    return response


@router.post("/logout")
async def logout(
    request: Request, csrf: str = Form(""), session: AsyncSession = Depends(get_session)
) -> Response:
    auth = await _auth(request, session)
    response = _redirect("/admin/login")
    if auth and verify_csrf(auth[1], csrf):
        response.delete_cookie(get_settings().admin_cookie_name, path="/")
    return response


@router.get("", response_class=HTMLResponse)
async def dashboard(
    request: Request, session: AsyncSession = Depends(get_session),
    type: str = "", status: str = "", q: str = "", date_from: str = "", date_to: str = "",
    page: int = 1,
) -> Response:
    auth = await _auth(request, session)
    if not auth:
        return _redirect("/admin/login")
    user, token = auth
    page = max(page, 1)
    kind = type if type in submissions.KINDS else None
    st = status if status in STATUSES else None
    q = q.strip()[:100]
    rows, total = await submissions.list_submissions(
        session, kind=kind, status=st, q=q or None,
        date_from=_to_date(date_from), date_to=_to_date(date_to),
        page=page, page_size=PAGE_SIZE,
    )
    filters = {"type": kind or "", "status": st or "", "q": q,
               "date_from": date_from, "date_to": date_to}
    active = {k: v for k, v in filters.items() if v}
    pages = max(1, -(-total // PAGE_SIZE))
    return _render(request, "list.html", {
        "user": user, "csrf": csrf_token(token), "items": [submissions.to_summary(k, o) for k, o in rows],
        "total": total, "page": page, "pages": pages, "filters": filters,
        "stats": await submissions.stats(session), "statuses": STATUSES,
        "kinds": list(submissions.KINDS), "base_qs": urlencode(active),
        "export_url": "/api/admin/export?" + urlencode(
            {("type" if k == "type" else k): v for k, v in active.items()}),
    })


@router.get("/s/{ref}", response_class=HTMLResponse)
async def detail(
    ref: str, request: Request, msg: str = "", session: AsyncSession = Depends(get_session)
) -> Response:
    auth = await _auth(request, session)
    if not auth:
        return _redirect("/admin/login")
    found = await submissions.get(session, ref)
    if not found:
        return _render(request, "detail.html", {"user": auth[0], "csrf": csrf_token(auth[1]),
                                                 "item": None, "statuses": STATUSES, "msg": ""}, 404)
    kind, obj = found
    return _render(request, "detail.html", {
        "user": auth[0], "csrf": csrf_token(auth[1]), "item": submissions.to_detail(kind, obj),
        "statuses": STATUSES, "msg": msg[:80],
    })


@router.post("/s/{ref}/status")
async def change_status(
    ref: str, request: Request, status: str = Form(...), note: str = Form(""),
    csrf: str = Form(""), session: AsyncSession = Depends(get_session),
) -> Response:
    auth = await _auth(request, session)
    if not auth:
        return _redirect("/admin/login")
    if not verify_csrf(auth[1], csrf) or status not in STATUSES:
        return Response("Invalid request.", status_code=400)
    found = await submissions.get(session, ref)
    if not found:
        return _redirect("/admin")
    await submissions.update_status(session, found[1], status, note[:2000])
    return _redirect(f"/admin/s/{ref}?msg=Saved")


@router.post("/s/{ref}/delete")
async def delete_submission(
    ref: str, request: Request, csrf: str = Form(""), session: AsyncSession = Depends(get_session)
) -> Response:
    auth = await _auth(request, session)
    if not auth:
        return _redirect("/admin/login")
    if not verify_csrf(auth[1], csrf):
        return Response("Invalid request.", status_code=400)
    found = await submissions.get(session, ref)
    if found:
        await submissions.delete(session, found[1])
    return _redirect("/admin?msg=Deleted")
