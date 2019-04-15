from rest_framework import serializers

from classes.models import Class


class ClassSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ('class_name', 'grade_name', 'campus_name')
