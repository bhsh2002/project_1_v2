from dev_kit.database.extensions import db
from ..markets.models import Market
from ..products.models import Product
from ..shelves.models import Shelf
from dev_kit.modules.users.models import User

class AdminService:
    def get_dashboard_data(self):
        total_markets = db.session.query(Market).count()
        total_users = db.session.query(User).count()
        total_products = db.session.query(Product).count()
        total_shelves = db.session.query(Shelf).count()

        recent_markets = db.session.query(Market).order_by(Market.created_at.desc()).limit(5).all()

        return {
            "stats": {
                "total_markets": total_markets,
                "total_users": total_users,
                "total_products": total_products,
                "total_shelves": total_shelves,
            },
            "recent_markets": recent_markets
        }
