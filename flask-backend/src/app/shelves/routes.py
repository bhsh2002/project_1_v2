from apiflask import APIBlueprint
from flask import Response, request
from flask_jwt_extended import get_jwt, verify_jwt_in_request

from dev_kit.web.routing import register_crud_routes

from .schemas import shelf_schemas
from .services import shelf_service

shelves_bp = APIBlueprint("shelf", __name__, url_prefix="/shelves")

# We are not using the standard list route from register_crud_routes
# because we need to filter by the market from the JWT.
register_crud_routes(
    bp=shelves_bp,
    service=shelf_service,
    schemas=shelf_schemas,
    entity_name="shelf",
    id_field="uuid",
    routes_config={
        "list": {"enabled": False},  # Disabled to be replaced by custom one
        "get": {"auth_required": True, "permission": "read:shelf"},
        "create": {"auth_required": True, "permission": "create:shelf"},
        "update": {"auth_required": True, "permission": "update:shelf"},
        "delete": {"auth_required": True, "permission": "delete:shelf"},
    },
)


@shelves_bp.get("/")
@shelves_bp.output(shelf_schemas["pagination_out"])
@shelves_bp.doc(summary="List shelves for the current user's market")
def list_market_shelves():
    verify_jwt_in_request()
    claims = get_jwt()
    market_uuid = claims.get("markets", [])[0]  # Get the first market of the user
    page = request.args.get("page", 1, type=int)
    per_page = request.args.get("per_page", 10, type=int)

    paginated_shelves = shelf_service.list_by_market_uuid(market_uuid, page, per_page)
    return paginated_shelves


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
