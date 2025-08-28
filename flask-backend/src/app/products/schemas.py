from dev_kit.web.schemas import create_crud_schemas
from apiflask import Schema
from apiflask.fields import File, String, Integer, Decimal, List, Nested

from .models import Product


product_schemas = create_crud_schemas(
    model_class=Product,
    query_schema_fields=["name", "barcode"],
    custom_fields={"shelf_code": String(required=True)},
    exclude_from_main=["shelf_id"],
    exclude_from_input=[
        "id",
        "uuid",
        "created_at",
        "updated_at",
        "deleted_at",
        "image_url",
        "image_processing_status",
        "shelf_id",
    ],
    exclude_from_update=[
        "id",
        "uuid",
        "created_at",
        "updated_at",
        "deleted_at",
        "shelf_id",
    ],
)


class ProductWithImageSchema(product_schemas["input"]):
    image = File(required=False, metadata={"description": "An image file"})


class ProductUpdateSchema(product_schemas["input"]):
    name = String()
    barcode = String()
    description = String()
    price = Decimal()
    stock_quantity = Integer()
    shelf_id = Integer()
    image = File(
        required=False,
        metadata={"description": "An optional new image file to replace the old one."},
    )

    class Meta:
        partial = True


product_schemas["update"] = ProductUpdateSchema


class RowErrorSchema(Schema):
    row_number = Integer()
    error_message = String()


class BulkUploadSchema(Schema):
    product_file = File(required=True, metadata={"description": "CSV or Excel file."})


class BulkUploadResponseSchema(Schema):
    message = String()
    created_count = Integer()
    updated_count = Integer()
    errors_count = Integer()
    errors = List(Nested(RowErrorSchema))
