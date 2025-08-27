from dev_kit.database.extensions import db
from dev_kit.database.mixins import IDMixin, UUIDMixin, TimestampMixin, SoftDeleteMixin
from sqlalchemy.dialects.mysql import INTEGER, VARCHAR, TEXT, DECIMAL


class Product(db.Model, IDMixin, UUIDMixin, TimestampMixin, SoftDeleteMixin):
    __tablename__ = "products"

    barcode = db.Column(VARCHAR(100), nullable=False, index=True)
    name = db.Column(VARCHAR(100), nullable=False, index=True)
    description = db.Column(TEXT, nullable=True)
    price = db.Column(DECIMAL(precision=7, scale=2), nullable=False)
    stock_quantity = db.Column(INTEGER, nullable=False, default=0)
    image_url = db.Column(VARCHAR(100))
    image_processing_status = db.Column(
        VARCHAR(20), nullable=False, default="PENDING", server_default="PENDING"
    )

    shelf_id = db.Column(
        INTEGER, db.ForeignKey("shelves.id", ondelete="CASCADE"), nullable=False
    )

    market_id = db.Column(
        INTEGER, db.ForeignKey("markets.id", ondelete="CASCADE"), nullable=False
    )

    shelf = db.relationship("Shelf", back_populates="products")
    market = db.relationship("Market", back_populates="products")

    __table_args__ = (
        db.UniqueConstraint("barcode", "market_id", name="uq_barcode_market"),
    )

    @property
    def shelf_code(self) -> str | None:
        if self.shelf:
            return self.shelf.code
        return None

    def __repr__(self):
        return (
            f"<Product barcode={self.barcode} name={self.name} "
            f"shelf_id={self.shelf_id} shelf_code={self.shelf_code}>"
        )
