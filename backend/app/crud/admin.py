from __future__ import annotations

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import hash_password, verify_password
from app.models import AdminUser


async def get_by_email(session: AsyncSession, email: str) -> AdminUser | None:
    result = await session.execute(select(AdminUser).where(AdminUser.email == email.lower()))
    return result.scalar_one_or_none()


async def authenticate(session: AsyncSession, email: str, password: str) -> AdminUser | None:
    user = await get_by_email(session, email)
    ok = verify_password(password, user.hashed_password if user else None)
    return user if (user and ok and user.is_active) else None


async def ensure_admin(session: AsyncSession, email: str, password: str) -> AdminUser:
    """Create the initial admin if missing (never overwrites an existing password)."""
    user = await get_by_email(session, email)
    if user:
        return user
    user = AdminUser(email=email.lower(), hashed_password=hash_password(password), is_active=True)
    session.add(user)
    await session.commit()
    return user
