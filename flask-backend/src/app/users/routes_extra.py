from apiflask import APIBlueprint

from dev_kit.modules.users.schemas import user_schemas as dk_user_schemas

from ..markets.schemas import MarketUsersPagination
from ..markets.services import market_service

users_extra_bp = APIBlueprint("users_extra", __name__, url_prefix="/users")


@users_extra_bp.get("/markets/<uuid:market_uuid>")
@users_extra_bp.input(dk_user_schemas["query"], location="query", arg_name="query_args")
@users_extra_bp.output(MarketUsersPagination)
@users_extra_bp.doc(summary="List Market Users (legacy path)")
def legacy_list_market_users(market_uuid, query_args):
    return market_service.list_market_users(str(market_uuid), query_args)
