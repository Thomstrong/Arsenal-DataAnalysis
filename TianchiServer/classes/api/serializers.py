from rest_framework import serializers

from classes.models import Class


class ClassMiniSerializer(serializers.ModelSerializer):
    start_year = serializers.SerializerMethodField()

    class Meta:
        model = Class
        fields = ('id', 'class_name', 'start_year')

    def get_start_year(self, obj):
        year = obj.studentrecord_set.select_related(
            'term'
        ).last().term.start_year
        return year


class ClassBasicSerializer(ClassMiniSerializer):
    class Meta:
        model = Class
        fields = ('id', 'class_name', 'campus_name', 'start_year')
