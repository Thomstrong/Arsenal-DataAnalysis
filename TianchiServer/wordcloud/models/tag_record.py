# Create your models here.
from django.db import models

from students.models.student import Student
from .word_cloud_tag import WordCloudTag


class TagRecord(models.Model):
    tag = models.ForeignKey(WordCloudTag, on_delete=models.CASCADE, null=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=False)
    value = models.IntegerField('权重', default=0)
