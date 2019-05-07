from rest_framework import serializers

from courses.models.course import Course
from courses.models.course_record import CourseRecord


class CourseSerializer(serializers.ModelSerializer):
    class Meta:
        model = Course
        fields = ('id', 'name')


class CourseRecordSerializer(serializers.ModelSerializer):
    student = serializers.IntegerField(source='id')
    course = serializers.IntegerField(source='id')

    class Meta:
        model = CourseRecord
        fields = ('student', 'course')
