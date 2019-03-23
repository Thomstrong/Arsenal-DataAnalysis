from datetime import datetime

from django.db import models

from students.models.student import Student


class Consumption(models.Model):
    created_at = models.DateTimeField(default=datetime.now, blank=True)
    cost = models.FloatField()
    student = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True)

    def __unicode__(self):
        return '{} cost {}'.format(self.student.name, self.cost)

    def __str__(self):
        return self.__unicode__()
