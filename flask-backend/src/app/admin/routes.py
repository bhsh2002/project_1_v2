from apiflask import APIBlueprint
from flask_jwt_extended import verify_jwt_in_request, get_jwt
from werkzeug.exceptions import Forbidden

from .services import AdminService
from .schemas import AdminDashboardResponseSchema

admin_bp = APIBlueprint('admin', __name__, url_prefix='/admin')
admin_service = AdminService()

@admin_bp.get('/dashboard')
@admin_bp.output(AdminDashboardResponseSchema)
@admin_bp.doc(summary="Get statistics for the admin dashboard")
def get_dashboard_data():
    verify_jwt_in_request()
    claims = get_jwt()
    # A simple role check; for more complex scenarios, a dedicated decorator is better.
    if "admin" not in claims.get("roles", []):
        raise Forbidden("Admins only.")
    return admin_service.get_dashboard_data()
