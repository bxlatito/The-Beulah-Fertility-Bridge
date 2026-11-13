"""Request/response schemas for the public form endpoints and admin submission views."""
from __future__ import annotations

import re
from datetime import datetime
from decimal import Decimal
from typing import Annotated, Any, Literal

from pydantic import AliasChoices, BaseModel, ConfigDict, Field, field_validator

from app.schemas.common import (
    Email,
    FullName,
    Message,
    Name,
    OptEmail,
    OptLong,
    OptShort,
    Subject,
    Tag,
)

CONSENT_ERROR = "Consent is required to submit this form."
_PHONE = re.compile(r"^[0-9+()\-.\s]{7,20}$")


class _ConsentModel(BaseModel):
    model_config = ConfigDict(extra="ignore", populate_by_name=True)

    consent: bool = Field(description="Must be true. The consent time is recorded server-side.")

    @field_validator("consent")
    @classmethod
    def _must_consent(cls, v: bool) -> bool:
        if v is not True:
            raise ValueError(CONSENT_ERROR)
        return v


class ContactIn(_ConsentModel):
    firstname: Name = Field(validation_alias=AliasChoices("firstname", "firstName", "first_name"))
    lastname: Name = Field(validation_alias=AliasChoices("lastname", "lastName", "last_name"))
    email: Email
    subject: Subject
    message: Message


class SupportIn(_ConsentModel):
    name: FullName
    email: Email
    phone: OptShort = Field(default=None, max_length=20)
    who_for: Tag = Field(validation_alias=AliasChoices("who_for", "whoFor", "who-for"))
    support_types: Annotated[list[Tag], Field(max_length=10)] = Field(
        default_factory=list,
        validation_alias=AliasChoices("support_types", "supportTypes", "support-types"),
    )
    financial_need: OptShort = Field(
        default=None,
        max_length=60,
        validation_alias=AliasChoices("financial_need", "financialNeed", "financial-need"),
    )
    journey: OptLong = Field(
        default=None,
        max_length=1500,
        description=(
            "Short, general description only. PRIVACY: do NOT include detailed medical history, "
            "diagnoses or treatment details; BFBF provides education and support, not medical advice."
        ),
    )

    @field_validator("phone")
    @classmethod
    def _phone(cls, v: str | None) -> str | None:
        if v is not None and not _PHONE.match(v):
            raise ValueError("Enter a valid phone number (digits, spaces, + ( ) - only).")
        return v


class DonateIn(_ConsentModel):
    amount: Decimal = Field(gt=0, le=1_000_000_000, max_digits=14, decimal_places=2)
    currency: Literal["NGN", "USD"]
    name: OptShort = Field(default=None, max_length=160)
    email: OptEmail = None
    message: OptLong = Field(default=None, max_length=500)


class SubmissionAck(BaseModel):
    id: str = Field(examples=["contact-1"])
    status: Literal["received"] = "received"
    message: str


class DonationAck(BaseModel):
    id: str
    reference: str = Field(description="Pass this to the payment gateway later.")
    status: Literal["pending"] = "pending"
    payment_status: Literal["pending"] = "pending"
    amount: Decimal
    currency: str
    message: str


# ----- Admin views -----

class SubmissionSummary(BaseModel):
    id: str
    kind: str
    name: str | None
    email: str | None
    status: str
    preview: str
    created_at: datetime


class SubmissionPage(BaseModel):
    items: list[SubmissionSummary]
    total: int
    page: int
    page_size: int


class SubmissionDetail(BaseModel):
    id: str
    kind: str
    status: str
    admin_note: str | None
    consent: bool
    consent_at: datetime
    created_at: datetime
    updated_at: datetime
    fields: dict[str, Any]


class StatusUpdate(BaseModel):
    status: Literal["new", "read", "replied", "closed", "archived"]
    note: Annotated[str | None, Field(max_length=2000)] = Field(
        default=None, description="Internal admin note. Replaces the existing note when provided."
    )


class DashboardStats(BaseModel):
    total: int
    new: int
    by_kind: dict[str, int]
    by_status: dict[str, int]
    matrix: dict[str, dict[str, int]]

