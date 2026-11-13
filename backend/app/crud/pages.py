from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models import Page
from app.schemas.page import PageIn


async def get_page(session: AsyncSession, slug: str, *, published_only: bool = True) -> Page | None:
    stmt = select(Page).where(Page.slug == slug)
    if published_only:
        stmt = stmt.where(Page.published.is_(True))
    return (await session.execute(stmt)).scalar_one_or_none()


async def upsert_page(session: AsyncSession, slug: str, data: PageIn) -> Page:
    page = await get_page(session, slug, published_only=False)
    if page is None:
        page = Page(slug=slug)
        session.add(page)
    page.title, page.body, page.published = data.title, data.body, data.published
    await session.commit()
    await session.refresh(page)
    return page
