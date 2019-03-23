from django.db import models
from django.db.models.signals import post_save, pre_delete, pre_save

from exams.listeners import delete_exam_record, before_update_record, after_update_record
from exams.models.sub_exam import SubExam
from students.models.student import Student


class ExamRecord(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
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


pre_save.connect(before_update_record, sender=ExamRecord)
post_save.connect(after_update_record, sender=ExamRecord)
pre_delete.connect(delete_exam_record, sender=ExamRecord)
