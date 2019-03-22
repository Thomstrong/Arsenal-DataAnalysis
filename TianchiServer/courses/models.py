from django.db import models


class Course(models.Model):
    title = models.CharField(max_length=255, blank=False, null=False)

    def __unicode__(self):
        return self.title
