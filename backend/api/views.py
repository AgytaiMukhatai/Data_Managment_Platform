from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import GeneralUser
from django.shortcuts import render
from django.contrib.auth.hashers import make_password, check_password
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from rest_framework_simplejwt.tokens import RefreshToken
from django.shortcuts import render, redirect

# Enail sending
from django.core.mail import send_mail
from django.template.loader import render_to_string


def send_verification_email(user):
    verification_link = f'http://localhost:8000/api/verify-email/{user.verification_token}/'

    subject = 'Email Verification'
    message = render_to_string('verification_email.html', {
        'user': user,
        'verification_link': verification_link,
    })
    send_mail(
        subject,
        '',  # Leave the plain text body empty because we're using HTML
        'raiymbekproject@gmail.com',  # Your "From" email address
        [user.email],  # Recipient email
        fail_silently=False,
        html_message=message,  # This is the HTML content of the email
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

@api_view(['POST'])
def confirm_email(request, token):
    try:
        user = GeneralUser.objects.get(verification_token=token)
    except GeneralUser.DoesNotExist:
        return Response({'message': 'Invalid or expired token'}, status=400)

    # Activate the user if the token is valid
    user.is_active = True
    user.save()

    return Response({'message': 'Email Verified'}, status=200)


# Login
@api_view(['POST'])
def login_user(request):
    email = request.data.get('email')
    password = request.data.get('password')


    try:
        user = GeneralUser.objects.get(email=email)
        if not user.is_active:
            return Response({'error': 'Please verify your email adress before logging in'}, status=400)
    
        if check_password(password, user.password):
            refresh = RefreshToken.for_user(user)
            return Response({
                'access_token': str(refresh.access_token),
                'refresh_token': str(refresh),
            }, status=200)
        else:
            return Response({'error': 'Invalid email or password'}, status=401)
    except GeneralUser.DoesNotExist:
        return Response({'error': 'Invalid email or password'}, status=401)

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
