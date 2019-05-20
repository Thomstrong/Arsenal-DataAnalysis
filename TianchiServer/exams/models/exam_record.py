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
    z_score = models.FloatField(default=0.0)
    t_score = models.FloatField(default=0.0)
    deng_di = models.FloatField(default=0.0)
    class_rank = models.IntegerField(default=0)


class ClassExamRecord(models.Model):
    stu_class = models.ForeignKey(Class, on_delete=models.CASCADE, null=True, default=None)
    sub_exam = models.ForeignKey(SubExam, on_delete=models.CASCADE, null=True, default=None)
    total_score = models.FloatField(default=0.0)
    attend_count = models.IntegerField(default=0)
    highest_score = models.FloatField(default=0.0)
    lowest_score = models.FloatField(default=200.0)
    order = models.IntegerField(default=0)

    def update_score(self, score, is_add=True):
        if score < 0:
            return
        self.highest_score = max(self.highest_score, score)
        self.lowest_score = min(self.lowest_score, score)
        self.total_score += score if is_add else -score
        self.attend_count += 1 if is_add else -1
        self.save()


pre_save.connect(before_update_record, sender=StudentExamRecord)
post_save.connect(after_update_record, sender=StudentExamRecord)
pre_delete.connect(delete_exam_record, sender=StudentExamRecord)
