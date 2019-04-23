# Create your views here.
from django.db.models import Q
from rest_framework import viewsets
from rest_framework.decorators import detail_route
from rest_framework.response import Response

from classes.api.serializers import ClassBasicSerializer, ClassMiniSerializer
from classes.models import Class
from students.constants import SexType, PolicyType
from students.models.student_record import StudentRecord
from teachers.models.teach_record import TeachRecord


class ClassViewSet(viewsets.ModelViewSet):
    queryset = Class.objects.all()
    serializer_class = ClassBasicSerializer

    def get_serializer_class(self, *args, **kwargs):
        if self.request.query_params.get('query', ''):
            return ClassMiniSerializer
        return ClassBasicSerializer

    def list(self, request, *args, **kwargs):
        query = request.query_params.get('query', '')
        if not query:
            return Response(status=400, data={'reason': 'need query'})
        classes = self.queryset.filter(
            Q(id__startswith=query) | Q(class_name__contains=query),
        )[:50]
        return Response(self.get_serializer_class()(classes, many=True).data)

    @detail_route(
        methods=['GET']
    )
    def student_distribution(self, request, pk):
        student_records = StudentRecord.objects.filter(
            stu_class_id=pk
        ).select_related('student').values(
            'student__sex',
            'student__is_stay_school',
            'student__native_place',
            'student__policy'
        )
        boy_counter = 0
        stay_counter = 0
        local_count = 0
        policy_count = 0
        total = 0
        for record in student_records:
            total += 1
            if record['student__sex'] == SexType.boy:
                boy_counter += 1

            if record['student__is_stay_school']:
                stay_counter += 1
            if record['student__native_place'] and \
                    (record['student__native_place'].__contains__('浙江') or \
                     record['student__native_place'].__contains__('江苏')):
                local_count += 1
            if record['student__policy'] in [PolicyType.gcd, PolicyType.gqt]:
                policy_count += 1

        return Response({
            'total': total,
            'boy': boy_counter,
            'stay': stay_counter,
            'local': local_count,
            'policy': policy_count,
        })

    @detail_route(
        methods=['GET'],
    )
    def teachers(self, request, pk):
        teachers = TeachRecord.objects.filter(
            teach_class_id=pk
        ).values('teacher_id', 'teacher__name', 'course_id')
        return Response(teachers)
