from datetime import datetime, timedelta
from typing import Tuple

from flask_jwt_extended import create_access_token, create_refresh_token

from dev_kit.services import BaseService
from dev_kit.exceptions import AuthenticationError
from dev_kit.modules.users.models import User
from dev_kit.database.extensions import db


class UserServiceExtra(BaseService[User]):
    def login_market_user(self, username: str, password: str) -> Tuple[User, str]:
        user = self.repo._query().filter(User.username == username).first()

        if not user or not user.check_password(password):
            raise AuthenticationError("Invalid credentials.")
        if not user.is_active:
            raise AuthenticationError("User account is not active.")
        if getattr(user, "deleted_at", None) is not None:
            raise AuthenticationError("User account has been deleted.")

        user.last_login_at = datetime.now()
        self._db_session.add(user)
        self._db_session.commit()

        markets = list(getattr(user, "markets", []))
        roles = list(getattr(user, "roles", []))
        is_super_admin = any(getattr(role, "is_system_role", False) for role in roles)
        # Aggregate permissions from roles if available
        permissions = []
        for role in roles:
            for perm in getattr(role, "permissions", []) or []:
                name = getattr(perm, "name", None)
                if name:
                    permissions.append(name)
        # De-duplicate
        permissions = sorted(set(permissions))
        additional_claims = {
            "user_id": user.id,
            "markets": [market.uuid for market in markets],
            "roles": [role.name for role in roles],
            "is_super_admin": is_super_admin,
            "permissions": permissions,
        }

        access_token = create_access_token(
            identity=str(getattr(user, "uuid", user.id)),
            expires_delta=timedelta(days=1),
            additional_claims=additional_claims,
        )
        refresh_token = create_refresh_token(
            identity=str(getattr(user, "uuid", user.id))
        )
        return user, access_token, refresh_token


user_service_extra = UserServiceExtra(model=User, db_session=db.session)
