from typing import Any, List

from dev_kit.database.repository import BaseRepository, handle_db_errors
from .models import Product
from ..shelves.models import Shelf
from ..markets.models import Market


class ProductRepository(BaseRepository[Product]):
    def __init__(self, model: type[Product], db_session):
        super().__init__(model=model, db_session=db_session)

    @handle_db_errors
    def get_by_barcode(
        self, barcode_: Any, include_soft_deleted: bool = False
    ) -> Product | None:
        query = self._query().filter(self.model.barcode == barcode_)
        query = self._filter_soft_deleted(query, include_soft_deleted)
        return query.first()

    @handle_db_errors
    def get_by_market_uuid_and_barcode(
        self, market_uuid_: Any, barcode_: Any, include_soft_deleted: bool = False
    ) -> Product | None:
        query = (
            self._query()
            .join(Product.shelf)  # join Shelf
            .join(Shelf.market)  # join Market
            .filter(Market.uuid == market_uuid_)
            .filter(Product.barcode == barcode_)
        )
        query = self._filter_soft_deleted(query, include_soft_deleted)
        return query.first()

    @handle_db_errors
    def get_many_by_barcodes(self, barcodes: List[str]) -> List[Product]:
        if not barcodes:
            return []
        query = self._query().filter(self.model.barcode.in_(barcodes))
        return query.all()
