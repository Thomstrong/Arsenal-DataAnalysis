# Create your models here.
from django.db import models

from courses.models.course import Course
from students.models.student import Student
from .word_cloud_tag import WordCloudTag


class TagRecord(models.Model):
    tag = models.ForeignKey(WordCloudTag, on_delete=models.CASCADE, null=False)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=False)
    value = models.IntegerField('权重', default=0)

class CourseTag(models.Model):
    tag = models.ForeignKey(WordCloudTag, on_delete=models.CASCADE, null=False)
    course = models.ForeignKey(Course, on_delete=models.CASCADE, null=False)
    value = models.IntegerField('权重', default=0)
