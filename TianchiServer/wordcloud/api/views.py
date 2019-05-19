# Create your views here.
from rest_framework import viewsets

from wordcloud.api.serializers import WordCloudTagSerializer
from wordcloud.constants import TagType
from wordcloud.models.word_cloud_tag import WordCloudTag


class WordCloudTagViewSet(viewsets.ModelViewSet):
    queryset = WordCloudTag.objects.filter(type=TagType.Student) # just get student map only
    serializer_class = WordCloudTagSerializer



