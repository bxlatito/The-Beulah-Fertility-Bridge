"""Email sending: console backend for dev/test, SMTP for production.

Team notifications deliberately contain NO submission content (only type + reference);
staff read the details inside the access-controlled admin area.
"""
from __future__ import annotations

import asyncio
import logging
import smtplib
from dataclasses import dataclass
from email.message import EmailMessage

from fastapi import BackgroundTasks

from app.core.config import get_settings

logger = logging.getLogger("bfbf.email")


@dataclass(frozen=True)
class Mail:
    to: str
    subject: str
    body: str


# Console backend keeps recent mail here (handy in dev and asserted on in tests).
outbox: list[Mail] = []
_OUTBOX_MAX = 200


def _send_smtp(mail: Mail) -> None:
    s = get_settings()
    msg = EmailMessage()
    msg["From"] = s.smtp_from or s.contact_email
    msg["To"] = mail.to
    msg["Subject"] = mail.subject
    msg.set_content(mail.body)
    with smtplib.SMTP(s.smtp_host, s.smtp_port, timeout=20) as server:
        if s.smtp_starttls:
            server.starttls()
        if s.smtp_username:
            server.login(s.smtp_username, s.smtp_password)
        server.send_message(msg)


async def send_mail(mail: Mail) -> None:
    """Send one email. Never raises (runs in a background task after the response)."""
    settings = get_settings()
    try:
        if settings.email_backend == "smtp":
            await asyncio.to_thread(_send_smtp, mail)
        else:
            outbox.append(mail)
            del outbox[:-_OUTBOX_MAX]
            logger.info("[console email] to=%s subject=%s\n%s", mail.to, mail.subject, mail.body)
    except Exception:  # noqa: BLE001
        logger.exception("Failed to send email to %s", mail.to)


_LABELS = {
    "contact": "enquiry",
    "support": "support request",
    "donation": "donation intention",
}


def confirmation_mail(kind: str, name: str | None, to: str, ref: str, extra: str = "") -> Mail:
    s = get_settings()
    greeting = f"Dear {name}," if name else "Hello,"
    lines = [
        greeting, "",
        f"Thank you for contacting {s.org_name}. We have received your {_LABELS[kind]} "
        f"(reference {ref}).",
        "",
    ]
    if extra:
        lines += [extra, ""]
    lines += [
        f"A member of our team will reply within {s.response_sla_working_days} working days.",
        "",
        f"{s.org_name} provides education and support. We do not give medical advice, diagnosis "
        "or treatment. If this is a medical emergency, please contact your local emergency "
        "services or a healthcare professional.",
        "",
        f"How we handle your information: {s.frontend_url}/privacy-notice",
    ]
    if s.contact_email:
        lines += ["", f"Questions? Reply to this email or write to {s.contact_email}."]
    lines += ["", "With care,", f"The {s.org_name} team"]
    return Mail(to=to, subject=f"We received your {_LABELS[kind]} ({ref})", body="\n".join(lines))


def team_mail(kind: str, ref: str) -> Mail | None:
    s = get_settings()
    if not s.team_notify_email:
        return None
    body = (
        f"A new {_LABELS[kind]} was submitted ({ref}).\n\n"
        f"Review it in the admin area: {s.backend_url}/admin\n\n"
        "Details are not included in this email for privacy."
    )
    return Mail(to=s.team_notify_email, subject=f"[BFBF] New {_LABELS[kind]} {ref}", body=body)


def queue_notifications(
    background: BackgroundTasks, *, kind: str, ref: str, to: str | None,
    name: str | None, extra: str = "",
) -> None:
    if to:
        background.add_task(send_mail, confirmation_mail(kind, name, to, ref, extra))
    team = team_mail(kind, ref)
    if team:
        background.add_task(send_mail, team)
