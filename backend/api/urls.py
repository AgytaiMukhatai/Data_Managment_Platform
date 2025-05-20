from django.urls import path
from .views import register_general_user, login_user, verify_email, forgot_password, password_change, reset_password, user_info
from .views import delete_user, delete_dataset, update_user, upload_profile_image, update_password
from .views import DatasetList, UploadDatasetView, DownloadDatasetView, toggle_like_dataset, search


urlpatterns = [
    path('register/', register_general_user),
    path('login/', login_user),
    path('profile/', user_info, name='profile'),
    path('upload-profile-image/', upload_profile_image, name='upload-profile-image'),
    path('update-password/', update_password, name='update-password'),
    path('update-user/', update_user, name='update-user'),
    path('delete-user/', delete_user, name='delete-user'),
    path('verify-email/<uuid:token>/', verify_email, name='verify-email'),
    path('forgot_password/', forgot_password, name='forgot-password'),
    path('password-change/<uuid:token>/', password_change, name='password-change'),
    path('reset-password/<uuid:token>/', reset_password, name='reset-password'),
    path('datasets/', DatasetList.as_view(), name='dataset-list'),
    path('like/', toggle_like_dataset, name='like'),
    path('search/', search, name='search'),
    path('upload-dataset/', UploadDatasetView.as_view(), name='upload-dataset'),
    path('download-dataset/<str:title>/', DownloadDatasetView.as_view(), name='download-download'),
    path('delete-dataset/', delete_dataset, name='delete-dataset'),
]
