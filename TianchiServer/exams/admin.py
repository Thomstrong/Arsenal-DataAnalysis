from django.contrib import admin

from exams.models.exam import Exam
from exams.models.exam_record import ExamRecord
from exams.models.exam_type import ExamType


@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ('id', 'type', 'course', 'term', 'total_score', 'attend_num')
    search_fields = ('course__title',)
    list_filter = ('course__title', 'type__name', 'term')


@admin.register(ExamRecord)
class ExamRecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'exam', 'score',)
    search_fields = ('student',)
    list_filter = ('exam__course__title', 'student',)


@admin.register(ExamType)
class ExamTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name',)
    search_fields = ('name',)
