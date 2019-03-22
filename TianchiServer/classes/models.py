from django.db import models

from classes.constants import CLASS_GRADE_CHOICE


class Class(models.Model):
    class_name = models.CharField(max_length=255, blank=False)
    grade_name = models.IntegerField(choices=CLASS_GRADE_CHOICE)

    def __unicode__(self):
        return self.class_name

