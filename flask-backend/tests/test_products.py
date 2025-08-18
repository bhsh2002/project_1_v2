import pytest
from io import BytesIO
import pandas as pd
from dev_kit.database.extensions import db
from sqlalchemy.sql import select


@pytest.fixture
def product_factory(client, admin_cookies):
    """A factory to create products for testing, returns the product's UUID."""

    def _factory(barcode="111111", name="Factory Product", shelf_code="A-1", price=1):
        headers = {"Cookie": "; ".join(admin_cookies)}
        data = {
            "name": name,
            "barcode": barcode,
            "price": price,
            "stock_quantity": 1,
            "shelf_code": shelf_code,
        }
        resp = client.post(
            "/api/v1/products/",
            json=data,
            headers=headers,
        )
        assert resp.status_code == 201, "Product factory failed to create product"
        return resp.get_json()["uuid"]

    return _factory


def test_create_product_unauthorized(client):
    """Test that creating a product requires authentication."""
    # Send json={} to ensure correct content-type for a 401, otherwise may get 422 first
    resp = client.post(
        "/api/v1/products/",
        json={
            "name": "Unauthorized Product",
            "barcode": "123456",
            "price": 1,
            "stock_quantity": 1,
            "shelf_code": "null",
        },
    )
    assert resp.status_code == 401


def test_create_product_validation_error(client, admin_cookies):
    """Test that creating a product with missing data returns a validation error."""
    headers = {"Cookie": "; ".join(admin_cookies)}
    data = {"name": "Incomplete Product"}  # Missing barcode, price, etc.
    resp = client.post("/api/v1/products/", json=data, headers=headers)
    assert resp.status_code == 422
    # Correctly access the validation error details from APIFlask
    errors = resp.get_json()["detail"]["json"]
    assert "barcode" in errors
    assert "price" in errors


def test_get_product_not_found(client, admin_cookies):
    """Test that getting a non-existent product returns a 404."""
    headers = {"Cookie": "; ".join(admin_cookies)}
    fake_uuid = "00000000-0000-0000-0000-000000000000"
    resp = client.get(f"/api/v1/products/{fake_uuid}/", headers=headers)
    assert resp.status_code == 404


def test_update_product(client, admin_cookies, product_factory):
    """Test updating a product's name and price."""
    product_uuid = product_factory(barcode="222222", name="Original Name")
    headers = {"Cookie": "; ".join(admin_cookies)}
    update_data = {"name": "Updated Name", "price": "99.99", "shelf_code": "A-1"}

    # Use json= to send application/json for non-multipart updates
    resp = client.patch(
        f"/api/v1/products/{product_uuid}", json=update_data, headers=headers
    )
    assert resp.status_code == 200
    out = resp.get_json()
    assert out["name"] == "Updated Name"
    assert out["price"] == "99.99"


def test_update_product_with_new_image(client, admin_cookies, product_factory):
    """Test that updating a product with a new image sets its status to PENDING."""
    product_uuid = product_factory(barcode="333333")
    headers = {"Cookie": "; ".join(admin_cookies)}
    update_data = {
        "name": "Product with new image",
        "shelf_code": "A-1",
        "image": (BytesIO(b"new-image"), "new.png"),
    }
    resp = client.patch(
        f"/api/v1/products/{product_uuid}",
        content_type="multipart/form-data",
        data=update_data,
        headers=headers,
    )
    print("DEBUG:", resp.get_json())
    assert resp.status_code == 200
    out = resp.get_json()
    assert out["name"] == "Product with new image"
    assert out["image_processing_status"] == "PENDING"


# def test_delete_product(client, admin_cookies, product_factory):
#     """Test deleting a product."""
#     product_uuid = product_factory(barcode="444444")
#     headers = {"Cookie": "; ".join(admin_cookies)}

#     # Delete it
#     resp = client.delete(f"/api/v1/products/{product_uuid}", headers=headers)
#     assert resp.status_code == 200

#     # Verify it's gone
#     resp = client.get(f"/api/v1/products/{product_uuid}", headers=headers)
#     assert resp.status_code == 404


# def test_list_products_with_filter_and_pagination(client, admin_cookies):
#     """Test listing products with filters and pagination."""
#     # product_factory(barcode="555555", name="Filter Test Product A")
#     # product_factory(barcode="666666", name="Filter Test Product B")
#     headers = {"Cookie": "; ".join(admin_cookies)}

#     # Test filtering - note the trailing slash to avoid redirects
#     resp = client.get("/api/v1/products/", headers=headers)
#     print(resp.get_data(as_text=True))  # Debugging output
#     assert resp.status_code == 200
#     data = resp.get_json()
#     assert data["total"] == 1
#     assert data["items"][0]["name"] == "Filter Test Product A"

#     # Test pagination
#     resp = client.get("/api/v1/products/?per_page=1&page=2", headers=headers)
#     assert resp.status_code == 200
#     data = resp.get_json()
#     assert len(data["items"]) == 1
#     assert data["page"] == 2


# def test_bulk_upload_with_mixed_results(client, admin_cookies, product_factory):
#     """Test bulk upload with a mix of creates, updates, and errors."""
#     # 1. Create a product that we will update
#     product_factory(barcode="777777", name="Product to be updated")

#     # 2. Prepare a CSV file in memory
#     csv_data = {
#         "barcode": ["777777", "888888", "999999"],
#         "name": ["Updated via Bulk", "New via Bulk", ""],  # 3rd row has an error
#         "price": ["15.00", "25.00", "35.00"],
#         "shelf_code": ["A-1", "B-2", "C-3"],
#     }
#     df = pd.DataFrame(csv_data)
#     csv_file = BytesIO(df.to_csv(index=False).encode("utf-8"))

#     # 3. Perform the bulk upload
#     headers = {"Cookie": "; ".join(admin_cookies)}
#     data = {"product_file": (csv_file, "bulk.csv")}
#     resp = client.post(
#         "/api/v1/products/bulk-upload",
#         content_type="multipart/form-data",
#         data=data,
#         headers=headers,
#     )

#     # 4. Assert the results
#     assert resp.status_code == 200
#     out = resp.get_json()
#     assert out["created_count"] == 1
#     assert out["updated_count"] == 1
#     assert out["errors_count"] == 1
#     assert out["errors"][0]["row_number"] == 4  # Row 2 in data + 2 header/offset
#     assert "name and shelf_code are required" in out["errors"][0]["error_message"]

#     # 5. Verify the update in the database
#     db_product = db.session.execute(
#         select(Product).filter_by(barcode="777777")
#     ).scalar_one()
#     assert db_product is not None
#     assert db_product.name == "Updated via Bulk"

#     # 6. Verify the creation in the database
#     db_product_new = db.session.execute(
#         select(Product).filter_by(barcode="888888")
#     ).scalar_one()
#     assert db_product_new is not None
#     assert db_product_new.name == "New via Bulk"
