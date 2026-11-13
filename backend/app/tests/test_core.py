from __future__ import annotations

import asyncio

import pytest
from fastapi.testclient import TestClient

from app import email as email_module
from app.core import security
from app.core.config import Settings
from app.core.database import SessionLocal
from app.crud import admin as admin_crud
from app.crud.submissions import parse_ref
from app.main import app


def test_password_and_token_roundtrip() -> None:
    h = security.hash_password("s3cret")
    assert security.verify_password("s3cret", h) and not security.verify_password("x", h)
    assert not security.verify_password("s3cret", None)
    token = security.create_access_token("a@example.com")
    assert security.decode_access_token(token) == "a@example.com"
    assert security.decode_access_token(token + "x") is None
    assert security.verify_csrf(token, security.csrf_token(token))
    assert not security.verify_csrf(token, "bad")


def test_settings_validation() -> None:
    with pytest.raises(ValueError):
        Settings(environment="prod", secret_key="")
    with pytest.raises(ValueError):
        Settings(environment="prod", secret_key="short")
    s = Settings(environment="prod", secret_key="x" * 40, database_url="postgres://u:p@h/db",
                 cors_origins="https://a.org/, https://b.org")
    assert s.database_url.startswith("postgresql+asyncpg://") and s.cors_origin_list == ["https://a.org", "https://b.org"]
    assert Settings(database_url="sqlite:///./x.db").database_url == "sqlite+aiosqlite:///./x.db"
    assert Settings(secret_key="").secret_key  # dev: ephemeral key generated


def test_parse_ref() -> None:
    assert parse_ref("contact-5") == ("contact", 5)
    for bad in ("x-1", "contact-", "contact-a", "nohyphen"):
        with pytest.raises(ValueError):
            parse_ref(bad)


def test_ensure_admin_is_idempotent() -> None:
    async def run() -> None:
        async with SessionLocal() as s:
            a = await admin_crud.ensure_admin(s, "new@example.com", "pw-one")
            b = await admin_crud.ensure_admin(s, "NEW@example.com", "pw-two")
            assert a.id == b.id
            assert await admin_crud.authenticate(s, "new@example.com", "pw-one")
            assert not await admin_crud.authenticate(s, "new@example.com", "pw-two")
    asyncio.run(run())


def test_lifespan_seeds_admin_and_headers() -> None:
    with TestClient(app) as c:
        r = c.get("/api/health")
        assert r.headers["x-content-type-options"] == "nosniff"
        assert r.headers["x-frame-options"] == "DENY"


def test_smtp_backend_used_when_configured(monkeypatch) -> None:
    sent: list[email_module.Mail] = []
    monkeypatch.setattr(email_module, "_send_smtp", sent.append)
    monkeypatch.setattr(email_module.get_settings(), "email_backend", "smtp")
    asyncio.run(email_module.send_mail(email_module.Mail("a@example.com", "s", "b")))
    assert len(sent) == 1 and email_module.outbox == []


def test_smtp_failure_never_raises(monkeypatch) -> None:
    def boom(_: email_module.Mail) -> None:
        raise OSError("smtp down")
    monkeypatch.setattr(email_module, "_send_smtp", boom)
    monkeypatch.setattr(email_module.get_settings(), "email_backend", "smtp")
    asyncio.run(email_module.send_mail(email_module.Mail("a@example.com", "s", "b")))
