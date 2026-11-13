from __future__ import annotations

import asyncio
import os
import tempfile

_TMP = tempfile.mkdtemp(prefix="bfbf-test-")
os.environ.update(
    ENVIRONMENT="test",
    DATABASE_URL=f"sqlite+aiosqlite:///{_TMP}/test.db",
    SECRET_KEY="test-secret-key-for-tests-only-0123456789",
    ADMIN_EMAIL="admin@example.test",
    ADMIN_PASSWORD_INIT="correct-horse-battery-staple",
    CORS_ORIGINS="http://localhost:5173",
    EMAIL_BACKEND="console",
    TEAM_NOTIFY_EMAIL="team@example.test",
    CONTACT_EMAIL="hello@example.test",
    RATE_LIMIT_PER_MINUTE="5",
    LOGIN_RATE_LIMIT_PER_MINUTE="5",
)

import pytest  # noqa: E402
from fastapi.testclient import TestClient  # noqa: E402

from app import email as email_module  # noqa: E402
from app.core.database import SessionLocal, engine  # noqa: E402
from app.core.rate_limit import reset_rate_limits  # noqa: E402
from app.crud.admin import ensure_admin  # noqa: E402
from app.main import app  # noqa: E402
from app.models import Base  # noqa: E402

ADMIN_EMAIL = os.environ["ADMIN_EMAIL"]
ADMIN_PASSWORD = os.environ["ADMIN_PASSWORD_INIT"]


async def _reset_db() -> None:
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    async with SessionLocal() as session:
        await ensure_admin(session, ADMIN_EMAIL, ADMIN_PASSWORD)


@pytest.fixture(autouse=True)
def _clean_state() -> None:
    asyncio.run(_reset_db())
    reset_rate_limits()
    email_module.outbox.clear()


@pytest.fixture
def client() -> TestClient:
    return TestClient(app)


@pytest.fixture
def auth(client: TestClient) -> dict[str, str]:
    r = client.post("/api/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert r.status_code == 200
    return {"Authorization": f"Bearer {r.json()['access_token']}"}


CONTACT = {
    "firstname": "Ada", "lastname": "Obi", "email": "Ada@Example.com",
    "subject": "General question", "message": "Hello, I would like to know more.", "consent": True,
}
SUPPORT = {
    "name": "Ada Obi", "email": "ada@example.com", "phone": "+234 801 234 5678",
    "who_for": "Myself", "support_types": ["Emotional support", "Education"],
    "financial_need": "None", "journey": "We have been trying for two years.", "consent": True,
}
DONATE = {"amount": "5000", "currency": "NGN", "name": "Ada", "email": "ada@example.com",
          "message": "God bless", "consent": True}


@pytest.fixture
def seed(client: TestClient) -> dict[str, str]:
    ids = {
        "contact": client.post("/api/contact", json=CONTACT).json()["id"],
        "support": client.post("/api/support", json=SUPPORT).json()["id"],
        "donation": client.post("/api/donate", json=DONATE).json()["id"],
    }
    reset_rate_limits()
    email_module.outbox.clear()
    return ids
