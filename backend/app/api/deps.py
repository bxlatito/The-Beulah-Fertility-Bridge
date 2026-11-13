from __future__ import annotations

from fastapi import Depends, HTTPException, Request, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import get_settings
from app.core.database import get_session
from app.core.security import decode_access_token
from app.crud import admin as admin_crud
from app.models import AdminUser


def extract_token(request: Request) -> str | None:
    auth = request.headers.get("authorization", "")
    if auth.lower().startswith("bearer "):
        return auth[7:].strip() or None
    return request.cookies.get(get_settings().admin_cookie_name)


async def resolve_admin(session: AsyncSession, token: str | None) -> AdminUser | None:
    if not token:
        return None
    email = decode_access_token(token)
    if not email:
        return None
    user = await admin_crud.get_by_email(session, email)
    return user if user and user.is_active else None


async def get_current_admin(
    request: Request, session: AsyncSession = Depends(get_session)
) -> AdminUser:
    user = await resolve_admin(session, extract_token(request))
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user
