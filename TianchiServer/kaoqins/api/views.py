# Create your views here.
from django.db.models import Count
from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response

from kaoqins.api.serializers import KaoqinRecordMiniSerializer
from kaoqins.models.kaoqin_record import KaoqinRecord
from utils.decorators import required_params


class KaoqinRecordViewSet(viewsets.ModelViewSet):
    queryset = KaoqinRecord.objects.all()

    def get_serializer_class(self, *args, **kwargs):
        return KaoqinRecordMiniSerializer

    @required_params(params=['base'])
    @list_route(
        methods=['GET']
    )
    def summary(self, request):
        base = request.query_params.get('base', '')
        if not base:
            return Response('type 输入有误', status=400)
        if base == 'year':
            year = request.query_params.get('year', -1)
            if year == -1 or not year.isdigit():
                return Response('year error!', status=400)
            records = KaoqinRecord.objects.filter(
                created_at__gte='{}-01-01'.format(year),
                event_id__gte=9900100
            ).values('event__type_id').annotate(
                count=Count('id'),
            ).order_by('event__type_id')
            return Response(records)
        return Response('request', status=400)
