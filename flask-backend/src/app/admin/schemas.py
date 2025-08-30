from apiflask import Schema
from apiflask.fields import Integer, List, Nested, String, DateTime
from ..markets.schemas import market_schemas

class AdminDashboardStatsSchema(Schema):
    total_markets = Integer(required=True)
    total_users = Integer(required=True)
    total_products = Integer(required=True)
    total_shelves = Integer(required=True)

class RecentActivitySchema(Schema):
    action = String(required=True)
    timestamp = DateTime(required=True)

class AdminDashboardResponseSchema(Schema):
    stats = Nested(AdminDashboardStatsSchema)
    recent_markets = List(Nested(market_schemas["main"]))
