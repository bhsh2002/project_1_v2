# import os
import pytest
from app import create_app
from dev_kit.database.extensions import db
from dev_kit.modules.users.models import Base
from dev_kit.modules.users.bootstrap import seed_default_auth


@pytest.fixture(scope="session")
def app():
    app = create_app("testing")
    with app.app_context():
        db.create_all()
        Base.metadata.create_all(db.engine)
        seed_default_auth(
            db.session, admin_username="admin", admin_password="change-me"
        )

        yield app
        db.drop_all()


@pytest.fixture(scope="session")
def client(app):
    with app.test_client() as client:
        yield client


@pytest.fixture(scope="session")
def admin_cookies(client):
    resp = client.post(
        "/api/v1/auth/login",
        json={"username": "admin", "password": "change-me"},
    )
    assert resp.status_code == 200, resp.get_data(as_text=True)
    return resp.headers.getlist("Set-Cookie")
