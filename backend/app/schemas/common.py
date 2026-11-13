"""Shared validation helpers: sanitisation and annotated field types."""
from __future__ import annotations

import re
import unicodedata
from typing import Annotated, Any

from pydantic import BeforeValidator, EmailStr, StringConstraints

_TAG = re.compile(r"<[^>]*>")
_CTRL = re.compile(r"[\x00-\x08\x0b\x0c\x0e-\x1f\x7f]")


def clean_text(value: str, *, multiline: bool = False) -> str:
    """Normalise unicode, drop control characters and HTML tags, tidy whitespace."""
    value = unicodedata.normalize("NFC", value)
    value = _CTRL.sub("", value)
    value = _TAG.sub("", value)
    if multiline:
        lines = value.replace("\r\n", "\n").replace("\r", "\n").split("\n")
        value = "\n".join(line.rstrip() for line in lines)
    else:
        value = " ".join(value.split())
    return value.strip()


def _single(v: Any) -> Any:
    return clean_text(v) if isinstance(v, str) else v


def _multi(v: Any) -> Any:
    return clean_text(v, multiline=True) if isinstance(v, str) else v


def _opt_single(v: Any) -> Any:
    if isinstance(v, str):
        return clean_text(v) or None
    return v


def _opt_multi(v: Any) -> Any:
    if isinstance(v, str):
        return clean_text(v, multiline=True) or None
    return v


def _email(v: Any) -> Any:
    return v.strip().lower() if isinstance(v, str) else v


def _opt_email(v: Any) -> Any:
    if isinstance(v, str):
        return v.strip().lower() or None
    return v


Name = Annotated[str, BeforeValidator(_single), StringConstraints(min_length=1, max_length=80)]
FullName = Annotated[str, BeforeValidator(_single), StringConstraints(min_length=1, max_length=160)]
Tag = Annotated[str, BeforeValidator(_single), StringConstraints(min_length=1, max_length=60)]
Subject = Annotated[str, BeforeValidator(_single), StringConstraints(min_length=1, max_length=120)]
Email = Annotated[EmailStr, BeforeValidator(_email)]
OptEmail = Annotated[EmailStr | None, BeforeValidator(_opt_email)]
OptShort = Annotated[str | None, BeforeValidator(_opt_single)]
OptLong = Annotated[str | None, BeforeValidator(_opt_multi)]
Message = Annotated[str, BeforeValidator(_multi), StringConstraints(min_length=5, max_length=3000)]
