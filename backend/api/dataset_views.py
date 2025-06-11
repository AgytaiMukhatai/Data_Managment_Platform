from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import GeneralUser, Dataset, MLModel
from .views import get_user_from_token
from .serializers import DatasetSerializer
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
import os
import shutil
import zipfile
from io import BytesIO
from django.http import HttpResponse

class DatasetList(APIView):
    def get(self, request):
        datasets = Dataset.objects.all()
        serializer = DatasetSerializer(datasets, many=True)
        return Response(serializer.data, status=200)

class ProfileDatasetList(APIView):
    def get(self, request):
        user = get_user_from_token(request)
        if not user:
            return Response({'error': 'Unauthorized or invalid token.'}, status=401)

        datasets = Dataset.objects.filter(owner=user)
        serializer = DatasetSerializer(datasets, many=True)
        return Response(serializer.data, status=200)

class DistUserDatasetList(APIView):
    def get(self, request):
        username = request.data.get('username')
        try:
            user = GeneralUser.objects.get(username=username)
        except GeneralUser.DoesNotExist:
            return Response({'error': 'User not found'}, status=404)

        datasets = Dataset.objects.filter(owner=user)
        serializer = DatasetSerializer(datasets, many=True)
        return Response(serializer.data, status=200)

class LikedDataset(APIView):
    def get(self, request):
        user = get_user_from_token(request)
        if not user:
            return Response({'error': 'Unauthorized or invalid token.'}, status=401)

        liked_datasets = LikesAndViewsDataset.objects.filter(user=user, liked=True)
        dataset_ids = [item.dataset.id for item in liked_datasets]
        datasets = Dataset.objects.filter(id__in=dataset_ids)
        serializer = DatasetSerializer(datasets, many=True)
        return Response(serializer.data, status=200)

class RecentlyViewedDataset(APIView):
    def get(self, request):
        user = get_user_from_token(request)
        if not user:
            return Response({'error': 'Unauthorized or invalid token.'}, status=401)

        viewed_datasets = LikesAndViewsDataset.objects.filter(user=user, viewed=True).order_by('-timestamp')
        dataset_ids = [item.dataset.id for item in viewed_datasets]
        datasets = Dataset.objects.filter(id__in=dataset_ids)
        serializer = DatasetSerializer(datasets, many=True)
        return Response(serializer.data, status=200)

class UploadDatasetView(APIView):
    parser_classes = (MultiPartParser, FormParser)

    TABULAR_FILE_EXTENSIONS = ['csv', 'xlsx', 'json', 'tsv']
    AUDIO_FILE_EXTENSIONS = ['mp3', 'wav', 'aac', 'flac', 'ogg', 'wma', 'm4a']
    VIDEO_FILE_EXTENSIONS = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'mkv', 'webm']
    IMAGE_FILE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'gif', 'bmp', 'tiff', 'svg', 'webp']
    TEXT_FILE_EXTENSIONS = ['txt', 'md', 'rtf', 'log', 'xml', 'html', 'htm']

    ALL_ALLOWED_EXTENSIONS = (
        TABULAR_FILE_EXTENSIONS +
        AUDIO_FILE_EXTENSIONS +
        VIDEO_FILE_EXTENSIONS +
        IMAGE_FILE_EXTENSIONS +
        TEXT_FILE_EXTENSIONS
    )

    def get_dataset_type(self, ext):
        ext = ext.lower()
        if ext in self.TABULAR_FILE_EXTENSIONS:
            return 'Tabular'
        elif ext in self.AUDIO_FILE_EXTENSIONS:
            return 'Audio'
        elif ext in self.VIDEO_FILE_EXTENSIONS:
            return 'Video'
        elif ext in self.IMAGE_FILE_EXTENSIONS:
            return 'Image'
        elif ext in self.TEXT_FILE_EXTENSIONS:
            return 'Text'
        else:
            return 'Unknown'

    def is_valid_file_type(self, file):
        file_extension = file.name.split('.')[-1].lower()
        return file_extension in self.ALL_ALLOWED_EXTENSIONS

    def post(self, request, *args, **kwargs):
        user = get_user_from_token(request)
        if not user:
            return Response({'error': 'Unauthorized or invalid token.'}, status=401)

        title = request.data.get('title')
        if Dataset.objects.filter(title=title).exists():
            return Response({'error': 'Title already exists'}, status=400)
        description = request.data.get('description')
        files = request.FILES.getlist('files') or []

        if not title or not description or not files:
            return Response(
                {'error': 'Title, description, and at least one file are required.'},
                status=400
            )

        for file in files:
            if not self.is_valid_file_type(file):
                return Response(
                    {'error': f'Invalid file type: {file.name}. Only Text, Tabular, Image, Audio abd Video files are allowed!'},
                    status=400
                )

        total_size = sum(file.size for file in files)
        total_size_mb = total_size / (1024 * 1024)

        first_file_ext = files[0].name.split('.')[-1].lower()
        dataset_type = self.get_dataset_type(first_file_ext)

        folder_path = os.path.join('datasets', title.replace(" ", "_"))
        file_count = 0
        for file in files:
            file_count += 1
            default_storage.save(os.path.join(folder_path, file.name), file)

        dataset = Dataset.objects.create(
            title=title,
            description=description,
            size=round(total_size_mb, 2),
            dataset_type=dataset_type,
            owner=user,
            files_count=file_count,
            folder_path=folder_path
        )

        return Response({'message': 'Dataset uploaded successfully!'}, status=200)

