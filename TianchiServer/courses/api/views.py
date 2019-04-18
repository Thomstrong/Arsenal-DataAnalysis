# Create your views here.
from django.db.models import Count
from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response

from courses.api.serializers import CourseRecordSerializer
from courses.models.course_record import CourseRecord
from utils.decorators import required_params


class CourseRecordViewSet(viewsets.ModelViewSet):
    queryset = CourseRecord.objects.all()
    serializer_class = CourseRecordSerializer

    @required_params(params=['type'])
    @list_route(
        methods=['GET'],
    )
    def distribution(self, request):
        type = request.query_params.get('type', '')
        if not type:
            return Response('type 输入有误！', status=400)
        if type == 'selection':
            records = CourseRecord.objects.filter(
                year__gt=2016
            ).values(
                'course_id',
                'year',
                'student__sex',
            ).annotate(
                count=Count('student_id', distinct=True)
            )

            return Response(records)

        if type == 'course_percent':
            year = request.query_params.get('year', 2019)
            total = CourseRecord.objects.filter(year=year).count()

            records = CourseRecord.objects.filter(
                year=year
            ).values(
                'course_id',
            ).annotate(
                count=Count('student_id', distinct=True)
            ).order_by('count')

            return Response({
                'total': total,
                'records': records
            })
