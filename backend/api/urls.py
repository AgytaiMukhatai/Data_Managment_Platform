from django.urls import path
from .views import register_general_user, login_user

urlpatterns = [
    path('register/', register_general_user),
    path('login/', login_user),
]
