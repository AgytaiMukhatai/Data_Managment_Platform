from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import GeneralUser
from django.shortcuts import render
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.utils.decorators import method_decorator
from pathlib import Path

# Email sending
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.views.decorators.csrf import csrf_exempt
from django.shortcuts import render, redirect

# Dataset view
from .models import Dataset
from .serializers import DatasetSerializer
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
import os
import shutil
import zipfile
from io import BytesIO
from django.http import HttpResponse

from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync 

def send_verification_email(user):
    verification_link = f'http://localhost:8000/api/verify-email/{user.verification_token}/'

    subject = 'Email Verification'
    message = render_to_string('verification_email.html', {
        'user': user,
        'verification_link': verification_link,
    })
    send_mail(
        subject,
        '',
        'raiymbekproject@gmail.com',
        [user.email],
        fail_silently=False,
        html_message=message,
    )

def send_password_email(user):
    password_change_link = f'http://localhost:8000/api/password-change/{user.verification_token}/'

    subject = 'Reset Password'
    message = render_to_string('forgot_password_email.html', {
        'user': user,
        'password_change_link': password_change_link,
    })
    send_mail(
        subject,
        '',
        'raiymbekproject@gmail.com',
        [user.email],
        fail_silently=False,
        html_message=message,
    )

@api_view(['POST'])
def register_general_user(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response({'error': 'All fields are required'}, status=400)

    if GeneralUser.objects.filter(username=username).exists():
        return Response({'error': 'Username already exists'}, status=400)
    
    if GeneralUser.objects.filter(email=email).exists():
        return Response({'error': 'Email already exists'}, status=400)

    # Validate the password
    try:
        validate_password(password)
    except ValidationError as e:
        return Response({'error': e.messages[0]}, status=400)

    # Creating the user but marking as inactive until email is verified
    user = GeneralUser.objects.create(
        username=username,
        email=email,
        password=make_password(password),
        is_active=False,
    )

    send_verification_email(user)

    return Response({'message': 'User created successfully! Please check your email to verify your account.'}, status=200)

@api_view(['GET'])
def verify_email(request, token):
    try:
        user = GeneralUser.objects.get(verification_token=token)
        if user.is_active:
            return redirect('http://localhost:5173/login?verified=true')
        user.is_active = True
        user.save()
        # Redirect to a success page or render a template
        return redirect('http://localhost:5173/login?verified=true')
    except GeneralUser.MultipleObjectsReturned:
        # Handle the case where multiple users are found with the same token
        return Response({'message': 'Multiple users found with this token'}, status=400)
    except GeneralUser.DoesNotExist:
        return Response({'message': 'Invalid or expired token'}, status=400)
    return render(request, 'verify_email.html', {'token': token, 'user': user})

# Login
@api_view(['POST'])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        user = GeneralUser.objects.get(email=email)
    except GeneralUser.DoesNotExist:
        return Response({'error': 'Incorrect email or password.'}, status=400)

    if check_password(password, user.password):
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)
        refresh_token = str(refresh)

        return Response({
            'access_token': access_token,
            'refresh_token': refresh_token,
            'message': 'Login successful'
        })
    else:
        return Response({'error': 'Invalid credentials'}, status=400)

@api_view(['POST'])
def forgot_password(request):
    email = request.data.get('email')
    try:
        user = GeneralUser.objects.get(email=email)
        send_password_email(user)
        return Response({'message': 'Email sended. Check your mailbox'}, status=200)
    except GeneralUser.DoesNotExist:
        return Response({'message': 'User with this email does not exists'}, status=400)

def password_change(request, token):
    try:
        user = GeneralUser.objects.get(verification_token=token)
    except GeneralUser.DoesNotExist:
        return Response({'message': 'Invalid or expired token'}, status=400)
    return render(request, 'password_change.html', {'token': token, 'user': user})

@api_view(['POST'])
def reset_password(request, token):
    password = request.data.get('password', '')
    confirm_password = request.data.get('confirm_password', '')

    if not password or not confirm_password:
        return Response({'error': 'Password and confirm password are required.'}, status=400)
    if password != confirm_password:
        return Response({'error': 'Passwords do not match.'}, status=400)

    try:
        validate_password(password)
    except ValidationError as e:
        return Response({'error': e.messages[0]}, status=400)
    try:
        user = GeneralUser.objects.get(verification_token=token)
    except GeneralUser.DoesNotExist:
        return Response({'error': 'Invalid or expired token.'}, status=404)

    user.password = make_password(password)
    user.save()
    return Response({'message': 'Password changed'}, status=201)

