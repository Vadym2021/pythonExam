import os
import uuid


def upload_photo(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    path = os.path.join('cars', instance.brand.name, filename)
    return path
