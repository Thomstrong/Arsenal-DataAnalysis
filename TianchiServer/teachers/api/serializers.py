from rest_framework import serializers

from teachers.models.teach_record import TeachRecord
from teachers.models.teacher import Teacher


class TeacherSerializer(serializers.ModelSerializer):
    class Meta:
        model = Teacher
        fields = ('id', 'name')


class TeacherRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = TeachRecord
        fields = ('teacher', 'term', 'teach_class', 'course')
