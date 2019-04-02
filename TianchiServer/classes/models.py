from django.db import models

from classes.constants import CLASS_CAMPUS_CHOICE
from classes.constants import CLASS_GRADE_CHOICE, Campus


class Class(models.Model):
    class_name = models.CharField(max_length=255, blank=False)
    grade_name = models.IntegerField(choices=CLASS_GRADE_CHOICE)
    campus_name = models.IntegerField(choices=CLASS_CAMPUS_CHOICE, default=Campus.Old)

    def __unicode__(self):
        return self.class_name

    def __str__(self):
        return self.__unicode__()
