from django.db import models

from .kaoqin_type import KaoqinType


class KaoqinEvent(models.Model):
    event_name = models.CharField(max_length=255)
    type = models.ForeignKey(KaoqinType, null=True, on_delete=models.SET_NULL)

    def __unicode__(self):
        return '{}-{}'.format(
            self.type.__unicode__(),
            self.event_name
        )
