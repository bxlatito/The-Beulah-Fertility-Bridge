from __future__ import annotations

from fastapi.testclient import TestClient

from app import email as email_module
from app.tests.conftest import CONTACT, DONATE, SUPPORT


def test_health(client: TestClient) -> None:
    r = client.get("/api/health")
    assert r.status_code == 200 and r.json() == {"status": "ok"}


def test_docs_and_openapi(client: TestClient) -> None:
    assert client.get("/docs").status_code == 200
    paths = client.get("/openapi.json").json()["paths"]
    for p in ("/api/contact", "/api/support", "/api/donate", "/api/admin/login",
              "/api/admin/submissions", "/api/admin/export"):
        assert p in paths
    assert client.get("/api/docs", follow_redirects=False).status_code in (302, 307)


def test_contact_valid_stores_and_queues_emails(client: TestClient) -> None:
    r = client.post("/api/contact", json=CONTACT)
    assert r.status_code == 201
    assert r.json()["id"].startswith("contact-") and r.json()["status"] == "received"
    to = {m.to for m in email_module.outbox}
    assert to == {"ada@example.com", "team@example.test"}  # email lower-cased
    confirmation = next(m for m in email_module.outbox if m.to == "ada@example.com")
    assert "/privacy-notice" in confirmation.body and "5 working days" in confirmation.body
    team = next(m for m in email_module.outbox if m.to == "team@example.test")
    assert CONTACT["message"] not in team.body  # no content in team notification


def test_contact_accepts_camel_case_aliases(client: TestClient) -> None:
    body = {**CONTACT, "firstName": "Ngozi", "lastName": "Eze"}
    del body["firstname"], body["lastname"]
    assert client.post("/api/contact", json=body).status_code == 201


def test_contact_missing_field_422(client: TestClient) -> None:
    body = {k: v for k, v in CONTACT.items() if k != "email"}
    r = client.post("/api/contact", json=body)
    assert r.status_code == 422
    assert any(e["field"] == "email" for e in r.json()["errors"])
    assert email_module.outbox == []


def test_consent_required(client: TestClient) -> None:
    for payload, url in ((CONTACT, "/api/contact"), (SUPPORT, "/api/support"), (DONATE, "/api/donate")):
        r = client.post(url, json={**payload, "consent": False})
        assert r.status_code == 422
        assert "Consent is required" in r.json()["errors"][0]["message"]


def test_html_is_stripped(client: TestClient, auth: dict[str, str]) -> None:
    body = {**CONTACT, "message": "Hi <script>alert(1)</script> there friend"}
    ref = client.post("/api/contact", json=body).json()["id"]
    detail = client.get(f"/api/admin/submissions/{ref}", headers=auth).json()
    assert "<" not in detail["fields"]["message"]


def test_support_valid_and_limits(client: TestClient) -> None:
    assert client.post("/api/support", json=SUPPORT).status_code == 201
    too_long = {**SUPPORT, "journey": "x" * 1501}
    assert client.post("/api/support", json=too_long).status_code == 422
    bad_phone = {**SUPPORT, "phone": "abc"}
    assert client.post("/api/support", json=bad_phone).status_code == 422
    minimal = {"name": "A", "email": "a@example.com", "who_for": "Myself", "consent": True}
    assert client.post("/api/support", json=minimal).status_code == 201


def test_donate_is_pending_and_has_reference(client: TestClient) -> None:
    r = client.post("/api/donate", json=DONATE)
    assert r.status_code == 201
    data = r.json()
    assert data["status"] == "pending" and data["payment_status"] == "pending"
    assert data["reference"].startswith("BFBF-") and data["currency"] == "NGN"
    assert "No payment has been taken" in next(
        m for m in email_module.outbox if m.to == "ada@example.com").body


def test_donate_anonymous_and_validation(client: TestClient) -> None:
    anon = {"amount": 10, "currency": "USD", "consent": True}
    assert client.post("/api/donate", json=anon).status_code == 201
    assert [m.to for m in email_module.outbox] == ["team@example.test"]
    assert client.post("/api/donate", json={**anon, "amount": -5}).status_code == 422
    assert client.post("/api/donate", json={**anon, "currency": "EUR"}).status_code == 422


def test_rate_limit_429(client: TestClient) -> None:
    codes = [client.post("/api/contact", json=CONTACT).status_code for _ in range(7)]
    assert codes[:5] == [201] * 5 and codes[5:] == [429, 429]
    r = client.post("/api/contact", json=CONTACT)
    assert "Retry-After" in r.headers


def test_cors_preflight(client: TestClient) -> None:
    ok = client.options("/api/contact", headers={
        "Origin": "http://localhost:5173", "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type"})
    assert ok.status_code == 200
    assert ok.headers["access-control-allow-origin"] == "http://localhost:5173"
    bad = client.options("/api/contact", headers={
        "Origin": "https://evil.example", "Access-Control-Request-Method": "POST"})
    assert "access-control-allow-origin" not in bad.headers


def test_pages_public_endpoint(client: TestClient, auth: dict[str, str]) -> None:
    assert client.get("/api/pages/learn").status_code == 404
    r = client.put("/api/admin/pages/learn", headers=auth,
                   json={"title": "Learn", "body": "Fertility basics", "published": True})
    assert r.status_code == 200
    assert client.get("/api/pages/learn").json()["body"] == "Fertility basics"
    client.put("/api/admin/pages/learn", headers=auth, json={"title": "Learn", "published": False})
    assert client.get("/api/pages/learn").status_code == 404
