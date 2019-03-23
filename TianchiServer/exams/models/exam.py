from django.db import models

from terms.models import Term
from .exam_type import ExamType


class Exam(models.Model):
    type = models.ForeignKey(ExamType, on_delete=models.SET_NULL, null=True)
    term = models.ForeignKey(Term, on_delete=models.SET_NULL, null=True)
    name = models.CharField(max_length=255, null=True, blank=True)

    def __unicode__(self):
        return '{}-{}'.format(
            self.term.__unicode__(),
            self.name,
        )

    def __str__(self):
        return self.__unicode__()
