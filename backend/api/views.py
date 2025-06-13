from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from .models import GeneralUser, Dataset, MLModel
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken, AccessToken
from django.utils.decorators import method_decorator
from pathlib import Path

# Email sending
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.shortcuts import render, redirect

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
            return redirect('http://localhost/login?verified=true')
        user.is_active = True
        user.save()
        # Redirect to a success page or render a template
        return redirect('http://localhost/login?verified=true')
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