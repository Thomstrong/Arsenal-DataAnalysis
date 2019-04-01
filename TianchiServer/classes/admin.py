from django.contrib import admin

from classes.models import Class


@admin.register(Class)
class ClassAdmin(admin.ModelAdmin):
    list_display = ('id', 'class_name', 'grade_name','campus_name')
    list_filter = ('grade_name',)
    search_fields = ('class_name', 'id')
