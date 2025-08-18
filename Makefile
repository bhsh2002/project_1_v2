SHELL := /bin/bash

export PYTHONPATH := $(PWD)/flask-backend/src:$(PWD)/../dev-kit/src

up:
	docker compose up --build

migrate-init:
	FLASK_APP=src/wsgi.py FLASK_ENV=development \
	PYTHONPATH=$(PYTHONPATH) \
	flask --app src/wsgi.py db init

migrate-revision:
	FLASK_APP=src/wsgi.py FLASK_ENV=development \
	PYTHONPATH=$(PYTHONPATH) \
	flask --app src/wsgi.py db migrate -m "initial v2 app models"

migrate-upgrade:
	FLASK_APP=src/wsgi.py FLASK_ENV=development \
	PYTHONPATH=$(PYTHONPATH) \
	flask --app src/wsgi.py db upgrade

seed-auth:
	PYTHONPATH=$(PYTHONPATH) \
	python -m dev_kit.modules.users.cli --admin-username $${DEVKIT_ADMIN_USERNAME:-admin} --admin-password $${DEVKIT_ADMIN_PASSWORD:-change-me}

test:
	PYTHONPATH=$(PYTHONPATH) \
	pytest -q
