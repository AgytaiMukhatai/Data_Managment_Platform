from rest_framework import serializers
from .models import Dataset

class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = ['title', 'dataset_type', 'size', 'upload_date', 'views', 'likes']

