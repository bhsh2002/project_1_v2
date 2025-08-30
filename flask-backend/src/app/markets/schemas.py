from dev_kit.web.schemas import create_crud_schemas, create_pagination_schema
from dev_kit.modules.users.schemas import user_schemas as dk_user_schemas
from .models import Market
from apiflask.fields import String, Integer
from apiflask import Schema

market_schemas = create_crud_schemas(
    model_class=Market,
    query_schema_fields=["name"],
)

# Pagination schema for listing market users
MarketUsersPagination = create_pagination_schema(dk_user_schemas["main"])


class MarketWithOwnerSchema(market_schemas["input"]):
    owner_username = String(
        required=False, metadata={"description": "User ID of the market owner."}
    )
    owner_password = String(
        required=False,
        load_only=True,
        metadata={"description": "Password for the market owner."},
    )


market_schemas["input_with_owner"] = MarketWithOwnerSchema


class MarketDashboardStatsSchema(Schema):
    total_products = Integer(required=True)
    total_shelves = Integer(required=True)


market_schemas["dashboard_stats"] = MarketDashboardStatsSchema
