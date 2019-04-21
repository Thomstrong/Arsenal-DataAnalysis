# Create your views here.
from django.db.models import Avg, Sum
from rest_framework import viewsets, status
from rest_framework.decorators import list_route
from rest_framework.response import Response

from consumptions.api.serializers import ConsumptionSerializer, ConsumptionDailyDataSerializer
from consumptions.models import Consumption, DailyConsumption, HourlyConsumption
from utils.decorators import required_params


class ConsumptionViewSet(viewsets.ModelViewSet):
    queryset = Consumption.objects.all()
    serializer_class = ConsumptionSerializer

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
            records = DailyConsumption.objects.filter(
                date__gte='{}-01-01'.format(year)
            ).values('date').order_by('date').annotate(
                total_cost=-Sum('total_cost')
            ).values('date', 'total_cost')

            return Response(records)

    @required_params(params=['student_id'])
    @list_route(
        methods=['GET'],
    )
    def daily_sum(self, request):
        consumptions = DailyConsumption.objects.filter(
            student__id=request.query_params.get('student_id')
        ).select_related('student')
        if not consumptions:
            return Response(status=status.HTTP_404_NOT_FOUND)

        serializer = ConsumptionDailyDataSerializer({
            'consumption_data': consumptions,
        })

        return Response(serializer.data)

    @list_route(
        methods=['GET'],
    )
    def hourly_avg(self, request):
        records = HourlyConsumption.objects.order_by(
            'hour'
        ).values('hour').annotate(
            total_avg=-Avg('total_cost')
        )
        return Response(records)
