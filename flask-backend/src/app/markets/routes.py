from apiflask import APIBlueprint

from dev_kit.web.routing import register_crud_routes
from dev_kit.modules.users.schemas import user_schemas as dk_user_schemas
from dev_kit.web.decorators import permission_required

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
        "create": {"enabled": False},
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


@markets_bp.post("/markets")
@markets_bp.input(market_schemas["input_with_owner"])
@markets_bp.output(market_schemas["main"], status_code=201)
@markets_bp.doc(summary="Create a new market with an owner")
@permission_required("create:market")
def create_market_with_owner(json_data):
    owner_data = json_data.get("owner_username", None) + json_data.get(
        "owner_password", None
    )
    if not owner_data:
        new = market_service.create(json_data)
    else:
        new = market_service.create_market_with_owner(json_data)
    return new
