from dev_kit.database.extensions import db
from dev_kit.database.mixins import IDMixin, UUIDMixin, TimestampMixin, SoftDeleteMixin
from sqlalchemy.dialects.mysql import INTEGER, VARCHAR


class Shelf(db.Model, IDMixin, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "shelves"

    code = db.Column(VARCHAR(100), unique=True, nullable=False, index=True)
    market_id = db.Column(
        INTEGER, db.ForeignKey("markets.id", ondelete="CASCADE"), nullable=False
    )

    market = db.relationship("Market", back_populates="shelves")
    products = db.relationship(
        "Product", back_populates="shelf", cascade="all, delete-orphan"
    )

    def __repr__(self):
        return f"<Shelf {self.name}>"
