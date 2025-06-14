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
    profile_image = models.CharField(max_length=255)
    
    def __str__(self):
        return self.username

def dataset_upload_to(instance, filename):
    folder_name = instance.title.replace(" ", "_")
    return os.path.join('datasets', folder_name, filename)

class Dataset(models.Model):
    owner = models.ForeignKey(GeneralUser, on_delete=models.CASCADE, related_name='datasets')
    title = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    upload_date = models.DateTimeField(auto_now_add=True)
    size = models.FloatField()
    files_count = models.IntegerField(default=0)
    dataset_type = models.CharField(max_length=50, choices=[('Text', 'Text'), ('Tabular', 'Tabular'), ('Image', 'Image'), ('Audio', 'Audio'), ('Video', 'Video')])
    views = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)
    downloads = models.IntegerField(default=0)
    folder_path = models.CharField(max_length=255)

    def __str__(self):
        return self.title

class LikesAndViewsDataset(models.Model):
    user = models.ForeignKey('GeneralUser', on_delete=models.CASCADE, related_name='dataItr')
    dataset = models.ForeignKey('Dataset', on_delete=models.CASCADE, related_name='dataItr')
    liked = models.BooleanField(default=False)
    viewed = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'dataset')

    def __str__(self):
        return f"{self.user.username} -> {self.dataset.title}"

class MLModel(models.Model):
    owner = models.ForeignKey(GeneralUser, on_delete=models.CASCADE, related_name='models')
    title = models.CharField(max_length=255, unique=True)
    description = models.TextField()
    upload_date = models.DateTimeField(auto_now_add=True)
    size = models.FloatField()
    model_type = models.CharField(max_length=50)
    views = models.IntegerField(default=0)
    likes = models.IntegerField(default=0)
    downloads = models.IntegerField(default=0)
    folder_path = models.CharField(max_length=255)

    def __str__(self):
        return self.title

class LikesAndViewsModel(models.Model):
    user = models.ForeignKey('GeneralUser', on_delete=models.CASCADE, related_name='modelItr')
    model = models.ForeignKey('MLModel', on_delete=models.CASCADE, related_name='modelItr')
    liked = models.BooleanField(default=False)
    viewed = models.BooleanField(default=False)
    timestamp = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user', 'model')

    def __str__(self):
        return f"{self.user.username} -> {self.model.title}"