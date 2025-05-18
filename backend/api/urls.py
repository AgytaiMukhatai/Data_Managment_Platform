from django.urls import path
from .views import register_general_user, login_user, verify_email, forgot_password, password_change, reset_password
from .views import DatasetList, UploadDatasetView, DownloadDatasetView


urlpatterns = [
    path('register/', register_general_user),
    path('login/', login_user),
    path('verify-email/<uuid:token>/', verify_email, name='verify-email'),
    path('forgot_password/', forgot_password, name='forgot-password'),
    path('password-change/<uuid:token>/', password_change, name='password-change'),
    path('reset-password/<uuid:token>/', reset_password, name='reset-password'),
    path('datasets/', DatasetList.as_view(), name='dataset-list'),
    path('upload-dataset/', UploadDatasetView.as_view(), name='upload-dataset'),
    path('download-dataset/', DownloadDatasetView.as_view(), name='download-dataset'),
]
