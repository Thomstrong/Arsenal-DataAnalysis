from datetime import datetime

from django.db import models
from django.db.models.signals import post_save

from consumptions.listeners import update_daily_hourly
from students.models.student import Student


class Consumption(models.Model):
    created_at = models.DateTimeField(default=datetime.now, blank=True)
    cost = models.FloatField()
    student = models.ForeignKey(Student, on_delete=models.SET_NULL, null=True)

    def __unicode__(self):
        return '{} cost {}'.format(self.student.name, self.cost)

    def __str__(self):
        return self.__unicode__()


class DailyConsumption(models.Model):
    date = models.DateField(default=datetime.now, blank=False)
    total_cost = models.FloatField(default=0.0)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=False)


class HourlyConsumption(models.Model):
    date = models.DateField(default=datetime.now, blank=False)
    hour = models.IntegerField(null=False, default=0)
    total_cost = models.FloatField(default=0.0)
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=False)


post_save.connect(update_daily_hourly, sender=Consumption)
