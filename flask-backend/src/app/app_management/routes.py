import os
from apiflask import APIBlueprint
from flask import current_app, send_from_directory
from werkzeug.exceptions import NotFound

from dev_kit.web.decorators import permission_required
from .schemas import AppUploadSchema
from .services import app_management_service

app_management_bp = APIBlueprint("app_management", __name__, url_prefix="/app")


@app_management_bp.post("/upload")
@app_management_bp.input(AppUploadSchema, location="files")
@permission_required("upload:app")
def upload_apk(files_data):
    """
    Upload the latest APK file. This will overwrite the existing one.
    Requires 'upload:app' permission.
    """
    apk_file = files_data["apk_file"]
    result = app_management_service.save_apk(apk_file)
    return result, 200


@app_management_bp.get("/download")
@app_management_bp.doc(summary="Download the latest APK file")
def download_apk():
    """
    Serves the latest APK file for download.
    """
    apk_folder = current_app.config["APK_FOLDER"]
    filename = "app-latest.apk"
    file_path = os.path.join(apk_folder, filename)

    if not os.path.exists(file_path):
        raise NotFound("The application file was not found.")

    return send_from_directory(
        apk_folder, filename, as_attachment=True, download_name="sawemly.apk"
    )
