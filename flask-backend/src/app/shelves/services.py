import io
from typing import Any

import pandas as pd

from dev_kit.services import BaseService
from dev_kit.database.extensions import db

from .models import Shelf
from .repositories import ShelfRepository


class ShelfService(BaseService[Shelf]):
    def __init__(self):
        super().__init__(
            model=Shelf, db_session=db.session, repository_class=ShelfRepository
        )

    def get_by_code(
        self, code_: Any, include_soft_deleted: bool = False
    ) -> Shelf | None:
        return self.repo.get_by_code(code_, include_soft_deleted)

    def to_csv_by_market(self, market_id: int) -> str:
        from flask import current_app

        base_url = current_app.config.get("PUBLIC_BASE_URL", "http://localhost:5000")
        shelves = self.repo.get_all_by_market(market_id=market_id)
        data = [
            {
                "Type": "Link",
                "Content": f"{base_url}/api/v1/shelves/{str(shelf.uuid)}",
                "URI": "URL",
                "Description": shelf.code,
                "counter": "no",
                "UIDmirror": "no",
                "counter_mirror": "no",
            }
            for shelf in shelves
        ]
        if not data:
            return ""
        df = pd.DataFrame(
            data,
            columns=[
                "Type",
                "Content",
                "URI",
                "Description",
                "counter",
                "UIDmirror",
                "counter_mirror",
            ],
        )
        output = io.StringIO()
        df.to_csv(output, index=False)
        return output.getvalue()


shelf_service = ShelfService()
