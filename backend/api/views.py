from rest_framework.decorators import api_view
from rest_framework.response import Response
from .models import GeneralUser
from django.contrib.auth.hashers import make_password, check_password
from rest_framework_simplejwt.tokens import RefreshToken

# Register
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

    user = GeneralUser.objects.create(
        username=username,
        email=email,
        password=make_password(password) # Hashing
    )

    return Response({'message': 'GeneralUser created successfully'})

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
