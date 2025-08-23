import os
from dotenv import load_dotenv

basedir = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", ".."))
load_dotenv(os.path.join(basedir, ".env.dev"))


class JWTConfig:
    JWT_SECRET_KEY = os.environ.get("SECRET_KEY")
    JWT_TOKEN_LOCATION = "cookies"
    JWT_COOKIE_CSRF_PROTECT = True
    JWT_ACCESS_COOKIE_NAME = "ka"
    JWT_ACCESS_CSRF_COOKIE_NAME = "cka"
    JWT_REFRESH_COOKIE_NAME = "rk"
    JWT_REFRESH_CSRF_COOKIE_NAME = "crk"


class Config(JWTConfig):
    SECRET_KEY = os.environ.get("SECRET_KEY")
    DEBUG = os.environ.get("FLASK_DEBUG", "False").lower() == "true"
    ENV = os.environ.get("FLASK_ENV", "production")
    JWT_COOKIE_SECURE = False
    WTF_CSRF_ENABLED = False
    JWT_COOKIE_CSRF_PROTECT = False

    # Database configuration
    DB_USERNAME = os.environ.get("MYSQL_USER")
    DB_PASSWORD = os.environ.get("MYSQL_PASSWORD")
    DB_HOST = os.environ.get("DB_HOST")
    DB_PORT = os.environ.get("DB_PORT", "3306")
    DB_NAME = os.environ.get("MYSQL_DATABASE")
    DB_DIALECT = "mysql"
    DB_DRIVER = "mysqlconnector"

    SQLALCHEMY_DATABASE_URI = (
        f"{DB_DIALECT}+{DB_DRIVER}://"
        f"{DB_USERNAME}:{DB_PASSWORD}@"
        f"{DB_HOST}:{DB_PORT}/{DB_NAME}"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    SQLALCHEMY_ECHO = DEBUG

    # Celery
    broker_url = os.environ.get("CELERY_BROKER_URL", "redis://redis:6379/0")
    result_backend = os.environ.get("CELERY_RESULT_BACKEND", "redis://redis:6379/0")

    # APIFlask
    APIFLASK_SPEC_PATH = "/openapi.json"
    APIFLASK_DOCS_PATH = "/docs"
    APIFLASK_REDOC_PATH = "/redoc"
    APIFLASK_SWAGGER_UI_LAYOUT = "list"
    APIFLASK_TITLE = "Project-1 V2 API"
    APIFLASK_VERSION = "2.0.0"
    # APPLICATION_ROOT = "/back"

    # Public base URL for generating absolute links in exports
    PUBLIC_BASE_URL = os.environ.get("PUBLIC_BASE_URL", "http://localhost:5000")

    # File uploads
    UPLOAD_FOLDER = os.environ.get(
        "UPLOAD_FOLDER", os.path.join(basedir, "src/static/uploads")
    )
    TEMP_UPLOADS_FOLDER = os.environ.get("TEMP_UPLOADS_FOLDER", "/app/instance/temp")


class TestingConfig(Config):
    TESTING = True
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"
    SECRET_KEY = "test-secret"
    WTF_CSRF_ENABLED = False
    JWT_COOKIE_CSRF_PROTECT = False


config = {"config": Config, "testing": TestingConfig}
