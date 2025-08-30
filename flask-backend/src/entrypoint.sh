#!/usr/bin/env bash
set -euo pipefail
cd /app/src

# Ensure .env.dev exists (optional)
if [[ -f ./.env.dev ]]; then
  echo "Loading .env.dev"
  set -a; source ./.env.dev; set +a
fi

# Initialize or upgrade database migrations
if [[ ! -d /app/src/migrations ]]; then
  echo "Initializing migrations..."
  flask db init || true
fi

echo "Running migrations..."
flask db upgrade || true

# Seed dev-kit auth (idempotent)
python -m dev_kit.modules.users.cli --admin-username "${DEVKIT_ADMIN_USERNAME:-admin}" --admin-password "${DEVKIT_ADMIN_PASSWORD:-change-me}" || true

# Seed entity permissions (idempotent)
python - <<'PY'
import os
from app import create_app
from dev_kit.database.extensions import db
from app.seed import seed_entity_permissions, seed_single_permission
from app.seed import ensure_admin_role_assigned

app = create_app()
with app.app_context():
    res = seed_entity_permissions(db.session, entities=["market", "shelf", "product"])
    print({"seed_entity_permissions": res})
    res_single = seed_single_permission(db.session, permission_name="upload:app")
    print({"seed_single_permission": res_single})
    res2 = ensure_admin_role_assigned(db.session, admin_username=os.getenv("DEVKIT_ADMIN_USERNAME", "admin"))
    print({"ensure_admin_role_assigned": res2})
PY

# Start gunicorn
exec gunicorn wsgi:app -b 0.0.0.0:5000 --chdir /app/src
# exec flask run --host=0.0.0.0 --port=5000 --debug --reload
