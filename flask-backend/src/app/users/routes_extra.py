from apiflask import APIBlueprint

from dev_kit.modules.users.schemas import user_schemas, LoginSchema, AuthTokenSchema

from ..markets.schemas import MarketUsersPagination
from ..markets.services import market_service

from .services_extra import user_service_extra

from flask import jsonify, make_response
# from flask_jwt_extended import (
#     set_access_cookies,
#     set_refresh_cookies,
# )

users_extra_bp = APIBlueprint("users_extra", __name__, url_prefix="/users")


@users_extra_bp.get("/markets/<uuid:market_uuid>")
@users_extra_bp.input(user_schemas["query"], location="query", arg_name="query_args")
@users_extra_bp.output(MarketUsersPagination)
@users_extra_bp.doc(summary="List Market Users (legacy path)")
def legacy_list_market_users(market_uuid, query_args):
    return market_service.list_market_users(str(market_uuid), query_args)


@users_extra_bp.post("/login/market")
@users_extra_bp.input(LoginSchema)
@users_extra_bp.output(AuthTokenSchema)
@users_extra_bp.doc(summary="User Login")
def login(json_data):
    user, market_uuid, access_token, refresh_token = (
        user_service_extra.login_market_user(
            username=json_data["username"], password=json_data["password"]
        )
    )
    user_data = user_schemas["main"]().dump(user)
    resp = make_response(
        jsonify(
            {
                "user": user_data,
                "market_uuid": market_uuid,
                "access_token": access_token,
                "refresh_token": refresh_token,
            }
        )
    )
    # set_access_cookies(resp, access_token)
    # set_refresh_cookies(resp, refresh_token)
    return resp
