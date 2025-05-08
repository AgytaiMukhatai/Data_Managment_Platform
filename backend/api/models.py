from django.db import models
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

class Dataset(models.Model):
    # Foreign Key to link to the user who uploaded the dataset
    user = models.ForeignKey(GeneralUser, on_delete=models.CASCADE, related_name='datasets')
    name = models.CharField(max_length=255)
    description = models.TextField()
    size = models.FloatField()
    dataset_type = models.CharField(max_length=50, choices=[('Text', 'Text'), ('Tabular', 'Tabular'), ('Image', 'Image'), ('Audio', 'Audio'), ('Video', 'Video')])
    upload_date = models.DateTimeField(auto_now_add=True)
    likes = models.IntegerField(default=0)
    views = models.IntegerField(default=0)
    file_link = models.URLField()

    def __str__(self):
        return self.name