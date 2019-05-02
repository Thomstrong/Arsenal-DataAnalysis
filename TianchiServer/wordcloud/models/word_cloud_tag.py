# Create your models here.
from django.db import models


class WordCloudTag(models.Model):
    title = models.CharField('标签名称', max_length=255, null=False, blank=False)
    description = models.CharField('描述', max_length=255, default='')

    def __str__(self):
        return self.__unicode__()

    def __unicode__(self):
        return self.title