class DownloadDatasetView(APIView):
    def get(self, request, title):
        try:
            dataset = Dataset.objects.get(title=title)
        except Dataset.DoesNotExist:
            return Response({'error': 'Dataset not found'}, status=404)

        folder_path = dataset.folder_path

        if not os.path.exists(folder_path):
            return Response({'error': 'Files folder not found'}, status=404)

        zip_buffer = BytesIO()
        with zipfile.ZipFile(zip_buffer, "w", zipfile.ZIP_DEFLATED) as zip_file:
            for root, dirs, files in os.walk(folder_path):
                for file in files:
                    file_path = os.path.join(root, file)
                    arcname = os.path.relpath(file_path, start=folder_path)
                    zip_file.write(file_path, arcname)

        zip_buffer.seek(0)
        dataset.downloads += 1
        dataset.save()
        response = HttpResponse(zip_buffer, content_type='application/zip')
        response['Content-Disposition'] = f'attachment; filename="{dataset.title}.zip"'
        return response

@api_view(['POST'])
def toggle_like_dataset(request, title):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized. Please log in to like.'}, status=401)

    try:
        dataset = Dataset.objects.get(title=title)
    except Dataset.DoesNotExist:
        return Response({'error': 'Dataset not found.'}, status=404)

    interaction, created = LikesAndViews.objects.get_or_create(
        username=user,
        dataset=dataset,
        defaults={'liked': True}
    )

    if not created:
        # Toggle like
        if interaction.liked:
            interaction.liked = False
            dataset.likes = max(dataset.likes - 1, 0)
        else:
            interaction.liked = True
            dataset.likes += 1
        interaction.save()
        dataset.save()
    else:
        # New like
        dataset.likes += 1
        dataset.save()

    return Response(status=200)

class DatasetDetailsView(APIView):
    def get(self, request, title):
        try:
            dataset = Dataset.objects.get(title=title)
        except Dataset.DoesNotExist:
            return Response({'error': 'Dataset not found'}, status=404)
        
        user = get_user_from_token(request)
        
        if user:
            interaction, created = LikesAndViews.objects.get_or_create(
                username=user,
                dataset=dataset,
                defaults={'viewed': True, 'timestamp': timezone.now()}
            )
            if not created:
                interaction.viewed = True
                interaction.timestamp = timezone.now()
                interaction.save()
        dataset.views += 1
        dataset.save()
            
        # Logic for now is not implementable
        # We need deployment in VM
        folder_path = dataset.folder_path
        return Response({'message': 'All good!'}, status=200)

