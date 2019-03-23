from django.db import models

from .kaoqin_type import KaoqinType


class KaoqinEvent(models.Model):
    id = models.CharField(max_length=255, primary_key=True, null=False)
    name = models.CharField(max_length=255)
    type = models.ForeignKey(KaoqinType, null=True, on_delete=models.SET_NULL)

    def __unicode__(self):
        return '{}-{}'.format(
            self.type.__unicode__(),
            self.name
        )

    def __str__(self):
        return self.__unicode__()
