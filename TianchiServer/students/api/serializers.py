from rest_framework import serializers

from students.models.student import Student


class StudentMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('id', 'name')


class StudentBasicInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('id', 'name', 'sex', 'nation', 'born_year', 'native_place', 'policy', 'is_left', 'is_stay_school')
