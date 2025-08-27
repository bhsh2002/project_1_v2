from dev_kit.database.extensions import db
from dev_kit.database.mixins import (
    IDMixin,
    UUIDMixin,
    TimestampMixin,
    SoftDeleteMixin,
)
from sqlalchemy.dialects.mysql import INTEGER, VARCHAR


class Market(db.Model, IDMixin, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "markets"

    name = db.Column(VARCHAR(100), unique=True, nullable=False, index=True)
    phone_number = db.Column(VARCHAR(15), unique=True, nullable=False, index=True)

    users = db.relationship(
        "MarketUsers",
        back_populates="market",
        cascade="all, delete-orphan",
    )
    shelves = db.relationship(
        "Shelf", back_populates="market", cascade="all, delete-orphan"
    )
    products = db.relationship(
        "Product", back_populates="market", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Market {self.name}>"


class MarketUsers(db.Model):
    __tablename__ = "market_users"

    market_id = db.Column(
        INTEGER, db.ForeignKey("markets.id", ondelete="CASCADE"), primary_key=True
    )
    # Note: We intentionally avoid a foreign key to the dev-kit users table
    # because it lives in a separate SQLAlchemy metadata. We still store the
    # user ID for joins at query-time.
    user_id = db.Column(INTEGER, nullable=False, primary_key=True, index=True)

    market = db.relationship("Market", back_populates="users")
