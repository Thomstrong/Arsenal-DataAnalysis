from django.contrib import admin

from students.models.student import Student
from students.models.student_record import StudentRecord


@admin.register(Student)
class StudentAdmin(admin.ModelAdmin):
    list_display = ('id', 'name', 'sex', 'is_left', 'is_stay_school')
    list_filter = ('is_stay_school',)
    search_fields = ('id','nation')


@admin.register(StudentRecord)
class StudentRecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'stu_class', 'term',)
    search_fields = ('student__id', 'stu_class__id')
    list_filter = ('term', 'stu_class')
