# Create your views here.
from rest_framework import viewsets

from kaoqins.api.serializers import KaoqinRecordMiniSerializer
from kaoqins.models.kaoqin_record import KaoqinRecord


class KaoqinRecordViewSet(viewsets.ModelViewSet):
    queryset = KaoqinRecord.objects.all()

    def get_serializer_class(self, *args, **kwargs):
        return KaoqinRecordMiniSerializer
