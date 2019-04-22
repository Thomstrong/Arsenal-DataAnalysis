from django.db.models import Count, Q
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
            return Response('base 输入有误', status=400)
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

        if base == 'enter_school':
            records = KaoqinRecord.objects.filter(
                Q(term__end_year=2019) | Q(term__start_year=2019),
                event_id=9900500,
            ).values('created_at')

            response_counter = [[0 for _ in range(24)] for _ in range(7)]
            for record in records:
                created_at = record['created_at']
                week_day = created_at.weekday()
                hour = created_at.hour
                response_counter[week_day - 1][hour] += 1
        return Response(response_counter)
