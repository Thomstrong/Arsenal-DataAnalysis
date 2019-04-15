# Create your views here.

from rest_framework import viewsets, status
from rest_framework.decorators import list_route
from rest_framework.response import Response

from consumptions.api.serializers import ConsumptionSerializer, ConsumptionDailyDataSerializer
from consumptions.models import Consumption, DailyConsumption
from utils.decorators import required_params


class ConsumptionViewSet(viewsets.ModelViewSet):
    queryset = Consumption.objects.all()
    serializer_class = ConsumptionSerializer

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
