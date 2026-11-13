"""FastAPI application entry point."""
from __future__ import annotations

import logging
from collections.abc import AsyncIterator, Awaitable, Callable
from contextlib import asynccontextmanager
from pathlib import Path

from fastapi import FastAPI, Request, Response
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles

from app.admin.views import router as admin_ui_router
from app.api import admin as admin_api
from app.api import health, pages, public
from app.core.config import get_settings
from app.core.database import SessionLocal
from app.crud.admin import ensure_admin

logger = logging.getLogger("bfbf")
# Make dev console emails visible in the uvicorn terminal.
if not logger.handlers:
    _handler = logging.StreamHandler()
    _handler.setFormatter(logging.Formatter("%(levelname)s [%(name)s] %(message)s"))
    logger.addHandler(_handler)
    logger.setLevel(logging.INFO)
    logger.propagate = False


@asynccontextmanager
async def lifespan(_: FastAPI) -> AsyncIterator[None]:
    settings = get_settings()
    if settings.admin_email and settings.admin_password_init:
        try:
            async with SessionLocal() as session:
                await ensure_admin(session, settings.admin_email, settings.admin_password_init)
        except Exception:  # noqa: BLE001
            logger.warning("Could not seed the admin user. Did you run `alembic upgrade head`?")
    yield


def create_app() -> FastAPI:
    settings = get_settings()
    app = FastAPI(
        title="BFBF API",
        description=(
            "Backend for the Beulah Fertility Bridge Foundation website. "
            "Education and support only: no medical advice, and no detailed medical history is stored."
        ),
        version="1.0.0",
        lifespan=lifespan,
    )

    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.cors_origin_list,
        allow_credentials=True,
        allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
        allow_headers=["Content-Type", "Authorization"],
    )

    @app.middleware("http")
    async def security_headers(
        request: Request, call_next: Callable[[Request], Awaitable[Response]]
    ) -> Response:
        response = await call_next(request)
        response.headers.setdefault("X-Content-Type-Options", "nosniff")
        response.headers.setdefault("X-Frame-Options", "DENY")
        response.headers.setdefault("Referrer-Policy", "same-origin")
        if request.url.path.startswith(("/admin", "/api/admin")):
            response.headers["Cache-Control"] = "no-store"
        if settings.is_prod:
            response.headers.setdefault("Strict-Transport-Security", "max-age=31536000")
        return response

    @app.exception_handler(RequestValidationError)
    async def validation_handler(_: Request, exc: RequestValidationError) -> JSONResponse:
        errors = [
            {
                "field": ".".join(str(p) for p in e["loc"][1:]) or str(e["loc"][0]),
                "message": str(e["msg"]).removeprefix("Value error, "),
            }
            for e in exc.errors()
        ]
        return JSONResponse(status_code=422, content={"detail": "Validation failed.", "errors": errors})

    app.include_router(health.router)
    app.include_router(public.router)
    app.include_router(pages.router)
    app.include_router(admin_api.router)
    app.include_router(admin_ui_router)
    static_dir = Path(__file__).parent / "static"
    app.mount("/static", StaticFiles(directory=static_dir), name="static")

    @app.get("/api/docs", include_in_schema=False)
    async def docs_alias() -> RedirectResponse:
        return RedirectResponse("/docs")

    return app


app = create_app()
