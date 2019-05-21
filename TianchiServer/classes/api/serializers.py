from rest_framework import serializers

from classes.models import Class


class ClassMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Class
        fields = ('id', 'class_name', 'start_year')


class ClassBasicSerializer(ClassMiniSerializer):
    class Meta:
        model = Class
        fields = ('id', 'class_name', 'campus_name', 'start_year')
