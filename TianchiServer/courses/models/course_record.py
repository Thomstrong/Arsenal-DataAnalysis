from django.db import models

from students.models.student import Student
from .course import Course


class CourseRecord(models.Model):
    student = models.ForeignKey(Student, null=False, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, null=False, on_delete=models.CASCADE)
    year = models.IntegerField(null=True)

    def __unicode__(self):
        return '{}-{}'.format(self.student.__unicode__(), self.course.name)

    def __str__(self):
        return self.__unicode__()
