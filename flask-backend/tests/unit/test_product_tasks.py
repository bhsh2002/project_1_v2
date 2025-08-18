import os
from pathlib import Path
import pytest
from sqlalchemy import select

from app.products.models import Product
from app.products.tasks import process_product_image
from dev_kit.database.extensions import db

# Import the original create_app function so we can monkeypatch it
from app import create_app as original_create_app


@pytest.fixture
def mock_celery_task_app(monkeypatch, app):
    """Moneypatches the create_app function used by celery tasks to return the test app."""

    def get_test_app(*args, **kwargs):
        return app

    monkeypatch.setattr("app.products.tasks.create_app", get_test_app)


def test_process_product_image_task(app, mock_celery_task_app):
    """Unit test for the image processing Celery task."""
    # 1. Setup: Create a product and a temporary file
    with app.app_context():
        from app.shelves.models import Shelf

        shelf = db.session.execute(select(Shelf)).first()
        if not shelf:
            shelf_obj = Shelf(name="Test Shelf", market_id=1, code="T1")
            db.session.add(shelf_obj)
            db.session.commit()
            shelf_id = shelf_obj.id
        else:
            shelf_id = shelf[0].id

        product = Product(
            name="Task Test Product",
            barcode="task-test-123",
            price=1.00,
            shelf_id=shelf_id,
            image_processing_status="PENDING",
        )
        db.session.add(product)
        db.session.commit()
        product_id = product.id

    temp_dir = Path("/tmp")
    temp_dir.mkdir(exist_ok=True)
    temp_file = temp_dir / "test_image.tmp"
    temp_file.write_text("fake-image-data")
    assert temp_file.exists()

    # 2. Execute the task directly (runs synchronously due to test config)
    process_product_image.s(product_id, str(temp_file)).apply()

    # 3. Assertions: Verify the outcome
    with app.app_context():
        updated_product = db.session.get(Product, product_id)
        assert updated_product is not None
        assert updated_product.image_url == "/uploads/test.png"
        assert updated_product.image_processing_status == "COMPLETED"

    assert not temp_file.exists(), "Temporary file should be cleaned up"
