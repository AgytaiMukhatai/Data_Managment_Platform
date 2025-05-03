from django.urls import path
from .views import register_general_user, login_user, verify_email

urlpatterns = [
    path('register/', register_general_user),
    path('login/', login_user),
    path('verify-email/<uuid:token>/', verify_email, name='verify-email'),
]
