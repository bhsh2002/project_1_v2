from decimal import Decimal, InvalidOperation
from typing import Any, Dict

import pandas as pd

from dev_kit.services import BaseService
from dev_kit.database.extensions import db

from ..markets.services import market_service
from ..shelves.services import shelf_service
from .models import Product
from .repositories import ProductRepository


class ProductService(BaseService[Product]):
    def __init__(self):
        super().__init__(
            model=Product, db_session=db.session, repository_class=ProductRepository
        )

    def pre_create_hook(self, data: Dict[str, Any]) -> Dict[str, Any]:
        market_uuid = data.pop("market_uuid", None)
        if market_uuid:
            market = market_service.get_by_uuid(market_uuid)
            data["market_id"] = market.id

        shelf_code = data.pop("shelf_code", None)
        if shelf_code:
            shelf = shelf_service.get_by_code(shelf_code)
            if not shelf:
                shelf = shelf_service.create(
                    {"code": shelf_code, "market_id": market.id}
                )
            if shelf:
                data["shelf_id"] = shelf.id
        return data

    def pre_update_hook(self, instance: Product, data: Dict[str, Any]) -> None:
        market_uuid = data.pop("market_uuid", None)
        if market_uuid:
            market = market_service.get_by_uuid(market_uuid)
            data["market_id"] = market.id

        shelf_code = data.pop("shelf_code", None)
        if shelf_code:
            shelf = shelf_service.get_by_code(shelf_code)
            if not shelf:
                shelf = shelf_service.create(
                    {"code": shelf_code, "market_id": market.id}
                )
            if shelf:
                instance.shelf_id = shelf.id

        # Let the base hook handle the rest of the updates
        super().pre_update_hook(instance, data)

    def get_by_barcode(
        self, barcode_: Any, include_soft_deleted: bool = False
    ) -> Product | None:
        return self.repo.get_by_barcode(barcode_, include_soft_deleted)

    def get_by_market_uuid_and_barcode(
        self, market_uuid_: Any, barcode_: Any, include_soft_deleted: bool = False
    ) -> Product | None:
        return self.repo.get_by_market_uuid_and_barcode(
            market_uuid_, barcode_, include_soft_deleted
        )

    def process_bulk_file(
        self, market_id, file_storage, batch_size: int = 1000
    ) -> Dict[str, Any]:
        try:
            filename = file_storage.filename
            if filename.endswith(".csv"):
                df_iter = pd.read_csv(file_storage.stream, chunksize=batch_size)
            elif filename.endswith((".xls", ".xlsx")):
                df = pd.read_excel(file_storage.stream)
                df_iter = [df]
            else:
                raise ValueError(
                    "Unsupported file type. Please upload a CSV or Excel file."
                )

            created_count = 0
            updated_count = 0
            errors = []

            for chunk_index, df in enumerate(df_iter, start=1):
                df.columns = df.columns.str.lower().str.strip()

                required_headers = {"barcode", "name", "price"}
                if not required_headers.issubset(df.columns):
                    missing = required_headers - set(df.columns)
                    raise ValueError(
                        f"File is missing required columns: {', '.join(missing)}"
                    )

                rows = df.to_dict(orient="records")

                barcodes_from_file = [
                    str(row["barcode"]) for row in rows if pd.notna(row.get("barcode"))
                ]
                existing_products_list = self.repo.get_many_by_barcodes(
                    barcodes_from_file
                )
                existing_products_map = {p.barcode: p for p in existing_products_list}

                batch_to_create = []
                batch_to_update = []

                for i, row in enumerate(rows):
                    row_num = i + 2 + (chunk_index - 1) * batch_size
                    try:
                        barcode = str(row.get("barcode"))
                        if not barcode or pd.isna(row.get("barcode")):
                            raise ValueError("barcode is required and cannot be empty.")

                        product_data = {
                            "barcode": barcode,
                            "name": row.get("name"),
                            "price": Decimal(row.get("price")),
                            "stock_quantity": int(row.get("stock_quantity", 1)),
                            "description": row.get("description", ""),
                            "market_id": row.get("market_id", market_id),
                            "shelf_code": str(row.get("shelf_code", "null")),
                            "image_processing_status": "NOIMAGE",
                        }

                        if pd.isna(product_data["name"]):
                            raise ValueError("name is required.")

                        shelf = {"id": 8}
                        if shelf is None:
                            shelf = shelf_service.create(
                                {
                                    "code": product_data["shelf_code"],
                                    "market_id": market_id,
                                }
                            )
                        if shelf:
                            product_data["shelf_id"] = shelf.id

                        if barcode in existing_products_map:
                            # تحديث
                            product_to_update = existing_products_map[barcode]
                            product_data["id"] = product_to_update.id
                            batch_to_update.append(product_data)
                        else:
                            # إنشاء
                            batch_to_create.append(product_data)

                    except (ValueError, InvalidOperation, TypeError) as e:
                        errors.append({"row_number": row_num, "error_message": str(e)})
                    except Exception as e:
                        errors.append(
                            {
                                "row_number": row_num,
                                "error_message": f"Unexpected error: {e}",
                            }
                        )

                try:
                    if batch_to_create:
                        self._db_session.bulk_insert_mappings(Product, batch_to_create)
                        created_count += len(batch_to_create)

                    if batch_to_update:
                        self._db_session.bulk_update_mappings(Product, batch_to_update)
                        updated_count += len(batch_to_update)

                    self._db_session.commit()
                except Exception as e:
                    self._db_session.rollback()
                    errors.append(
                        {
                            "row_number": -1,
                            "error_message": f"Database error: {e}",
                        }
                    )

            return {
                "message": "Bulk operation completed.",
                "created_count": created_count,
                "updated_count": updated_count,
                "errors_count": len(errors),
                "errors": errors,
            }

        except Exception:
            self._db_session.rollback()
            raise
