"""Public form submission tables."""
from __future__ import annotations

from decimal import Decimal

from sqlalchemy import JSON, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.models.base import Base, SubmissionMixin


class ContactSubmission(SubmissionMixin, Base):
    __tablename__ = "contact_submissions"

    name: Mapped[str] = mapped_column(String(160))
    email: Mapped[str] = mapped_column(String(254), index=True)
    subject: Mapped[str] = mapped_column(String(120))
    message: Mapped[str] = mapped_column(Text)


class SupportEnquiry(SubmissionMixin, Base):
    __tablename__ = "support_enquiries"

    name: Mapped[str] = mapped_column(String(160))
    email: Mapped[str] = mapped_column(String(254), index=True)
    phone: Mapped[str | None] = mapped_column(String(32), default=None)
    who_for: Mapped[str] = mapped_column(String(60))
    support_types: Mapped[list[str]] = mapped_column(JSON, default=list)
    financial_need: Mapped[str | None] = mapped_column(String(60), default=None)
    # Education/support only: users are told NOT to share detailed medical history.
    journey: Mapped[str | None] = mapped_column(Text, default=None)


class Donation(SubmissionMixin, Base):
    """A donation *intent*. No payment is processed; `payment_status` stays 'pending'."""

    __tablename__ = "donations"

    reference: Mapped[str] = mapped_column(String(24), unique=True, index=True)
    amount: Mapped[Decimal] = mapped_column(Numeric(14, 2))
    currency: Mapped[str] = mapped_column(String(3))
    name: Mapped[str | None] = mapped_column(String(160), default=None)
    email: Mapped[str | None] = mapped_column(String(254), default=None)
    message: Mapped[str | None] = mapped_column(Text, default=None)
    payment_status: Mapped[str] = mapped_column(String(16), default="pending")
    payment_reference: Mapped[str | None] = mapped_column(String(120), default=None)
