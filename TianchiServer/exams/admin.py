from django.contrib import admin

from exams.models.exam import Exam
from exams.models.exam_record import ExamRecord
from exams.models.exam_type import ExamType
from exams.models.sub_exam import SubExam


@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ('id', '__unicode__')
    search_fields = ('name',)


@admin.register(ExamRecord)
class ExamRecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'sub_exam', 'score')
    search_fields = ('student', 'sub_exam__exam__name', 'sub_exam__course__name')
    list_filter = ('student', 'sub_exam__exam__name', 'sub_exam__course__name')


@admin.register(SubExam)
class SubExamRecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'started_at', '__unicode__', 'total_score', 'attend_num',)
    search_fields = ('exam__name', 'course__name')
    list_filter = ('exam__name', 'course__name')


@admin.register(ExamType)
class ExamTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name',)
    search_fields = ('name',)
