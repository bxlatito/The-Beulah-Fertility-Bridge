"""Public form endpoints (rate limited). Payments are NOT processed here."""
from __future__ import annotations

from fastapi import APIRouter, BackgroundTasks, Depends
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.core.rate_limit import rate_limit
from app.crud import submissions
from app.email import queue_notifications
from app.schemas.submission import (
    ContactIn,
    DonateIn,
    DonationAck,
    SubmissionAck,
    SupportIn,
)

router = APIRouter(
    prefix="/api", tags=["public forms"],
    dependencies=[Depends(rate_limit("forms", "rate_limit_per_minute"))],
)


@router.post("/contact", response_model=SubmissionAck, status_code=201)
async def submit_contact(
    payload: ContactIn, background: BackgroundTasks,
    session: AsyncSession = Depends(get_session),
) -> SubmissionAck:
    obj = await submissions.create(session, "contact", {
        "name": f"{payload.firstname} {payload.lastname}",
        "email": payload.email, "subject": payload.subject, "message": payload.message,
    })
    ref = submissions.make_ref("contact", obj.id)
    queue_notifications(background, kind="contact", ref=ref, to=payload.email, name=payload.firstname)
    return SubmissionAck(id=ref, message="Thank you. Your message has been received.")


@router.post("/support", response_model=SubmissionAck, status_code=201)
async def submit_support(
    payload: SupportIn, background: BackgroundTasks,
    session: AsyncSession = Depends(get_session),
) -> SubmissionAck:
    obj = await submissions.create(session, "support", {
        "name": payload.name, "email": payload.email, "phone": payload.phone,
        "who_for": payload.who_for, "support_types": payload.support_types,
        "financial_need": payload.financial_need, "journey": payload.journey,
    })
    ref = submissions.make_ref("support", obj.id)
    queue_notifications(background, kind="support", ref=ref, to=payload.email, name=payload.name)
    return SubmissionAck(id=ref, message="Thank you. Your confidential request has been received.")


@router.post("/donate", response_model=DonationAck, status_code=201)
async def submit_donation_intent(
    payload: DonateIn, background: BackgroundTasks,
    session: AsyncSession = Depends(get_session),
) -> DonationAck:
    """Record a donation *intent* only. No payment gateway is called (PAYMENT_READY = false)."""
    obj = await submissions.create(session, "donation", {
        "reference": submissions.new_donation_reference(),
        "amount": payload.amount, "currency": payload.currency,
        "name": payload.name, "email": payload.email, "message": payload.message,
        "payment_status": "pending",
    })
    ref = submissions.make_ref("donation", obj.id)
    queue_notifications(
        background, kind="donation", ref=obj.reference, to=payload.email, name=payload.name,
        extra="No payment has been taken. We will be in touch about how to complete your gift.",
    )
    return DonationAck(
        id=ref, reference=obj.reference, amount=obj.amount, currency=obj.currency,
        message="Thank you. Your donation intention is recorded; no payment has been taken yet.",
    )
