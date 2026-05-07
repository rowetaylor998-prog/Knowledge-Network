import hashlib
import json
import os
from collections import OrderedDict
from typing import Any


MAX_CACHE_SIZE = 500
_cache: OrderedDict[str, Any] = OrderedDict()


def is_cache_enabled() -> bool:
    return os.getenv("AI_CACHE_ENABLED", "true").lower() == "true"


def make_cache_key(endpoint: str, **parts: object) -> str:
    payload = {"endpoint": endpoint, **parts}
    normalized = json.dumps(payload, ensure_ascii=False, sort_keys=True)
    return hashlib.sha256(normalized.encode("utf-8")).hexdigest()


def get_cached(key: str) -> Any | None:
    if not is_cache_enabled():
        return None

    value = _cache.get(key)
    if value is not None:
        _cache.move_to_end(key)
    return value


def set_cached(key: str, value: Any) -> None:
    if not is_cache_enabled():
        return

    _cache[key] = value
    _cache.move_to_end(key)

    while len(_cache) > MAX_CACHE_SIZE:
        _cache.popitem(last=False)
