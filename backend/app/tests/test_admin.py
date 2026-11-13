from __future__ import annotations

import csv
import io
from datetime import date, timedelta

from fastapi.testclient import TestClient

from app.tests.conftest import ADMIN_EMAIL, ADMIN_PASSWORD


def test_login_wrong_password_and_unknown_user(client: TestClient) -> None:
    assert client.post("/api/admin/login", json={"email": ADMIN_EMAIL, "password": "nope"}).status_code == 401
    assert client.post("/api/admin/login", json={"email": "x@example.com", "password": "nope"}).status_code == 401


def test_login_rate_limited(client: TestClient) -> None:
    codes = [client.post("/api/admin/login", json={"email": ADMIN_EMAIL, "password": "bad"}).status_code
             for _ in range(7)]
    assert codes[-1] == 429


def test_protected_routes_require_auth(client: TestClient, seed: dict[str, str]) -> None:
    assert client.get("/api/admin/submissions").status_code == 401
    assert client.get("/api/admin/export").status_code == 401
    assert client.delete(f"/api/admin/submissions/{seed['contact']}").status_code == 401
    bad = {"Authorization": "Bearer not.a.token"}
    assert client.get("/api/admin/me", headers=bad).status_code == 401


def test_login_sets_httponly_cookie_and_me(client: TestClient) -> None:
    r = client.post("/api/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    assert "httponly" in r.headers["set-cookie"].lower()
    assert "samesite=strict" in r.headers["set-cookie"].lower()
    assert client.get("/api/admin/me").json() == {"email": ADMIN_EMAIL}  # cookie auth
    assert client.post("/api/admin/logout").status_code == 204
    assert client.get("/api/admin/me").status_code == 401


def test_expired_token_rejected(client: TestClient, monkeypatch) -> None:
    from app.core.config import get_settings
    monkeypatch.setattr(get_settings(), "access_token_expire_minutes", -1)
    r = client.post("/api/admin/login", json={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD})
    token = r.json()["access_token"]
    client.cookies.clear()
    assert client.get("/api/admin/me", headers={"Authorization": f"Bearer {token}"}).status_code == 401


def test_list_filter_paginate(client: TestClient, auth: dict[str, str], seed: dict[str, str]) -> None:
    r = client.get("/api/admin/submissions", headers=auth).json()
    assert r["total"] == 3 and len(r["items"]) == 3
    assert client.get("/api/admin/submissions?type=support", headers=auth).json()["total"] == 1
    assert client.get("/api/admin/submissions?status=read", headers=auth).json()["total"] == 0
    assert client.get("/api/admin/submissions?q=obi", headers=auth).json()["total"] == 2
    assert client.get("/api/admin/submissions?q=%25", headers=auth).json()["total"] == 0  # wildcard escaped
    p1 = client.get("/api/admin/submissions?page_size=2&page=1", headers=auth).json()
    p2 = client.get("/api/admin/submissions?page_size=2&page=2", headers=auth).json()
    assert len(p1["items"]) == 2 and len(p2["items"]) == 1 and p1["total"] == 3
    ids = {i["id"] for i in p1["items"]} | {i["id"] for i in p2["items"]}
    assert ids == set(seed.values())
    today, tomorrow = date.today(), date.today() + timedelta(days=1)
    assert client.get(f"/api/admin/submissions?date_from={today}&date_to={today}", headers=auth).json()["total"] == 3
    assert client.get(f"/api/admin/submissions?date_from={tomorrow}", headers=auth).json()["total"] == 0
    assert client.get("/api/admin/submissions?type=bogus", headers=auth).status_code == 422


def test_detail_status_note_delete(client: TestClient, auth: dict[str, str], seed: dict[str, str]) -> None:
    ref = seed["support"]
    d = client.get(f"/api/admin/submissions/{ref}", headers=auth).json()
    assert d["status"] == "new" and d["consent"] is True and d["fields"]["who_for"] == "Myself"
    assert d["fields"]["support_types"] == ["Emotional support", "Education"]

    for status in ("read", "replied", "closed", "archived", "new"):
        r = client.patch(f"/api/admin/submissions/{ref}/status", headers=auth,
                         json={"status": status, "note": f"moved to {status}"})
        assert r.status_code == 200 and r.json()["status"] == status
        assert r.json()["admin_note"] == f"moved to {status}"
    # note unchanged when omitted
    r = client.patch(f"/api/admin/submissions/{ref}/status", headers=auth, json={"status": "read"})
    assert r.json()["admin_note"] == "moved to new"
    assert client.patch(f"/api/admin/submissions/{ref}/status", headers=auth,
                        json={"status": "deleted"}).status_code == 422

    assert client.delete(f"/api/admin/submissions/{ref}", headers=auth).status_code == 204
    assert client.get(f"/api/admin/submissions/{ref}", headers=auth).status_code == 404
    assert client.delete(f"/api/admin/submissions/{ref}", headers=auth).status_code == 404
    assert client.get("/api/admin/submissions/garbage", headers=auth).status_code == 404


def test_dashboard_stats(client: TestClient, auth: dict[str, str], seed: dict[str, str]) -> None:
    client.patch(f"/api/admin/submissions/{seed['contact']}/status", headers=auth, json={"status": "read"})
    s = client.get("/api/admin/dashboard-stats", headers=auth).json()
    assert s["total"] == 3 and s["new"] == 2
    assert s["by_kind"] == {"contact": 1, "support": 1, "donation": 1}
    assert s["matrix"]["contact"]["read"] == 1


def test_csv_export(client: TestClient, auth: dict[str, str], seed: dict[str, str]) -> None:
    client.post("/api/contact", json={
        "firstname": "=cmd", "lastname": "x", "email": "e@example.com", "subject": "s",
        "message": "=HYPERLINK(\"http://evil\")", "consent": True})
    r = client.get("/api/admin/export", headers=auth)
    assert r.status_code == 200 and r.headers["content-type"].startswith("text/csv")
    assert "attachment" in r.headers["content-disposition"]
    rows = list(csv.DictReader(io.StringIO(r.text)))
    assert len(rows) == 4 and {x["type"] for x in rows} == {"contact", "support", "donation"}
    injected = next(x for x in rows if x["email"] == "e@example.com")
    assert injected["name"].startswith("'=") and injected["message"].startswith("'=")
    only = client.get("/api/admin/export?type=donation", headers=auth).text
    assert len(list(csv.DictReader(io.StringIO(only)))) == 1


# ----- server-rendered admin UI -----

def _login_ui(client: TestClient) -> None:
    r = client.post("/admin/login", data={"email": ADMIN_EMAIL, "password": ADMIN_PASSWORD},
                    follow_redirects=False)
    assert r.status_code == 303


def _csrf(html: str) -> str:
    marker = 'name="csrf" value="'
    start = html.index(marker) + len(marker)
    return html[start: html.index('"', start)]


def test_ui_requires_login_and_bad_login(client: TestClient) -> None:
    assert client.get("/admin", follow_redirects=False).headers["location"] == "/admin/login"
    assert client.get("/admin/login").status_code == 200
    r = client.post("/admin/login", data={"email": ADMIN_EMAIL, "password": "wrong"})
    assert r.status_code == 401 and "Incorrect email or password" in r.text


def test_ui_list_detail_status_delete(client: TestClient, seed: dict[str, str]) -> None:
    _login_ui(client)
    page = client.get("/admin")
    assert page.status_code == 200 and "Ada Obi" in page.text
    assert "Ada Obi" not in client.get("/admin?type=donation").text
    assert "No submissions match" in client.get("/admin?q=zzzz").text
    assert client.get("/admin?date_from=bad&page=-3").status_code == 200
    csrf = _csrf(page.text)

    ref = seed["contact"]
    detail = client.get(f"/admin/s/{ref}")
    assert detail.status_code == 200 and "General question" in detail.text
    assert client.get("/admin/s/contact-999").status_code == 404

    bad = client.post(f"/admin/s/{ref}/status", data={"status": "read", "csrf": "x"})
    assert bad.status_code == 400
    ok = client.post(f"/admin/s/{ref}/status", data={"status": "replied", "note": "Called", "csrf": csrf},
                     follow_redirects=True)
    assert "Saved" in ok.text and "Called" in ok.text and "Replied" in ok.text

    assert client.post(f"/admin/s/{ref}/delete", data={"csrf": "x"}).status_code == 400
    client.post(f"/admin/s/{ref}/delete", data={"csrf": csrf})
    assert client.get(f"/admin/s/{ref}").status_code == 404
    assert client.post("/admin/s/contact-999/status", data={"status": "read", "csrf": csrf},
                       follow_redirects=False).status_code == 303

    out = client.post("/admin/logout", data={"csrf": csrf}, follow_redirects=False)
    assert out.status_code == 303
    assert client.get("/admin", follow_redirects=False).headers["location"] == "/admin/login"


def test_ui_unauthenticated_posts_redirect(client: TestClient, seed: dict[str, str]) -> None:
    ref = seed["contact"]
    for path in (f"/admin/s/{ref}/status", f"/admin/s/{ref}/delete"):
        r = client.post(path, data={"status": "read", "csrf": "x"}, follow_redirects=False)
        assert r.headers["location"] == "/admin/login"
    assert client.get(f"/admin/s/{ref}", follow_redirects=False).status_code == 303
