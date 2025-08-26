from dev_kit.database.repository import (
    BaseRepository,
    PaginationResult,
    handle_db_errors,
)
from .models import Market, MarketUsers
from dev_kit.modules.users.models import User


class MarketRepository(BaseRepository[Market]):
    def __init__(self, model: type[Market], db_session):
        super().__init__(model=model, db_session=db_session)

    @handle_db_errors
    def list_market_users(
        self, market_uuid: str, *, page: int = 1, per_page: int = 10
    ) -> PaginationResult[User]:
        """Paginated users for a given market UUID."""
        market = (
            self._db_session.query(Market).filter(Market.uuid == market_uuid).first()
        )
        if not market:
            return PaginationResult(
                items=[],
                total=0,
                page=page,
                per_page=per_page,
                total_pages=0,
                has_next=False,
                has_prev=False,
            )

        # Perform a manual join on user id without a declared FK
        query = self._db_session.query(User).filter(
            User.id.in_(
                self._db_session.query(MarketUsers.user_id).filter(
                    MarketUsers.market_id == market.id
                )
            )
        )

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
    def create_market_owner(self, market_id: int, user_id: int) -> MarketUsers:
        """Create a market owner user and associate with the market."""

        market_user = MarketUsers(market_id=market_id, user_id=user_id)
        self._db_session.add(market_user)

        return market_user
