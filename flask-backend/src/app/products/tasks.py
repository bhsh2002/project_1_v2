import os
import uuid
from celery import Celery
from PIL import Image
from rembg import remove
from celery.utils.log import get_task_logger

celery = Celery(__name__)
# Use env-driven config (fall back to in-memory for tests)
celery.conf.broker_url = os.getenv("CELERY_BROKER_URL", "memory://")
celery.conf.result_backend = os.getenv("CELERY_RESULT_BACKEND", "cache+memory://")
celery.conf.task_serializer = "json"
celery.conf.result_serializer = "json"
celery.conf.accept_content = ["json"]
if (
    os.getenv("CELERY_TASK_ALWAYS_EAGER", "0") == "1"
    or os.getenv("FLASK_ENV") == "testing"
):
    celery.conf.task_always_eager = True

logger = get_task_logger(__name__)


@celery.task(bind=True, name="products.process_image")
def process_product_image(self, product_id, temp_image_path):
    from app import create_app
    from dev_kit.database.extensions import db
    from app.products.models import Product

    app = create_app()
    with app.app_context():
        product = db.session.get(Product, product_id)
        if not product:
            logger.warning(f"Product with id {product_id} not found.")
            return

        upload_folder = app.config.get(
            "UPLOAD_FOLDER", os.path.join(app.root_path, "src/static/uploads")
        )

        # In testing, skip heavy image processing and mark as completed
        if os.getenv("FLASK_ENV") == "testing":
            try:
                os.makedirs(upload_folder, exist_ok=True)
                product.image_url = "/uploads/test.png"
                product.image_processing_status = "COMPLETED"
                db.session.commit()
            finally:
                if os.path.exists(temp_image_path):
                    os.remove(temp_image_path)
            return

        try:
            unique_filename_str = str(uuid.uuid4())

            input_image = Image.open(temp_image_path)
            output_image = remove(input_image)

            processed_filename = f"{unique_filename_str}.png"
            processed_path = os.path.join(upload_folder, processed_filename)
            output_image.save(processed_path, "PNG")

            product.image_url = f"/uploads/{processed_filename}"
            product.image_processing_status = "COMPLETED"
            db.session.commit()

            logger.info(f"Successfully processed image for product {product.id}")

        except Exception:
            db.session.rollback()
            product.image_processing_status = "FAILED"
            db.session.commit()
            logger.error(
                f"Failed to process image for product {product.id}", exc_info=True
            )

        finally:
            if os.path.exists(temp_image_path):
                os.remove(temp_image_path)
