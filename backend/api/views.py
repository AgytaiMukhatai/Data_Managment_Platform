from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import GeneralUser
from django.shortcuts import render
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from rest_framework.permissions import AllowAny
from rest_framework.decorators import permission_classes
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.shortcuts import render, redirect

# Email sending
from django.core.mail import send_mail
from django.template.loader import render_to_string

# Dataset view
from .models import Dataset
from .serializers import DatasetSerializer
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
import os
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
    password = request.data.get('password')
    token = request.data.get('token')
    user = GeneralUser.objects.get(verification_token=token)
    try:
        validate_password(password)
    except ValidationError as e:
        return Response({'error': e.messages[0]}, status=400)

    user.password = make_password(password)
    user.save()
    return Response({'message': 'Password changed'}, status=200)

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
def delete_user(request):
    user = get_user_from_token(request)
    if not user:
        return Response({'error': 'Unauthorized or invalid token.'}, status=401)
    
    user.delete()
    return Response({'message': 'Account deleted successfully.'}, status=200)
    
class DatasetList(APIView):
    def get(self, request):
        datasets = Dataset.objects.all()
        serializer = DatasetSerializer(datasets, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

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
            files=folder_path
        )

        return Response({'message': 'Dataset uploaded successfully!'}, status=200)

class DownloadDatasetView(APIView):
    def get(self, request, title):
        try:
            dataset = Dataset.objects.get(title=title)
        except Dataset.DoesNotExist:
            return Response({'error': 'Dataset not found'}, status=404)

        folder_path = dataset.files.path

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

        response = HttpResponse(zip_buffer, content_type='application/zip')
        response['Content-Disposition'] = f'attachment; filename="{dataset.title}.zip"'
        return response