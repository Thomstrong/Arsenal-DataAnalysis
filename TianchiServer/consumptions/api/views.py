# Create your views here.
from django.db.models import Avg, Sum, Q, Count
from rest_framework import viewsets, status
from rest_framework.decorators import list_route
from rest_framework.response import Response

from consumptions.api.serializers import ConsumptionSerializer, ConsumptionDailyDataSerializer
from consumptions.models import Consumption, DailyConsumption, HourlyConsumption
from students.models.student_record import StudentRecord
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
            records = DailyConsumption.objects.values(
                'date'
            ).order_by('date').annotate(
                total_cost=-Sum('total_cost'),
            )

            return Response(records)
        if base == 'sex' or base == 'stay_school':
            field = 'student__sex' if base == 'sex' else 'student__is_stay_school'
            records = HourlyConsumption.objects.values(
                field,
                'hour'
            ).annotate(
                total_cost=-Avg('total_cost'),
                count=Count('id')
            ).values('hour', field, 'total_cost','count').order_by('hour')
            return Response(records)

        if base == 'grade':
            student_records = StudentRecord.objects.filter(
                Q(term__end_year=2019) | Q(term__start_year=2019),
                stu_class__grade_name__in=[1, 2, 3]
            ).values('student_id', 'stu_class__grade_name')

            student_grade_map = {}
            for record in student_records:
                grade = record['stu_class__grade_name']
                student_grade_map[grade] = student_grade_map.get(grade, [])
                student_grade_map[grade].append(record['student_id'])

            consumption_records = {}
            for grade in [1, 2, 3]:
                consumption_records[grade] = HourlyConsumption.objects.filter(
                    student_id__in=student_grade_map[grade]
                ).values('hour').annotate(
                    avg_cost=-Avg('total_cost'),
                    count=Count('id'),
                ).order_by('hour')
            return Response(consumption_records)

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
        records = HourlyConsumption.objects.values(
            'hour'
        ).annotate(
            total_avg=-Avg('total_cost')
        ).order_by('hour')
        return Response(records)
