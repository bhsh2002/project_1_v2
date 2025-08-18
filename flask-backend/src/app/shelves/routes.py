from apiflask import APIBlueprint
from flask import Response

from dev_kit.web.routing import register_crud_routes

from .schemas import shelf_schemas
from .services import shelf_service

shelves_bp = APIBlueprint("shelf", __name__, url_prefix="/shelves")

register_crud_routes(
    bp=shelves_bp,
    service=shelf_service,
    schemas=shelf_schemas,
    entity_name="shelf",
    id_field="uuid",
    routes_config={
        "list": {"auth_required": True, "permission": "read:shelf"},
        "get": {"auth_required": True, "permission": "read:shelf"},
        "create": {"auth_required": True, "permission": "create:shelf"},
        "update": {"auth_required": True, "permission": "update:shelf"},
        "delete": {"auth_required": True, "permission": "delete:shelf"},
    },
)


@shelves_bp.get("/download/csv/market/<int:market_id>")
@shelves_bp.doc(summary="Download shelves for a specific market as a CSV file")
def download_market_shelves_csv(market_id: int):
    csv_data = shelf_service.to_csv_by_market(market_id=market_id)
    return Response(
        csv_data,
        mimetype="text/csv",
        headers={
            "Content-disposition": (
                f"attachment; filename=shelves_market_{market_id}.csv"
            )
        },
    )
