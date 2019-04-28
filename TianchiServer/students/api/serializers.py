from rest_framework import serializers

from classes.api.serializers import ClassMiniSerializer
from students.models.student import Student


class StudentMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('id', 'name')


class StudentBasicInfoSerializer(serializers.ModelSerializer):
    stu_class = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = (
            'id', 'name', 'sex',
            'nation', 'born_year',
            'native_place', 'policy',
            'is_left', 'is_stay_school',
            'room_num',
            'stu_class'
        )

    def get_stu_class(self, obj):
        return ClassMiniSerializer(obj.studentrecord_set.select_related('stu_class').order_by(
            'term__start_year'
        ).last().stu_class).data