def get_user_from_token(request):
        token_str = request.data.get('token')
        if not token_str:
            return None
        try:
            access_token = AccessToken(token_str)
            user_id = access_token['user_id']
            user = GeneralUser.objects.get(id=user_id)
            return user
        except Exception:
            return None

@api_view(['GET'])
def user_info(request):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized or invalid token.'}, status=401)
    
    user_data = {
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'email': user.email,
        'profile_image': user.profile_image
    }

    return Response(user_data, status=200)

@api_view(['POST'])
def update_password(request):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized or invalid token.'}, status=401)

    new_password = request.data.get('new_password', '')
    confirm_password = request.data.get('confirm_password', '')

    if not new_password or not confirm_password:
        return Response({'error': 'New password and confirmation are required.'}, status=400)

    if new_password != confirm_password:
        return Response({'error': 'New password and confirmation do not match.'}, status=400)

    try:
        validate_password(new_password)
    except ValidationError as e:
        return Response({'error': e.messages[0]}, status=400)

    user.password = make_password(new_password)
    user.save()

    return Response({'message': 'Password updated successfully.'}, status=200)

@api_view(['POST'])
def upload_profile_image(request):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized or invalid token.'}, status=401)

    image_file = request.FILES.get('profile_image')
    if not image_file:
        return Response({'error': 'No image file provided.'}, status=400)

    folder_path = 'profile_images'
    os.makedirs(folder_path, exist_ok=True)
    ext = image_file.name.split('.')[-1]
    filename = f"{user.username}.{ext}"
    file_path = os.path.join(folder_path, filename)

    try:
        if default_storage.exists(file_path):
            default_storage.delete(file_path)
        default_storage.save(file_path, ContentFile(image_file.read()))
    except Exception as e:
        return Response({'error': 'Failed to save image file.'}, status=500)

    user.profile_image = file_path
    user.save()

    return Response({'message': 'Profile image uploaded successfully.', 'profile_image': user.profile_image})

@api_view(['PATCH'])
def update_user(request):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized or invalid token.'}, status=401)

    data = request.data
    new_username = data.get('username', '').strip()
    new_first_name = data.get('first_name', '').strip()
    new_last_name = data.get('last_name', '').strip()

    if new_username != user.username:
        if GeneralUser.objects.filter(username=new_username).exists():
            return Response({'error': 'Username already exists.'}, status=400)

        profile_dir = Path('profile_images')
        old_files = list(profile_dir.glob(f"{user.username}.*"))
        for old_file in old_files:
            new_file = profile_dir / f"{new_username}{old_file.suffix}"
            try:
                old_file.rename(new_file)
            except Exception as e:
                return Response({'error': f'Failed to rename profile image: {str(e)}'}, status=500)

        user.username = new_username

    user.first_name = new_first_name
    user.last_name = new_last_name

    user.save()

    return Response({'message': 'User updated successfully.'}, status=200)


@api_view(['DELETE'])
def delete_user(request):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized or invalid token.'}, status=401)

    profile_dir = Path('profile_images')
    profile_images = list(profile_dir.glob(f"{user.username}.*"))
    for img_file in profile_images:
        if img_file.exists() and img_file.is_file():
            try:
                img_file.unlink()
            except Exception as e:
                return Response({'error': f'Failed to delete profile image: {str(e)}'}, status=500)

    user.delete()

    return Response({'message': 'Account deleted successfully.'}, status=200)

@api_view(['GET'])
def dist_user_data(request):
    username = request.data.get('username')
    try:
        user = GeneralUser.objects.get(username=username)
    except GeneralUser.DoesNotExist:
        return Response({'error': 'User not found'}, status=404)

    user_data = {
        'username': user.username,
        'first_name': user.first_name,
        'last_name': user.last_name,
        'profile_image': user.profile_image
    }

    return Response(user_data, status=200)

    
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

@api_view(['POST'])
def search(request):
    text = request.data.get('text', '').strip()
    if not text:
        return Response({'datasets': [], 'users': []})

    datasets = Dataset.objects.filter(title__icontains=text).order_by('title')[:3]
    users = GeneralUser.objects.filter(username__icontains=text).order_by('username')[:3]

    datasets_data = [{'title': d.title} for d in datasets]
    users_data = [{'username': u.username} for u in users]

    return Response({'datasets': datasets_data, 'users': users_data})