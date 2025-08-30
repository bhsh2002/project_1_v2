from dev_kit.web.schemas import create_crud_schemas, create_pagination_schema
from .models import Shelf

shelf_schemas = create_crud_schemas(
    model_class=Shelf,
)

MarketShelvesPagination = create_pagination_schema(shelf_schemas["main"])

shelf_schemas["pagination"] = MarketShelvesPagination
