from rest_framework import serializers

from exams.models.exam_record import ClassExamRecord


class ClassExamSerializer(serializers.ModelSerializer):
    stu_class = serializers.CharField()
    exam_name = serializers.CharField(source='sub_exam.exam.name')

    class Meta:
        model = ClassExamRecord
        fields = ('stu_class', 'exam_name', 'total_score', 'attend_count', 'highest_score', 'lowest_score')
