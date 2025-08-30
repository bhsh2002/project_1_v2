from apiflask import Schema
from apiflask.fields import File


class AppUploadSchema(Schema):
    apk_file = File(required=True, metadata={"description": "The APK file to upload."})
