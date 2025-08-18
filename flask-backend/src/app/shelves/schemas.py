from dev_kit.web.schemas import create_crud_schemas
from .models import Shelf

shelf_schemas = create_crud_schemas(
    model_class=Shelf,
)
