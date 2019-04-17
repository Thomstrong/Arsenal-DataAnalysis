from rest_framework import serializers

from kaoqins.models.kaoqin_event import KaoqinEvent
from kaoqins.models.kaoqin_record import KaoqinRecord
from kaoqins.models.kaoqin_type import KaoqinType
from students.api.serializers import StudentMiniSerializer


class KaoqinTypeSerializer(serializers.ModelSerializer):
    class Meta:
        model = KaoqinType
        fields = ('name',)


class KaoqinEventSerializer(serializers.ModelSerializer):
    type = KaoqinTypeSerializer()

    class Meta:
        model = KaoqinEvent
        fields = ('name', 'type')


class KaoqinRecordMiniSerializer(serializers.ModelSerializer):
    student = StudentMiniSerializer()
    event = KaoqinEventSerializer
    term = serializers.CharField(source='term.__unicode__')
    class Meta:
        model = KaoqinRecord
        fields = ('student', 'event', 'term')
