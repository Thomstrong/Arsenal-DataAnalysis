from django.db import models

from students.models.student import Student
from terms.models import Term
from .kaoqin_event import KaoqinEvent


class KaoqinRecord(models.Model):
    term = models.ForeignKey(Term, on_delete=models.SET_NULL, null=True)
    created_at = models.DateTimeField(null=False, auto_now=True)
    event = models.ForeignKey(KaoqinEvent, on_delete=models.SET_NULL, null=True)
    student = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True)

    @property
    def stu_class(self):
        return self.term.studentrecord_set.get(
            student=self.student
        ).stu_class
