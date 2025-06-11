from django.urls import path, include
from .views import *
from .dataset_views import *
from .dataset_views import *

app_name = 'api'
urlpatterns = [
    path('register/', register_general_user, name='register'),
    path('login/', login_user, name='login'),
    path('profile/', user_info, name='profile'),
    path('upload-profile-image/', upload_profile_image, name='upload-profile-image'),
    path('update-password/', update_password, name='update-password'),
    path('update-user/', update_user, name='update-user'),
    path('delete-user/', delete_user, name='delete-user'),
    path('verify-email/<uuid:token>/', verify_email, name='verify-email'),
    path('forgot_password/', forgot_password, name='forgot-password'),
    path('password-change/<uuid:token>/', password_change, name='password-change'),
    path('reset-password/<uuid:token>/', reset_password, name='reset-password'),
    path('datasets/', DatasetList.as_view(), name='datasets'),
    path('profile-datasets/', ProfileDatasetList.as_view(), name='profile-datasets'),
    path('liked-datasets/', LikedDataset.as_view(), name='liked-datasets'),
    path('recently-viewed-datasets/', RecentlyViewedDataset.as_view(), name='recently-viewed-datasets'),
    path('dist-user-page/', dist_user_data, name='dist-user-page'),
    path('dist-user-datasets/', DistUserDatasetList.as_view(), name='dist-user-datasets'),
    path('like/', toggle_like_dataset, name='like'),
    path('search/', search, name='search'),
    path('upload-dataset/', UploadDatasetView.as_view(), name='upload-dataset'),
    path('download-dataset/<str:title>/', DownloadDatasetView.as_view(), name='download-dataset'),
    path('add-files-dataset/<str:title>/', AddFilesToDatasetView.as_view(), name='add-files-dataset'),
    path('delete-files-dataset/', delete_files, name='delete-files-dataset'),
    path('update-dataset/', update_dataset, name='update-dataset'),
    path('delete-dataset/', delete_dataset, name='delete-dataset'),
    
]
