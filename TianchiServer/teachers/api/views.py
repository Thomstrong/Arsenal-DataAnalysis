# Create your views here.
from django.db.models import Count
from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response
from rest_framework_extensions.cache.decorators import cache_response

from teachers.api.serializers import TeacherSerializer
from teachers.models.teach_record import TeachRecord
from teachers.models.teacher import Teacher
from utils.cache_funcs import ONE_MONTH


class TeacherViewSet(viewsets.ModelViewSet):
    queryset = Teacher.objects.all()
    serializer_class = TeacherSerializer

    @cache_response(ONE_MONTH)
    @list_route(
        methods=['GET']
    )
    def summary(self, request):
        records = TeachRecord.objects.filter(
            term__end_year=2019,
            teach_class__grade_name__isnull=False
        ).values('teach_class__grade_name', 'course_id').annotate(
            count=Count('teacher_id', distinct=True)
        )

        total = TeachRecord.objects.filter(
            term__end_year=2019,
            teach_class__grade_name__isnull=False
        ).aggregate(Count('teacher_id', distinct=True))['teacher_id__count']

        formatted_records = []
        for record in records:
            formatted_records.append({
                'grade': record['teach_class__grade_name'],
                'course': record['course_id'],
                'count': record['count']
            })

        return Response({
            'records': formatted_records,
            'total': total
        })
