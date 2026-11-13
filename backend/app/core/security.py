"""Password hashing, JWT helpers and CSRF tokens for the admin UI."""
from __future__ import annotations

import hashlib
import hmac
from datetime import UTC, datetime, timedelta

import bcrypt
import jwt

from app.core.config import get_settings

ALGORITHM = "HS256"


def hash_password(password: str) -> str:
    # bcrypt only uses the first 72 bytes.
    return bcrypt.hashpw(password.encode()[:72], bcrypt.gensalt()).decode()


# Used to keep login timing similar whether or not the account exists.
_DUMMY_HASH = hash_password("not-a-real-password")


def verify_password(plain: str, hashed: str | None) -> bool:
    try:
        ok = bcrypt.checkpw(plain.encode()[:72], (hashed or _DUMMY_HASH).encode())
    except ValueError:
        return False
    return ok and hashed is not None


def create_access_token(subject: str) -> str:
    settings = get_settings()
    now = datetime.now(UTC)
    payload = {
        "sub": subject,
        "iat": now,
        "exp": now + timedelta(minutes=settings.access_token_expire_minutes),
    }
    return jwt.encode(payload, settings.secret_key, algorithm=ALGORITHM)


def decode_access_token(token: str) -> str | None:
    try:
        payload = jwt.decode(token, get_settings().secret_key, algorithms=[ALGORITHM])
    except jwt.PyJWTError:
        return None
    sub = payload.get("sub")
    return sub if isinstance(sub, str) else None


def csrf_token(session_token: str) -> str:
    key = get_settings().secret_key.encode()
    return hmac.new(key, b"csrf:" + session_token.encode(), hashlib.sha256).hexdigest()


def verify_csrf(session_token: str, supplied: str) -> bool:
    return hmac.compare_digest(csrf_token(session_token), supplied or "")
