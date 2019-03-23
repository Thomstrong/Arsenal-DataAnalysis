from django.db import models


class ExamType(models.Model):
    name = models.CharField(max_length=255, null=False)

    def __unicode__(self):
        return self.name

    def __str__(self):
        return self.__unicode__()
