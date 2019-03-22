from django.contrib import admin

from teachers.models.teach_record import TeachRecord
from teachers.models.teacher import Teacher


@admin.register(Teacher)
class TeacherAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


@admin.register(TeachRecord)
class TeachRecordAdmin(admin.ModelAdmin):
    list_display = ('teacher', 'term', 'teach_class', 'course',)
    search_fields = ('teacher__name', 'teacher__id')
