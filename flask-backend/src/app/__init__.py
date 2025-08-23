from dev_kit.database.extensions import db
from dev_kit.web.jwt import configure_jwt
from apiflask import APIFlask, APIBlueprint
from flask_cors import CORS

from .extensions import migrate, jwt
from .config import config


def create_app(config_name="config"):
    app = APIFlask(
        __name__,
        title=config[config_name].APIFLASK_TITLE,
        version=config[config_name].APIFLASK_VERSION,
    )
    app.config.from_object(config[config_name])

    app.security_schemes = {
        "jwt": {"type": "http", "scheme": "bearer", "bearerFormat": "JWT"}
    }

    CORS(
        app,
        supports_credentials=True,
        origins=["*"],
        resources={r"/*": {"origins": ["*"]}},
    )

    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    configure_jwt(jwt)

    from app.markets import models as _markets_models  # noqa: F401
    from app.shelves import models as _shelves_models  # noqa: F401
    from app.products import models as _products_models  # noqa: F401

    from dev_kit.modules.users import models as _devkit_user_models  # noqa: F401

    api_v1 = APIBlueprint(
        "api_v1", __name__, url_prefix="/api/v1", enable_openapi=False
    )

    from dev_kit.modules.users.routes import (
        auth_bp as dk_auth_bp,
        users_bp as dk_users_bp,
        roles_bp as dk_roles_bp,
        permissions_bp as dk_permissions_bp,
    )

    api_v1.register_blueprint(dk_auth_bp)
    api_v1.register_blueprint(dk_users_bp)
    api_v1.register_blueprint(dk_roles_bp)
    api_v1.register_blueprint(dk_permissions_bp)

    from .markets.routes import markets_bp
    from .shelves.routes import shelves_bp
    from .products.routes import products_bp
    from .users.routes_extra import users_extra_bp

    api_v1.register_blueprint(markets_bp)
    api_v1.register_blueprint(shelves_bp)
    api_v1.register_blueprint(products_bp)
    api_v1.register_blueprint(users_extra_bp)

    app.register_blueprint(api_v1)

    @app.get("/hello-api")
    @app.doc(summary="A simple hello endpoint", tags=["Test"])
    def hello_api():
        return {"message": "Hello from APIFlask Project-1 V2!"}, 200

    # @app.get("/")
    # @app.doc(hide=True)
    # def root_redirect():
    #     from flask import redirect, url_for

    #     return redirect(url_for("openapi.docs"))

    return app
