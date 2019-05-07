# Create your models here.
from django.db import models

from wordcloud.constants import TAG_TYPE_CHOICE, TagType


class WordCloudTag(models.Model):
    title = models.CharField('标签名称', max_length=255, null=False, blank=False)
    type = models.IntegerField(choices=TAG_TYPE_CHOICE, default=TagType.Student)
    description = models.CharField('描述', max_length=255, default='')

    def __str__(self):
        return self.__unicode__()

    def __unicode__(self):
        return self.title
