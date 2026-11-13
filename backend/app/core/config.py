"""Application settings, loaded from environment variables / .env (no secrets in code)."""
from __future__ import annotations

import secrets
from functools import lru_cache
from typing import Literal

from pydantic import model_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    environment: Literal["dev", "test", "prod"] = "dev"

    # Database: SQLite by default; set DATABASE_URL=postgresql://... for production.
    database_url: str = "sqlite+aiosqlite:///./bfbf.db"

    # Auth
    secret_key: str = ""
    access_token_expire_minutes: int = 60
    admin_cookie_name: str = "bfbf_admin"
    admin_email: str = ""
    admin_password_init: str = ""

    # URLs / CORS
    cors_origins: str = "http://localhost:5173"
    frontend_url: str = "http://localhost:5173"
    backend_url: str = "http://localhost:8000"

    # Organisation details (used in emails)
    org_name: str = "Beulah Fertility Bridge Foundation"
    contact_email: str = ""
    team_notify_email: str = ""
    response_sla_working_days: int = 5

    # Email
    email_backend: Literal["console", "smtp"] = "console"
    smtp_host: str = ""
    smtp_port: int = 587
    smtp_username: str = ""
    smtp_password: str = ""
    smtp_from: str = ""
    smtp_starttls: bool = True

    # Rate limiting (per client IP, per minute)
    rate_limit_per_minute: int = 5
    login_rate_limit_per_minute: int = 10
    trust_proxy_headers: bool = False

    @model_validator(mode="after")
    def _finalise(self) -> Settings:
        if not self.secret_key:
            if self.environment == "prod":
                raise ValueError("SECRET_KEY must be set in production")
            # Dev convenience: ephemeral key (admin sessions reset on restart).
            self.secret_key = secrets.token_urlsafe(48)
        if self.environment == "prod" and len(self.secret_key) < 32:
            raise ValueError("SECRET_KEY must be at least 32 characters in production")
        url = self.database_url
        if url.startswith("postgres://"):
            url = "postgresql://" + url[len("postgres://"):]
        if url.startswith("postgresql://"):
            url = "postgresql+asyncpg://" + url[len("postgresql://"):]
        elif url.startswith("sqlite://"):
            url = url.replace("sqlite://", "sqlite+aiosqlite://", 1)
        self.database_url = url
        return self

    @property
    def cors_origin_list(self) -> list[str]:
        return [o.strip().rstrip("/") for o in self.cors_origins.split(",") if o.strip()]

    @property
    def is_prod(self) -> bool:
        return self.environment == "prod"

    @property
    def is_sqlite(self) -> bool:
        return self.database_url.startswith("sqlite")


@lru_cache
def get_settings() -> Settings:
    return Settings()
