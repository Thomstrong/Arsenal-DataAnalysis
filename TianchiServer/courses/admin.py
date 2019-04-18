from django.contrib import admin

from courses.models.course import Course
from courses.models.course_record import CourseRecord


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)


@admin.register(CourseRecord)
class CourseRecordAdmin(admin.ModelAdmin):
    list_display = ('id', 'student', 'course', 'year')
    search_fields = ('student__id',)
    list_filter = ('year',)
