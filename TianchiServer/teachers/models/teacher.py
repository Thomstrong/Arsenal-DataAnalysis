from django.db import models


class Teacher(models.Model):
    id = models.CharField('工号', unique=True, max_length=255, primary_key=True)
    name = models.CharField(max_length=255, null=False)

    def __unicode__(self):
        return '{}-{}'.format(
            self.id,
            self.name,
        )

    def __str__(self):
        return self.__unicode__()
