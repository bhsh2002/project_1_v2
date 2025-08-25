from apiflask import APIBlueprint

from dev_kit.web.routing import register_crud_routes
from dev_kit.modules.users.schemas import user_schemas as dk_user_schemas

from .schemas import market_schemas, MarketUsersPagination
from .services import MarketService

markets_bp = APIBlueprint("market", __name__, url_prefix="/markets")
market_service = MarketService()

register_crud_routes(
    bp=markets_bp,
    service=market_service,
    schemas=market_schemas,
    entity_name="market",
    id_field="uuid",
    routes_config={
        "list": {"auth_required": True, "permission": "read:market"},
        "get": {"auth_required": True, "permission": "read:market"},
        "create": {"auth_required": True, "permission": "create:market"},
        "update": {"auth_required": True, "permission": "update:market"},
        "delete": {"auth_required": True, "permission": "delete:market"},
    },
)


@markets_bp.get("/<uuid:market_uuid>/users")
@markets_bp.input(dk_user_schemas["query"], location="query", arg_name="query_args")
@markets_bp.output(MarketUsersPagination)
@markets_bp.doc(summary="List users for a market")
def list_market_users(market_uuid, query_args):
    return market_service.list_market_users(str(market_uuid), query_args)
