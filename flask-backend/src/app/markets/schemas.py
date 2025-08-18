from dev_kit.web.schemas import create_crud_schemas, create_pagination_schema
from dev_kit.modules.users.schemas import user_schemas as dk_user_schemas
from .models import Market

market_schemas = create_crud_schemas(
    model_class=Market,
    query_schema_fields=["name"],
)

# Pagination schema for listing market users
MarketUsersPagination = create_pagination_schema(dk_user_schemas["main"])
