from rest_framework import serializers

from students.models.student import Student
from classes.api.serializers import ClassSerializer
from teachers.api.serializers import TeacherSerializer


class StudentMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('id', 'name')

class StudentBasicInfoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields =('id','name','sex','nation','born_year','native_place','is_stay_school')

class StudentInfoSerializer(serializers.Serializer):
    student_basic_info = StudentBasicInfoSerializer()
    student_class_info = ClassSerializer()
    teacher_info = TeacherSerializer()