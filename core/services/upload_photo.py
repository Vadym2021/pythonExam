import os
import uuid


def upload_photo(folder_path: str, uploaded_files: list):
    uploaded_paths = []

    for uploaded_file in uploaded_files:
        ext = uploaded_file.name.split('.')[-1]  # получаем расширение файла
        unique_filename = f'{uuid.uuid4()}.{ext}'  # генерируем уникальное имя файла

        # Создаем папки, если они не существуют
        if not os.path.exists(folder_path):
            os.makedirs(folder_path)

        file_path = os.path.join(folder_path, unique_filename)
        with open(file_path, 'wb+') as destination:
            for chunk in uploaded_file.chunks():
                destination.write(chunk)

        uploaded_paths.append(file_path)

    return uploaded_paths  # возвращаем список полных путей к загруженным файлам
