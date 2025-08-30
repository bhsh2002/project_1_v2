from typing import Any, List

from dev_kit.database.repository import (
    BaseRepository,
    handle_db_errors,
    PaginationResult,
)
from .models import Shelf
from ..markets.models import Market


class ShelfRepository(BaseRepository[Shelf]):
    def __init__(self, model: type[Shelf], db_session):
        super().__init__(model=model, db_session=db_session)

    @handle_db_errors
    def list_by_market_uuid(
        self, market_uuid: str, page: int, per_page: int
    ) -> PaginationResult[Shelf]:
        query = self._query().join(Market).filter(Market.uuid == market_uuid)

        total = query.count()
        items = query.offset((page - 1) * per_page).limit(per_page).all()
        total_pages = (total + per_page - 1) // per_page if total > 0 else 0

        return PaginationResult(
            items=items,
            total=total,
            page=page,
            per_page=per_page,
            total_pages=total_pages,
            has_next=page < total_pages,
            has_prev=page > 1,
        )

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
