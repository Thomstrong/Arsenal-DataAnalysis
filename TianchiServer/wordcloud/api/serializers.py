from rest_framework import serializers

from students.api.serializers import StudentMiniSerializer
from wordcloud.models.tag_record import TagRecord
from wordcloud.models.word_cloud_tag import WordCloudTag


class WordCloudTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = WordCloudTag
        fields = ('id', 'title',)


class TagRecordSerializer(serializers.ModelSerializer):
    student = StudentMiniSerializer()
    tag = WordCloudTagSerializer()

    class Meta:
        model = TagRecord
        fields = ('tag', 'student',)
