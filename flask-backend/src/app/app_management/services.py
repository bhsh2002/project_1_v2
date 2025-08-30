import os
from flask import current_app
from werkzeug.utils import secure_filename


class AppManagementService:
    def save_apk(self, file_storage):
        """Saves the uploaded APK, overwriting the old one."""
        apk_folder = current_app.config["APK_FOLDER"]
        os.makedirs(apk_folder, exist_ok=True)

        # Ensure the filename is secure and consistent
        filename = secure_filename("app-latest.apk")
        file_path = os.path.join(apk_folder, filename)

        file_storage.save(file_path)
        return {"message": "File uploaded successfully.", "filename": filename}


app_management_service = AppManagementService()
