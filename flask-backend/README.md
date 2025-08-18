Project-1 V2 (Flask + dev-kit)

Quickstart

- Prereqs: Docker Desktop or engine, ports 5000, 3307, 6379 available.
- Run: `make up` from `savana/flask/project_1_v2`.

Services

- API: http://localhost:5000/api/v1
- Docs: http://localhost:5000/docs
- Redis: localhost:6379
- MySQL: localhost:3307 (db/app/app_pw)

Database & migrations

- Initialize migrations: `make migrate-init`
- Generate revision: `make migrate-revision`
- Apply: `make migrate-upgrade`

Seed dev-kit auth

- `make seed-auth`

Notes

- The API image installs `-e ../../../../dev-kit` from requirements so dev-kit changes are synced in dev.
- Celery worker uses `app.products.tasks.celery` and the app config for broker/backend.
