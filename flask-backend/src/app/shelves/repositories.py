from typing import Any, List

from dev_kit.database.repository import BaseRepository, handle_db_errors
from .models import Shelf


class ShelfRepository(BaseRepository[Shelf]):
    def __init__(self, model: type[Shelf], db_session):
        super().__init__(model=model, db_session=db_session)

    @handle_db_errors
    def get_by_code(
        self, code_: Any, include_soft_deleted: bool = False
    ) -> Shelf | None:
        query = self._query().filter(self.model.code == code_)
        query = self._filter_soft_deleted(query, include_soft_deleted)
        return query.first()

    @handle_db_errors
    def get_all_by_market(
        self, market_id: int, include_soft_deleted: bool = False
    ) -> List[Shelf]:
        query = self._query().filter(self.model.market_id == market_id)
        query = self._filter_soft_deleted(query, include_soft_deleted)
        return query.all()
