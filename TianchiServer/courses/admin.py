from django.contrib import admin

from courses.models import Course


@admin.register(Course)
class CourseAdmin(admin.ModelAdmin):
    list_display = ('id', 'name')
    search_fields = ('name',)
