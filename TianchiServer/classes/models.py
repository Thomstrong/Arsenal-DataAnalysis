from django.db import models
from django.db.models.signals import pre_save

from classes.constants import CLASS_CAMPUS_CHOICE
from classes.constants import CLASS_GRADE_CHOICE, Campus
from classes.listeners import check_campus


class Class(models.Model):
    class_name = models.CharField(max_length=255, blank=False)
    grade_name = models.IntegerField(choices=CLASS_GRADE_CHOICE)
    campus_name = models.IntegerField(choices=CLASS_CAMPUS_CHOICE, default=Campus.Old)

    def __unicode__(self):
        return '{}-{}'.format(str(self.id), self.class_name)

    def __str__(self):
        return self.__unicode__()


pre_save.connect(check_campus, sender=Class)
