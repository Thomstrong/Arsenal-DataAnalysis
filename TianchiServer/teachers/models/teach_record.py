from django.db import models

from classes.models import Class
from courses.models.course import Course
from teachers.models.teacher import Teacher
from terms.models import Term


class TeachRecord(models.Model):
    teacher = models.ForeignKey(Teacher, null=True, on_delete=models.SET_NULL)
    term = models.ForeignKey(Term, null=True, on_delete=models.SET_NULL, help_text='任教学期')
    teach_class = models.ForeignKey(Class, null=True, on_delete=models.SET_NULL, help_text='任教班级')
    course = models.ForeignKey(Course, null=True, on_delete=models.SET_NULL, help_text='任教课程')
