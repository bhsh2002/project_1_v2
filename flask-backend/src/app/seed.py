from typing import Iterable

from sqlalchemy.orm import Session

from dev_kit.modules.users.models import Role, Permission
from dev_kit.modules.users.models import User, UserRoleAssociation


def seed_entity_permissions(session: Session, entities: Iterable[str]) -> dict:
    """Ensure CRUD permissions exist for each entity and attach to admin role.

    Returns a summary dict.
    """
    created_permissions = 0
    attached_to_admin = 0

    admin_role = session.query(Role).filter(Role.name == "admin").first()
    if admin_role is None:
        # Nothing to do yet; dev-kit seed likely hasn't run
        return {
            "created_permissions": 0,
            "attached_to_admin": 0,
            "note": "admin role missing",
        }

    for entity in entities:
        for action in ("create", "read", "update", "delete"):
            name = f"{action}:{entity}"
            perm = session.query(Permission).filter(Permission.name == name).first()
            if perm is None:
                perm = Permission(name=name)
                session.add(perm)
                session.flush()
                created_permissions += 1
            if perm not in getattr(admin_role, "permissions", []):
                admin_role.permissions.append(perm)
                attached_to_admin += 1

    session.commit()
    return {
        "created_permissions": created_permissions,
        "attached_to_admin": attached_to_admin,
    }


def seed_single_permission(session: Session, permission_name: str) -> dict:
    """Ensure a single permission exists and is attached to the admin role."""
    admin_role = session.query(Role).filter(Role.name == "admin").first()
    if not admin_role:
        return {"created": False, "attached": False, "note": "admin role missing"}

    perm = session.query(Permission).filter(Permission.name == permission_name).first()
    created = False
    if perm is None:
        perm = Permission(name=permission_name)
        session.add(perm)
        session.flush()
        created = True

    attached = False
    if perm not in getattr(admin_role, "permissions", []):
        admin_role.permissions.append(perm)
        attached = True

    session.commit()
    return {"created": created, "attached": attached}


def ensure_admin_role_assigned(session: Session, *, admin_username: str) -> dict:
    """Ensure the 'admin' role is assigned to the admin user."""
    admin_user = session.query(User).filter(User.username == admin_username).first()
    admin_role = session.query(Role).filter(Role.name == "admin").first()
    if not admin_user or not admin_role:
        return {"assigned": False, "reason": "admin user or role missing"}

    existing = (
        session.query(UserRoleAssociation)
        .filter_by(user_id=admin_user.id, role_id=admin_role.id)
        .first()
    )
    if existing:
        return {"assigned": False, "reason": "already_assigned"}

    session.add(
        UserRoleAssociation(
            user_id=admin_user.id,
            role_id=admin_role.id,
            assigned_by_user_id=admin_user.id,
        )
    )
    session.commit()
    return {"assigned": True}
