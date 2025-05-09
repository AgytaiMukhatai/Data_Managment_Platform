from django.db import models
import os
import uuid

class GeneralUser(models.Model):
    username = models.CharField(max_length=150, unique=True)
    first_name = models.CharField(max_length=150, default='Unknown')
    last_name = models.CharField(max_length=150, default='Dude')
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=128)
    register_date = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=False)
    verification_token = models.UUIDField(default=uuid.uuid4, editable=False, unique=True)
    profile_image = models.URLField(default='https://www.flaticon.com/free-icon/profile-picture_12225881?term=profile&related_id=12225881')
    
    def __str__(self):
        return self.username

def dataset_upload_to(instance, filename):
    folder_name = instance.title.replace(" ", "_")
    return os.path.join('datasets', folder_name, filename)

class Dataset(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    upload_date = models.DateTimeField(auto_now_add=True)
    size = models.FloatField()
    dataset_type = models.CharField(max_length=50, choices=[('Text', 'Text'), ('Tabular', 'Tabular'), ('Image', 'Image'), ('Audio', 'Audio'), ('Video', 'Video')])
    views = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)
    files = models.FileField(upload_to=dataset_upload_to)

    def __str__(self):
        return self.title