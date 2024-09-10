import os
import uuid


def upload_photo(instance, filename):
    ext = filename.split('.')[-1]
    filename = f'{uuid.uuid4()}.{ext}'
    path = os.path.join('cars', instance.brand.name, filename)
    return path

# def upload_photo(instance, filename):
#     print(instance)
#     print(instance.id)
#     print(filename)
#     ext = filename.split('.')[-1]
#     path = os.path.join('cars', str(instance.id), f'{uuid.uuid4()}.{ext}')
#     print(f"Uploading file to: {path}")  # Отладочное сообщение
#     return path


# def upload_photo(folder_path: str, uploaded_files: list):
#     uploaded_paths = []
#
#     for uploaded_file in uploaded_files:
#         ext = uploaded_file.name.split('.')[-1]
#         unique_filename = f'{uuid.uuid4()}.{ext}'
#
#         if not os.path.exists(folder_path):
#             os.makedirs(folder_path)
#
#         file_path = os.path.join(folder_path, unique_filename)
#         with open(file_path, 'wb+') as destination:
#             for chunk in uploaded_file.chunks():
#                 destination.write(chunk)
#
#         uploaded_paths.append(file_path)
#
#     return uploaded_paths
