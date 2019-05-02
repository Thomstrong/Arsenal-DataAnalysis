# Create your views here.
from rest_framework import viewsets

from wordcloud.api.serializers import WordCloudTagSerializer
from wordcloud.models.word_cloud_tag import WordCloudTag


class WordCloudTagViewSet(viewsets.ModelViewSet):
    queryset = WordCloudTag.objects.all()
    serializer_class = WordCloudTagSerializer



