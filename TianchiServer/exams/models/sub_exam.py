from datetime import datetime

from django.db import models

from courses.models import Course
from exams.models.exam import Exam


class SubExam(models.Model):
    exam = models.ForeignKey(Exam, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True)
    started_at = models.DateField(null=False, default=datetime.now)
    total_score = models.FloatField(default=0.0)
    attend_num = models.IntegerField(default=0)

    def update_score(self, score, is_add=True):
        if score < 0:
            return 
        self.total_score += score if is_add else -score
        self.attend_num += 1 if is_add else -1
        self.save()

    def __unicode__(self):
        return '{}-{}'.format(
            self.exam.__unicode__(),
            self.course.__unicode__(),
        )

    def __str__(self):
        return self.__unicode__()
