from __future__ import annotations

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_session
from app.crud import pages
from app.schemas.page import PageOut

router = APIRouter(prefix="/api", tags=["pages"])


@router.get("/pages/{slug}", response_model=PageOut)
async def read_page(slug: str, session: AsyncSession = Depends(get_session)) -> PageOut:
    page = await pages.get_page(session, slug)
    if page is None:
        raise HTTPException(status_code=404, detail="Page not found.")
    return PageOut(slug=page.slug, title=page.title, body=page.body, updated_at=page.updated_at)
