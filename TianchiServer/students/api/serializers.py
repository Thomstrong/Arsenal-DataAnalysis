from rest_framework import serializers

from students.models.student import Student


class StudentMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('id', 'name',)