@api_view(['PATCH'])
def update_dataset(request, title):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized or invalid token.'}, status=401)

    try:
        dataset = Dataset.objects.get(title=title, owner=user)
    except Dataset.DoesNotExist:
        return Response({'error': 'Dataset not found or you do not have permission.'}, status=404)

    new_title = request.data.get('title', dataset.title).strip()
    new_description = request.data.get('description', dataset.description).strip()

    if new_title != dataset.title:
        if Dataset.objects.filter(title=new_title).exists():
            return Response({'error': 'Title already exists.'}, status=400)

        old_folder = dataset.folder_path
        new_folder = os.path.join(os.path.dirname(old_folder), new_title.replace(" ", "_"))

        try:
            if os.path.exists(old_folder):
                os.rename(old_folder, new_folder)
        except Exception as e:
            return Response({'error': f'Failed to rename folder: {str(e)}'}, status=500)

        dataset.title = new_title
        dataset.folder_path = new_folder

    dataset.description = new_description
    dataset.save()

    return Response({'message': 'Dataset updated successfully.'}, status=200)

class AddFilesToDatasetView(UploadDatasetView):

    def post(self, request, title):
        user = get_user_from_token(request)
        if not user:
            return Response({'error': 'Unauthorized or invalid token.'}, status=401)

        try:
            dataset = Dataset.objects.get(title=title, owner=user)
        except Dataset.DoesNotExist:
            return Response({'error': 'Dataset not found or you do not have permission.'}, status=404)

        files = request.FILES.getlist('files') or []
        if not files:
            return Response({'error': 'No files provided.'}, status=400)

        folder_path = dataset.folder_path
        total_size = 0
        new_files_count = 0

        for file in files:
            if not self.is_valid_file_type(file):
                return Response({'error': f'Invalid file type: {file.name}.'}, status=400)

            ext = file.name.split('.')[-1].lower()
            file_type = self.get_dataset_type(ext)
            if file_type != dataset.dataset_type:
                return Response({'error': f'File "{file.name}" type does not match dataset type ({dataset.dataset_type}).'}, status=400)

            save_path = os.path.join(folder_path, file.name)
            if default_storage.exists(save_path):
                return Response({'error': f'File already exists: {file.name}'}, status=400)

            default_storage.save(save_path, file)
            total_size += file.size
            new_files_count += 1

        dataset.size += total_new_size / (1024 * 1024)
        dataset.files_count += new_files_count
        dataset.save()

        return Response({'message': f'{new_files_count} files added successfully.'}, status=200)

@api_view(['POST'])
def delete_files(request, title):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized or invalid token.'}, status=401)

    try:
        dataset = Dataset.objects.get(title=title, owner=user)
    except Dataset.DoesNotExist:
        return Response({'error': 'Dataset not found or you do not have permission.'}, status=404)

    files_to_delete = request.data.get('files', [])
    if not files_to_delete or not isinstance(files_to_delete, list):
        return Response({'error': 'Provide a list of files to delete.'}, status=400)

    folder_path = dataset.folder_path

    total_deleted_size = 0
    deleted_files_count = 0

    for filename in files_to_delete:
        file_path = os.path.join(folder_path, filename)
        if os.path.exists(file_path) and os.path.isfile(file_path):
            try:
                file_size = os.path.getsize(file_path)
                os.remove(file_path)
                total_deleted_size += file_size
                deleted_files_count += 1
            except Exception as e:
                return Response({'error': f'Failed to delete file {filename}: {str(e)}'}, status=500)
        else:
            return Response({'error': f'File not found: {filename}'}, status=404)

    dataset.size -= total_deleted_size / (1024 * 1024)
    dataset.files_count = max(dataset.files_count - deleted_files_count, 0)
    dataset.save()

    return Response({'message': f'{deleted_files_count} files deleted successfully.'}, status=200)

@api_view(['DELETE'])
def delete_dataset(request, title):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized or invalid token.'}, status=401)

    try:
        dataset = Dataset.objects.get(title=title, owner=user)
    except Dataset.DoesNotExist:
        return Response({'error': 'Dataset not found or you do not have permission.'}, status=404)

    folder_path = dataset.folder_path

    if os.path.isdir(folder_path):
        try:
            shutil.rmtree(folder_path)
        except Exception as e:
            return Response({'error': 'Failed to delete Dataset'}, status=500)

    dataset.delete()
    return Response({'message': 'Dataset and its files deleted successfully.'}, status=200)