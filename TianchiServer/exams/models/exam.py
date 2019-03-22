from django.db import models

from courses.models import Course
from terms.models import Term
from .exam_type import ExamType


class Exam(models.Model):
    type = models.ForeignKey(ExamType, on_delete=models.SET_NULL, null=True)
    course = models.ForeignKey(Course, on_delete=models.SET_NULL, null=True)
    term = models.ForeignKey(Term, on_delete=models.SET_NULL, null=True)

    total_score = models.FloatField(default=0.0)
    attend_num = models.IntegerField(default=0)

    def __unicode__(self):
        return '{}-{}-{}'.format(
            self.term.__unicode__(),
            self.type.__unicode__(),
            self.course.__unicode__(),
        )
