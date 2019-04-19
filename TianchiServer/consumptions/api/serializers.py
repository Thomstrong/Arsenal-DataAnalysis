from rest_framework import serializers

from consumptions.models import Consumption, DailyConsumption, HourlyConsumption
from students.api.serializers import StudentMiniSerializer


class ConsumptionSerializer(serializers.ModelSerializer):
    student = serializers.IntegerField(source='id')

    class Meta:
        model = Consumption
        fields = ('id', 'student', 'cost', 'created_at')


class DailyConsumptionSerializer(serializers.ModelSerializer):
    weekday = serializers.SerializerMethodField()
    class Meta:
        model = DailyConsumption
        fields = ('date', 'total_cost', 'weekday')
    def get_weekday(self, obj):
        return obj.date.weekday()

class HourlyConsumptionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HourlyConsumption
        fields = ('hour', 'total_cost')


class ConsumptionDailyDataSerializer(serializers.Serializer):
    consumption_data = serializers.ListField(child=DailyConsumptionSerializer())
    student = serializers.SerializerMethodField()

    def get_student(self, obj):
        consumption_data = obj.get('consumption_data', [])
        return StudentMiniSerializer(consumption_data[0].student).data if consumption_data else None
