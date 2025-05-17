from rest_framework import serializers
from .models import Dataset

class DatasetSerializer(serializers.ModelSerializer):
    class Meta:
        model = Dataset
        fields = ['owner', 'title', 'dataset_type', 'size', 'upload_date', 'files_count', 'views', 'likes']

