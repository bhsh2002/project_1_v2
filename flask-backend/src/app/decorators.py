from functools import wraps
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from typing import Optional

from dev_kit.exceptions import PermissionDeniedError


def permission_required(market_uuid: Optional[str] = None):
    def decorator(fn):
        @wraps(fn)
        def wrapper(*args, **kwargs):
            verify_jwt_in_request()
            claims = get_jwt()

            user_markets = claims.get("markets", [])
            if market_uuid is not None and market_uuid not in user_markets:
                raise PermissionDeniedError(
                    "Access to the specified market is not permitted."
                )
            return fn(*args, **kwargs)

        return wrapper

    return decorator
