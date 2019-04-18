from rest_framework import serializers

from courses.models.course_record import CourseRecord


class CourseRecordSerializer(serializers.ModelSerializer):
    student = serializers.IntegerField(source='id')
    course = serializers.IntegerField(source='id')

    class Meta:
        model = CourseRecord
        fields = ('student', 'course')
