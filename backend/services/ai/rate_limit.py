import os
from dataclasses import dataclass
from datetime import date

from fastapi import HTTPException, Request


DISABLED_DETAIL = "AI endpoints are disabled for this MVP environment."
RATE_LIMIT_DETAIL = "Daily AI request limit reached for this MVP test."


@dataclass
class RateBucket:
    day: date
    count: int


_requests_by_ip: dict[str, RateBucket] = {}


def ensure_ai_enabled() -> None:
    if os.getenv("ENABLE_AI", "true").lower() != "true":
        raise HTTPException(status_code=503, detail=DISABLED_DETAIL)


def enforce_daily_limit(request: Request) -> None:
    limit = int(os.getenv("AI_DAILY_LIMIT", "20"))
    if limit <= 0:
        raise HTTPException(status_code=429, detail=RATE_LIMIT_DETAIL)

    client_ip = request.client.host if request.client else "unknown"
    today = date.today()
    bucket = _requests_by_ip.get(client_ip)

    if bucket is None or bucket.day != today:
        _requests_by_ip[client_ip] = RateBucket(day=today, count=1)
        return

    if bucket.count >= limit:
        raise HTTPException(status_code=429, detail=RATE_LIMIT_DETAIL)

    bucket.count += 1
