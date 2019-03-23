from django.db import models

from classes.models import Class
from terms.models import Term
from .student import Student


class StudentRecord(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=True)
    stu_class = models.ForeignKey(Class, on_delete=models.SET_NULL, null=True, help_text='所在班级')
    term = models.ForeignKey(Term, on_delete=models.SET_NULL, null=True, help_text='学生所处学期')
