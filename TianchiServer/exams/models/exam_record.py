from django.db import models

from students.models.student import Student
from .exam import Exam


class ExamRecord(models.Model):
    student = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True)
    exam = models.ForeignKey(Exam, on_delete=models.SET_NULL, null=True)
    start_at = models.DateField()
    score = models.FloatField()
    z_score = models.FloatField()
    t_score = models.FloatField()
    dengdi = models.FloatField()


# todo post_save/post_delete add score to exam
