"""Small in-memory sliding-window rate limiter (per client IP).

For multi-process / multi-host deployments swap the store for Redis or put a
limiter in front (nginx, Cloudflare). The dependency interface stays the same.
"""
from __future__ import annotations

import time
from collections import defaultdict, deque
from collections.abc import Awaitable, Callable

from fastapi import HTTPException, Request

from app.core.config import get_settings

WINDOW_SECONDS = 60.0
_hits: dict[str, deque[float]] = defaultdict(deque)


def reset_rate_limits() -> None:
    _hits.clear()


def client_ip(request: Request) -> str:
    if get_settings().trust_proxy_headers:
        forwarded = request.headers.get("x-forwarded-for")
        if forwarded:
            return forwarded.split(",")[0].strip()
    return request.client.host if request.client else "unknown"


def rate_limit(bucket: str, setting_name: str) -> Callable[[Request], Awaitable[None]]:
    """Build a dependency allowing `settings.<setting_name>` hits per minute per IP."""

    async def dependency(request: Request) -> None:
        limit = int(getattr(get_settings(), setting_name))
        key = f"{bucket}:{client_ip(request)}"
        now = time.monotonic()
        hits = _hits[key]
        while hits and now - hits[0] > WINDOW_SECONDS:
            hits.popleft()
        if len(hits) >= limit:
            retry = max(1, int(WINDOW_SECONDS - (now - hits[0])))
            raise HTTPException(
                status_code=429,
                detail="Too many requests. Please wait a minute and try again.",
                headers={"Retry-After": str(retry)},
            )
        hits.append(now)

    return dependency
