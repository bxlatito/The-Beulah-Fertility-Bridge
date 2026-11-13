"""Protected admin JSON API."""
from __future__ import annotations

import csv
import io
import json
import re
from datetime import date
from typing import Annotated

from fastapi import APIRouter, Depends, HTTPException, Path, Query, Response
from fastapi.responses import StreamingResponse
from sqlalchemy.ext.asyncio import AsyncSession

from app.api.deps import get_current_admin
from app.core.config import get_settings
from app.core.database import get_session
from app.core.rate_limit import rate_limit
from app.core.security import create_access_token
from app.crud import admin as admin_crud
from app.crud import pages as pages_crud
from app.crud import submissions
from app.models import AdminUser
from app.schemas.admin import AdminMe, LoginIn, TokenOut
from app.schemas.page import PageIn, PageOut
from app.schemas.submission import (
    DashboardStats,
    StatusUpdate,
    SubmissionDetail,
    SubmissionPage,
)

router = APIRouter(prefix="/api/admin", tags=["admin"])
Admin = Annotated[AdminUser, Depends(get_current_admin)]

KindParam = Annotated[
    str | None, Query(alias="type", pattern="^(contact|support|donation)$", description="Submission type")
]
StatusParam = Annotated[str | None, Query(pattern="^(new|read|replied|closed|archived)$")]


def set_session_cookie(response: Response, token: str) -> None:
    s = get_settings()
    response.set_cookie(
        s.admin_cookie_name, token, max_age=s.access_token_expire_minutes * 60,
        httponly=True, secure=s.is_prod, samesite="strict", path="/",
    )


@router.post(
    "/login", response_model=TokenOut,
    dependencies=[Depends(rate_limit("login", "login_rate_limit_per_minute"))],
)
async def login(
    payload: LoginIn, response: Response, session: AsyncSession = Depends(get_session)
) -> TokenOut:
    user = await admin_crud.authenticate(session, payload.email, payload.password)
    if user is None:
        raise HTTPException(status_code=401, detail="Incorrect email or password.")
    token = create_access_token(user.email)
    set_session_cookie(response, token)
    return TokenOut(access_token=token, expires_in=get_settings().access_token_expire_minutes * 60)


@router.post("/logout", status_code=204)
async def logout(response: Response) -> None:
    response.delete_cookie(get_settings().admin_cookie_name, path="/")


@router.get("/me", response_model=AdminMe)
async def me(admin: Admin) -> AdminMe:
    return AdminMe(email=admin.email)


@router.get("/submissions", response_model=SubmissionPage)
async def list_submissions(
    _: Admin, session: AsyncSession = Depends(get_session),
    kind: KindParam = None, status: StatusParam = None,
    q: Annotated[str | None, Query(max_length=100)] = None,
    date_from: date | None = None, date_to: date | None = None,
    page: Annotated[int, Query(ge=1)] = 1,
    page_size: Annotated[int, Query(ge=1, le=100)] = 20,
) -> SubmissionPage:
    rows, total = await submissions.list_submissions(
        session, kind=kind, status=status, q=q, date_from=date_from, date_to=date_to,
        page=page, page_size=page_size,
    )
    return SubmissionPage(
        items=[submissions.to_summary(k, o) for k, o in rows],
        total=total, page=page, page_size=page_size,
    )


async def _load(session: AsyncSession, ref: str) -> tuple[str, object]:
    found = await submissions.get(session, ref)
    if found is None:
        raise HTTPException(status_code=404, detail="Submission not found.")
    return found


@router.get("/submissions/{ref}", response_model=SubmissionDetail)
async def submission_detail(
    ref: str, _: Admin, session: AsyncSession = Depends(get_session)
) -> SubmissionDetail:
    kind, obj = await _load(session, ref)
    return submissions.to_detail(kind, obj)


@router.patch("/submissions/{ref}/status", response_model=SubmissionDetail)
async def change_status(
    ref: str, payload: StatusUpdate, _: Admin, session: AsyncSession = Depends(get_session)
) -> SubmissionDetail:
    kind, obj = await _load(session, ref)
    obj = await submissions.update_status(session, obj, payload.status, payload.note)
    return submissions.to_detail(kind, obj)


@router.delete("/submissions/{ref}", status_code=204)
async def delete_submission(
    ref: str, _: Admin, session: AsyncSession = Depends(get_session)
) -> None:
    _kind, obj = await _load(session, ref)
    await submissions.delete(session, obj)


@router.get("/dashboard-stats", response_model=DashboardStats)
async def dashboard_stats(_: Admin, session: AsyncSession = Depends(get_session)) -> DashboardStats:
    return DashboardStats(**await submissions.stats(session))


EXPORT_COLUMNS = [
    "id", "type", "status", "created_at", "consent_at", "name", "email", "phone", "subject",
    "message", "who_for", "support_types", "financial_need", "journey", "amount", "currency",
    "payment_status", "reference", "admin_note",
]
_FORMULA = re.compile(r"^[=+\-@\t\r]")


def _cell(value: object) -> str:
    if value is None:
        return ""
    text = json.dumps(value) if isinstance(value, (list, dict)) else str(value)
    # Neutralise spreadsheet formula injection.
    return "'" + text if _FORMULA.match(text) else text


@router.get("/export")
async def export_csv(
    _: Admin, session: AsyncSession = Depends(get_session),
    kind: KindParam = None, status: StatusParam = None,
    q: Annotated[str | None, Query(max_length=100)] = None,
    date_from: date | None = None, date_to: date | None = None,
) -> StreamingResponse:
    rows, _total = await submissions.list_submissions(
        session, kind=kind, status=status, q=q, date_from=date_from, date_to=date_to,
        page=1, page_size=submissions.EXPORT_CAP,
    )
    buf = io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(EXPORT_COLUMNS)
    for k, obj in rows:
        d = submissions.to_detail(k, obj)
        flat = {
            "id": d.id, "type": k, "status": d.status, "created_at": d.created_at.isoformat(),
            "consent_at": d.consent_at.isoformat(), "admin_note": d.admin_note, **d.fields,
        }
        writer.writerow([_cell(flat.get(c)) for c in EXPORT_COLUMNS])
    buf.seek(0)
    return StreamingResponse(
        iter([buf.getvalue()]), media_type="text/csv",
        headers={"Content-Disposition": 'attachment; filename="bfbf-submissions.csv"'},
    )


@router.put("/pages/{slug}", response_model=PageOut)
async def upsert_page(
    slug: Annotated[str, Path(pattern=r"^[a-z0-9-]{1,80}$")], payload: PageIn, _: Admin,
    session: AsyncSession = Depends(get_session),
) -> PageOut:
    page = await pages_crud.upsert_page(session, slug, payload)
    return PageOut(slug=page.slug, title=page.title, body=page.body, updated_at=page.updated_at)
