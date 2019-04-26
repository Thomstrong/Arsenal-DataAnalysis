from rest_framework import serializers

from students.models.student import Student


class StudentMiniSerializer(serializers.ModelSerializer):
    class Meta:
        model = Student
        fields = ('id', 'name')


class StudentBasicInfoSerializer(serializers.ModelSerializer):
    class_id = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = (
            'id', 'name', 'sex',
            'nation', 'born_year',
            'native_place', 'policy',
            'is_left', 'is_stay_school',
            'class_id'
        )

    def get_class_id(self, obj):
        return obj.studentrecord_set.select_related('stu_class').order_by(
            'term__start_year'
        ).last().stu_class.id
