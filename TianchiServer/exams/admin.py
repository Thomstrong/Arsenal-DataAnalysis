from django.contrib import admin

from exams.models.exam import Exam
from exams.models.exam_record import StudentExamRecord, ClassExamRecord
from exams.models.exam_type import ExamType
from exams.models.sub_exam import SubExam


@admin.register(Exam)
class ExamAdmin(admin.ModelAdmin):
    list_display = ('id', '__unicode__')
    search_fields = ('name',)


@admin.register(StudentExamRecord)
class StudentExamRecordAdmin(admin.ModelAdmin):
    list_display = ('sub_exam_id', 'student', 'sub_exam', 'score', 't_score', 'z_score', 'deng_di')
    search_fields = ('sub_exam__id','student__id',)
    list_filter = ('sub_exam__exam__type__name', 'sub_exam__exam__name', 'sub_exam__course__name')


@admin.register(SubExam)
class SubExamRecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'started_at', '__unicode__', 'total_score', 'attend_num',)
    search_fields = ('exam__name', 'course__name')
    list_filter = ('exam__type', 'exam__name', 'course__name')


@admin.register(ClassExamRecord)
class ClassExamRecordAdmin(admin.ModelAdmin):
    list_display = (
    'id', 'stu_class', 'sub_exam', 'total_score', 'attend_count', 'highest_score', 'lowest_score', 'order')
    search_fields = ('stu_class__id', 'id')
    list_filter = ('sub_exam__exam__type', 'sub_exam',)


@admin.register(ExamType)
class ExamTypeAdmin(admin.ModelAdmin):
    list_display = ('id', 'name',)
    search_fields = ('name',)
