from django.db import models


class KaoqinType(models.Model):
    id = models.CharField(max_length=255, primary_key=True, null=False)
    name = models.CharField(max_length=255)

    def __unicode__(self):
        return self.name

    def __str__(self):
        return self.__unicode__()
