from apiflask import APIBlueprint
from flask import send_file, request
import qrcode
from reportlab.lib.pagesizes import A4
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from io import BytesIO

from dev_kit.web.routing import register_crud_routes
from dev_kit.modules.users.schemas import user_schemas as dk_user_schemas
from dev_kit.web.decorators import permission_required
from dev_kit.database.extensions import db

from .schemas import market_schemas, MarketUsersPagination
from .services import MarketService

markets_bp = APIBlueprint("market", __name__, url_prefix="/markets")
market_service = MarketService()


@markets_bp.get("/<uuid:market_uuid>/dashboard")
@markets_bp.output({}, status_code=200)  # Define a schema later
@markets_bp.doc(summary="Get dashboard stats for a market")
@permission_required("read:market")
def get_dashboard_stats(market_uuid):
    stats = market_service.get_dashboard_stats(str(market_uuid))
    return stats, 200


register_crud_routes(
    bp=markets_bp,
    service=market_service,
    schemas=market_schemas,
    entity_name="market",
    id_field="uuid",
    routes_config={
        "list": {"auth_required": True, "permission": "read:market"},
        "get": {"auth_required": True, "permission": "read:market"},
        "create": {"enabled": False},
        "update": {"auth_required": True, "permission": "update:market"},
        "delete": {"auth_required": True, "permission": "delete:market"},
    },
)


@markets_bp.get("/<uuid:market_uuid>/users")
@markets_bp.input(dk_user_schemas["query"], location="query", arg_name="query_args")
@markets_bp.output(MarketUsersPagination)
@markets_bp.doc(summary="List users for a market")
def list_market_users(market_uuid, query_args):
    return market_service.list_market_users(str(market_uuid), query_args), 200


@markets_bp.post("/")
@markets_bp.input(market_schemas["input_with_owner"])
@markets_bp.output(market_schemas["main"], status_code=201)
@markets_bp.doc(summary="Create a new market with an owner")
@permission_required("create:market")
def create_market_with_owner(json_data):
    owner_username = json_data.get("owner_username")
    owner_password = json_data.get("owner_password")

    if owner_username and owner_password:
        new = market_service.create_market_with_owner(json_data)
    else:
        new = market_service.create(json_data)

    db.session.commit()
    return new


@markets_bp.route("/generate_qr_pdf")
@markets_bp.doc(
    summary="Create a PDF file for a grid of QR codes "
    "with customizable margins and spacing"
)
def generate_qr_pdf():
    """
    ينشئ ملف PDF يحتوي على شبكة من رموز QR مع هوامش ومسافات قابلة للتخصيص.
    المتغيرات المتاحة عبر الرابط:
    url: الرابط الذي سيتم ترميزه في QR (افتراضي: https://price.savana.ly)
    cols: عدد الأعمدة (افتراضي: 3)
    rows: عدد الصفوف (افتراضي: 8)
    margin_x: الهامش الأفقي للصفحة بالنقاط (يسار ويمين) (افتراضي: 10)
    margin_y: الهامش العمودي للصفحة بالنقاط (أعلى وأسفل) (افتراضي: 30)
    spacing_x: المسافة الأفقية بين رموز QR بالنقاط (افتراضي: 100)
    spacing_y: المسافة العمودية بين رموز QR بالنقاط (افتراضي: 10)
    """
    try:
        # --- الإعدادات والمتغيرات ---
        store_url = request.args.get("url", "https://price.savana.ly")
        page_width, page_height = A4
        buffer = BytesIO()
        c = canvas.Canvas(buffer, pagesize=A4)

        # --- تخصيص الشبكة والهوامش ---
        cols = int(request.args.get("cols", 3))
        rows = int(request.args.get("rows", 8))

        # الهوامش الخارجية للصفحة
        margin_x = int(request.args.get("margin_x", 10))
        margin_y = int(request.args.get("margin_y", 30))

        # المسافات بين رموز QR
        spacing_x = int(request.args.get("spacing_x", 100))
        spacing_y = int(request.args.get("spacing_y", 10))

        # --- حساب الأبعاد ---
        # حساب المساحة الكلية المتاحة للرسم بعد طرح الهوامش
        drawable_width = page_width - (2 * margin_x)
        drawable_height = page_height - (2 * margin_y)

        # حساب المساحة الإجمالية التي ستشغلها المسافات
        total_spacing_x = (cols - 1) * spacing_x
        total_spacing_y = (rows - 1) * spacing_y

        # حساب حجم كل رمز QR ليتناسب مع الشبكة والمسافات
        qr_width = (drawable_width - total_spacing_x) / cols
        qr_height = (drawable_height - total_spacing_y) / rows
        # نستخدم البعد الأصغر لضمان أن الرمز مربع ويناسب الخلية
        qr_size = min(qr_width, qr_height)

        if qr_size <= 0:
            raise ValueError(
                "الهوامش أو المسافات كبيرة جدًا بالنسبة لحجم الصفحة وعدد رموز QR."
            )

        # --- *** تعديل جديد: توسيط الشبكة *** ---
        # حساب الأبعاد الفعلية للشبكة بناءً على حجم QR النهائي
        grid_width = cols * qr_size + total_spacing_x
        grid_height = rows * qr_size + total_spacing_y

        # حساب نقطة البداية (x, y) لتوسيط الشبكة داخل المساحة القابلة للرسم
        start_x = margin_x + (drawable_width - grid_width) / 2
        start_y_from_bottom = margin_y + (drawable_height - grid_height) / 2

        # تحويل نقطة البداية y لتناسب نظام إحداثيات reportlab (يبدأ من الأسفل)
        # نحسب أعلى نقطة في الشبكة ونبدأ الرسم من هناك
        grid_top_y = page_height - start_y_from_bottom

        # --- حلقة الرسم ---
        for row in range(rows):
            for col in range(cols):
                # توليد رمز QR في الذاكرة
                qr = qrcode.make(store_url)
                qr_buffer = BytesIO()
                qr.save(qr_buffer, format="PNG")
                qr_buffer.seek(0)
                img = ImageReader(qr_buffer)

                x = start_x + col * (qr_size + spacing_x)
                y = grid_top_y - (row + 1) * qr_size - row * spacing_y

                # رسم الصورة على ملف PDF
                c.drawImage(
                    img,
                    x,
                    y,
                    width=qr_size,
                    height=qr_size,
                    preserveAspectRatio=True,
                    mask="auto",
                )

        # --- حفظ وإرسال الملف ---
        c.save()
        buffer.seek(0)

        return send_file(
            buffer,
            as_attachment=True,
            download_name="qr_codes.pdf",
            mimetype="application/pdf",
        )
    except (ValueError, TypeError) as e:
        return f"حدث خطأ: {e}. يرجى التحقق من أن جميع المدخلات أرقام صحيحة.", 400
