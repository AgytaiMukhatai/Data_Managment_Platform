from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import GeneralUser
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken

# Enail sending
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, force_bytes
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.http import HttpResponse

# Register
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError

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

    # Create the user
    user = GeneralUser.objects.create(
        username=username,
        email=email,
        password=make_password(password)  # Hashing
    )

    return Response({'message': 'User created successfully'})

# Login
@api_view(['POST'])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')

    try:
        user = GeneralUser.objects.get(email=email)
    except GeneralUser.DoesNotExist:
        return Response({'error': 'Invalid credentials'}, status=400)

    if check_password(password, user.password):
        # Generate JWT tokens
        refresh = RefreshToken.for_user(user)
        access_token = str(refresh.access_token)

        return Response({
            'access_token': access_token,
            'message': 'Login successful'
        })
    else:
        return Response({'error': 'Invalid credentials'}, status=400)


def send_verification_email(user):
    token = default_token_generator.make_token(user)
    uid = urlsafe_base64_encode(force_bytes(user.pk))  # Encode user ID
    
    verification_link = f'http://localhost:8000/verify-email/{uid}/{token}/'  # Change to your domain

    subject = 'Email Verification'
    message = render_to_string('verification_email.html', {
        'user': user,
        'verification_link': verification_link,
    })
    send_mail(subject, message, 'no-reply@yourdomain.com', [user.email])