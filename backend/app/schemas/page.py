from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, Field


class PageOut(BaseModel):
    slug: str
    title: str
    body: str
    updated_at: datetime


class PageIn(BaseModel):
    title: str = Field(min_length=1, max_length=200)
    body: str = Field(default="", max_length=100_000, description="Admin-authored; render safely.")
    published: bool = True
