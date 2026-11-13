"""Business logic for the three submission tables, presented as one unified collection.

Public references look like ``contact-12``, ``support-3`` or ``donation-7``.
"""
from __future__ import annotations

import secrets
from datetime import UTC, date, datetime, time, timedelta
from decimal import Decimal
from typing import Any

from sqlalchemy import func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import STATUSES, ContactSubmission, Donation, SupportEnquiry
from app.schemas.submission import SubmissionDetail, SubmissionSummary

KINDS: dict[str, type[Any]] = {
    "contact": ContactSubmission,
    "support": SupportEnquiry,
    "donation": Donation,
}
SEARCH_COLUMNS: dict[str, tuple[str, ...]] = {
    "contact": ("name", "email", "subject", "message"),
    "support": ("name", "email", "phone", "who_for", "journey"),
    "donation": ("name", "email", "message", "reference"),
}
_META = {"id", "status", "admin_note", "consent", "consent_at", "created_at", "updated_at"}
EXPORT_CAP = 10_000


def make_ref(kind: str, obj_id: int) -> str:
    return f"{kind}-{obj_id}"


def parse_ref(ref: str) -> tuple[str, int]:
    kind, _, raw = ref.partition("-")
    if kind not in KINDS or not raw.isdigit():
        raise ValueError(f"Invalid submission id: {ref!r}")
    return kind, int(raw)


def as_utc(dt: datetime) -> datetime:
    return dt if dt.tzinfo else dt.replace(tzinfo=UTC)


def new_donation_reference() -> str:
    return "BFBF-" + secrets.token_hex(4).upper()


async def create(session: AsyncSession, kind: str, values: dict[str, Any]) -> Any:
    obj = KINDS[kind](consent=True, **values)
    session.add(obj)
    await session.commit()
    await session.refresh(obj)
    return obj


async def get(session: AsyncSession, ref: str) -> tuple[str, Any] | None:
    try:
        kind, obj_id = parse_ref(ref)
    except ValueError:
        return None
    obj = await session.get(KINDS[kind], obj_id)
    return (kind, obj) if obj else None


def _conditions(
    model: type[Any], kind: str, status: str | None, q: str | None,
    date_from: date | None, date_to: date | None,
) -> list[Any]:
    conds: list[Any] = []
    if status:
        conds.append(model.status == status)
    if q:
        pattern = "%" + q.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_") + "%"
        conds.append(or_(*[getattr(model, c).ilike(pattern, escape="\\") for c in SEARCH_COLUMNS[kind]]))
    if date_from:
        conds.append(model.created_at >= datetime.combine(date_from, time.min, tzinfo=UTC))
    if date_to:
        conds.append(
            model.created_at < datetime.combine(date_to + timedelta(days=1), time.min, tzinfo=UTC)
        )
    return conds


async def list_submissions(
    session: AsyncSession, *, kind: str | None = None, status: str | None = None,
    q: str | None = None, date_from: date | None = None, date_to: date | None = None,
    page: int = 1, page_size: int = 20,
) -> tuple[list[tuple[str, Any]], int]:
    kinds = [kind] if kind else list(KINDS)
    offset = (page - 1) * page_size
    rows: list[tuple[str, Any]] = []
    total = 0
    for k in kinds:
        model = KINDS[k]
        conds = _conditions(model, k, status, q, date_from, date_to)
        total += (await session.execute(select(func.count()).select_from(model).where(*conds))).scalar_one()
        stmt = (
            select(model).where(*conds)
            .order_by(model.created_at.desc(), model.id.desc())
            .limit(offset + page_size)
        )
        rows += [(k, o) for o in (await session.execute(stmt)).scalars()]
    rows.sort(key=lambda r: (as_utc(r[1].created_at), r[1].id), reverse=True)
    return rows[offset: offset + page_size], total


async def update_status(session: AsyncSession, obj: Any, status: str, note: str | None) -> Any:
    assert status in STATUSES
    obj.status = status
    if note is not None:
        obj.admin_note = note.strip() or None
    await session.commit()
    await session.refresh(obj)
    return obj


async def delete(session: AsyncSession, obj: Any) -> None:
    """Hard delete (right to erasure)."""
    await session.delete(obj)
    await session.commit()


async def stats(session: AsyncSession) -> dict[str, Any]:
    matrix: dict[str, dict[str, int]] = {}
    by_status = dict.fromkeys(STATUSES, 0)
    for kind, model in KINDS.items():
        rows = (await session.execute(select(model.status, func.count()).group_by(model.status))).all()
        matrix[kind] = {s: 0 for s in STATUSES} | {s: n for s, n in rows}
        for s, n in rows:
            by_status[s] = by_status.get(s, 0) + n
    by_kind = {k: sum(v.values()) for k, v in matrix.items()}
    return {
        "total": sum(by_kind.values()),
        "new": by_status.get("new", 0),
        "by_kind": by_kind,
        "by_status": by_status,
        "matrix": matrix,
    }


# ----- presentation helpers -----

def _fmt_amount(obj: Donation) -> str:
    return f"{Decimal(obj.amount):,.2f} {obj.currency}"


def preview(kind: str, obj: Any) -> str:
    if kind == "contact":
        return str(obj.subject)
    if kind == "support":
        types = ", ".join(obj.support_types or [])
        return f"For {obj.who_for}" + (f": {types}" if types else "")
    return f"Donation intent {_fmt_amount(obj)} ({obj.reference})"


def to_summary(kind: str, obj: Any) -> SubmissionSummary:
    return SubmissionSummary(
        id=make_ref(kind, obj.id), kind=kind, name=obj.name, email=obj.email,
        status=obj.status, preview=preview(kind, obj), created_at=obj.created_at,
    )


def to_fields(obj: Any) -> dict[str, Any]:
    out: dict[str, Any] = {}
    for col in obj.__table__.columns:
        if col.name in _META:
            continue
        value = getattr(obj, col.name)
        out[col.name] = str(value) if isinstance(value, Decimal) else value
    return out


def to_detail(kind: str, obj: Any) -> SubmissionDetail:
    return SubmissionDetail(
        id=make_ref(kind, obj.id), kind=kind, status=obj.status, admin_note=obj.admin_note,
        consent=obj.consent, consent_at=obj.consent_at, created_at=obj.created_at,
        updated_at=obj.updated_at, fields=to_fields(obj),
    )

