from django.urls import path
from .views import register_general_user, login_user, verify_email, confirm_email, forgot_password, password_change, reset_password

urlpatterns = [
    path('register/', register_general_user),
    path('login/', login_user),
    path('verify-email/<uuid:token>/', verify_email, name='verify-email'),
    path('confirm-email/<uuid:token>/', confirm_email, name='confirm-email'),
    path('forgot_password/', forgot_password, name='forgot-password'),
    path('password-change/<uuid:token>/', password_change, name='password-change'),
    path('reset-password/<uuid:token>/', reset_password, name='reset-password'),
]
