from django.db import models
from django.db.models.signals import post_save, pre_delete, pre_save

from classes.models import Class
from exams.listeners import delete_exam_record, before_update_record, after_update_record
from exams.models.sub_exam import SubExam
from students.models.student import Student


class StudentExamRecord(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE, null=True)
    sub_exam = models.ForeignKey(SubExam, on_delete=models.CASCADE)
    score = models.FloatField(null=True, default=None)

    @property
    def z_score(self):
        raise NotImplementedError

    @property
    def t_score(self):
        raise NotImplementedError

    @property
    def dengdi(self):
        raise NotImplementedError


class ClassExamRecord(models.Model):
    stu_class = models.ForeignKey(Class, on_delete=models.CASCADE, null=True, default=None)
    sub_exam = models.ForeignKey(SubExam, on_delete=models.CASCADE, null=True, default=None)
    total_score = models.FloatField(default=0.0)
    attend_count = models.IntegerField(default=0)

    def update_score(self, score, is_add=True):
        if score < 0:
            return
        self.total_score += score if is_add else -score
        self.attend_count += 1 if is_add else -1


pre_save.connect(before_update_record, sender=StudentExamRecord)
post_save.connect(after_update_record, sender=StudentExamRecord)
pre_delete.connect(delete_exam_record, sender=StudentExamRecord)
