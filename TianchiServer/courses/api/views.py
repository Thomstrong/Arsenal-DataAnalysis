# Create your views here.
from django.db.models import Count
from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response

from courses.api.serializers import CourseRecordSerializer
from courses.models.course_record import CourseRecord
from utils.decorators import performance_analysis


class CourseRecordViewSet(viewsets.ModelViewSet):
    queryset = CourseRecord.objects.all()
    serializer_class = CourseRecordSerializer

    @performance_analysis(True)
    @list_route(
        methods=['GET'],
    )
    def distribution(self, request):
        records = CourseRecord.objects.filter(
            year__gt=2016
        ).values(
            'course__name',
            'year',
            'student__sex',
        ).annotate(
            count=Count('student_id', distinct=True)
        )

        return Response(records)
