from typing import Any, Dict

from dev_kit.services import BaseService
from dev_kit.database.extensions import db

from .models import Market
from .repositories import MarketRepository


class MarketService(BaseService[Market]):
    def __init__(self):
        super().__init__(
            model=Market, db_session=db.session, repository_class=MarketRepository
        )

    def list_market_users(self, market_uuid: str, query_args: Dict[str, Any]):
        page = query_args.get("page", 1)
        per_page = query_args.get("per_page", 10)
        return self.repo.list_market_users(market_uuid, page=page, per_page=per_page)


market_service = MarketService()
