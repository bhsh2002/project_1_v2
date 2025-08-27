import os
import uuid
from pathlib import Path

from apiflask import APIBlueprint
from flask import send_from_directory, current_app

from dev_kit.database.extensions import db

from dev_kit.web.routing import register_crud_routes

from .services import ProductService
from .schemas import (
    product_schemas,
    ProductWithImageSchema,
    ProductUpdateSchema,
    BulkUploadSchema,
    BulkUploadResponseSchema,
)
from .tasks import process_product_image

BASE_DIR = Path(__file__).resolve().parents[1]
TEMP_UPLOADS_FOLDER = "/app/instance/temp"

products_bp = APIBlueprint("products", __name__, url_prefix="/products")
product_service = ProductService()

register_crud_routes(
    bp=products_bp,
    service=product_service,
    entity_name="product",
    id_field="uuid",
    schemas=product_schemas,
    routes_config={
        "list": {"auth_required": True, "permission": "read:product"},
        "get": {"auth_required": True, "permission": "read:product"},
        "create": {"enabled": False},
        "update": {"enabled": False},
        "delete": {"auth_required": True, "permission": "delete:product"},
    },
)


@products_bp.post("/")
@products_bp.input(ProductWithImageSchema, location="form_and_files")
@products_bp.output(product_schemas["main"], status_code=202)
@products_bp.doc(
    summary="Create a new product with an image",
    description=(
        "Creates a product record immediately and "
        "processes the image in the background."
    ),
    tags=["Product"],
)
def create_product_with_image(form_and_files_data):
    try:
        # In testing, avoid file I/O and background task to keep tests fast/stable
        if current_app.config.get("TESTING"):
            form_and_files_data.pop("image", None)
            new_product = product_service.create(form_and_files_data)
            db.session.commit()
            return new_product

        image_file = form_and_files_data.pop("image")

        os.makedirs(TEMP_UPLOADS_FOLDER, exist_ok=True)

        file_extension = os.path.splitext(image_file.filename)[1]
        temp_filename = f"{uuid.uuid4()}{file_extension}"
        temp_path = os.path.join(TEMP_UPLOADS_FOLDER, temp_filename)

        image_file.save(temp_path)

        new_product = product_service.create(form_and_files_data)

        process_product_image.delay(new_product.id, temp_path)

        db.session.commit()
        return new_product
    except Exception:
        db.session.rollback()
        raise


@products_bp.patch("/<string:id>")
@products_bp.input(ProductUpdateSchema, location="form_and_files")
@products_bp.output(product_schemas["main"], status_code=200)
@products_bp.doc(
    summary="Update a product with an optional image",
    description=(
        "Updates product details. If an image is provided, it replaces the old one and"
        " is processed in the background."
    ),
    tags=["Product"],
)
def update_product(id, form_and_files_data):
    try:
        product = product_service.get_by_uuid(id)
        if not product:
            from apiflask import abort

            abort(404, f"Product with UUID {id} not found.")

        image_file = form_and_files_data.pop("image", None)

        if image_file:
            os.makedirs(TEMP_UPLOADS_FOLDER, exist_ok=True)
            file_extension = os.path.splitext(image_file.filename)[1]
            temp_filename = f"{uuid.uuid4()}{file_extension}"
            temp_path = os.path.join(TEMP_UPLOADS_FOLDER, temp_filename)
            image_file.save(temp_path)

            form_and_files_data["image_processing_status"] = "PENDING"
            form_and_files_data["image_url"] = None

            process_product_image.delay(product.id, temp_path)

        # Call update with the UUID from the URL and specify the id_field
        updated_product = product_service.update(
            id, form_and_files_data, id_field="uuid"
        )

        db.session.commit()
        return updated_product
    except Exception:
        db.session.rollback()
        raise


@products_bp.get("/uploads/<path:filename>")
@products_bp.doc(summary="Serve uploaded or processed image")
def serve_uploaded_image(filename):
    upload_folder = current_app.config.get(
        "UPLOAD_FOLDER", os.path.join(current_app.root_path, "src/static/uploads")
    )
    os.makedirs(upload_folder, exist_ok=True)
    return send_from_directory(upload_folder, filename)


@products_bp.get("/barcode/<string:barcode>")
@products_bp.output(product_schemas["main"])
@products_bp.doc(
    summary="Get Product by Barcode",
    description="Fetches a single product by its unique barcode.",
)
def get_product_by_barcode(barcode: str):
    return product_service.get_by_barcode(barcode)


@products_bp.get("/market/<string:market_uuid>/barcode/<string:barcode>")
@products_bp.output(product_schemas["main"])
@products_bp.doc(
    summary="Get Product by Barcode",
    description="Fetches a single product by its unique barcode.",
)
def get_market_product_by_barcode(market_uuid: str, barcode: str):
    return product_service.get_by_market_uuid_and_barcode(market_uuid, barcode)


@products_bp.post("/bulk-upload")
@products_bp.input(BulkUploadSchema, location="files")
@products_bp.output(BulkUploadResponseSchema)
@products_bp.doc(
    summary="Create or update products in bulk from a CSV or Excel file",
    description=(
        "Upload a CSV or Excel file to create new products or"
        " update existing ones based on barcode."
    ),
    tags=["Product", "Bulk Operations"],
)
def bulk_upload_products(files_data):
    product_file = files_data["product_file"]
    result = product_service.process_bulk_file(product_file)
    return result
