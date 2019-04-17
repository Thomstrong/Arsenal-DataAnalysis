# Create your views here.
from django.db.models import Max, Min, Avg, Q, Count
from rest_framework import viewsets
from rest_framework.decorators import detail_route
from rest_framework.response import Response

from courses.models.course_record import CourseRecord
from exams.models.exam_record import StudentExamRecord
from kaoqins.models.kaoqin_record import KaoqinRecord
from students.api.serializers import StudentBasicInfoSerializer, StudentMiniSerializer
from students.models.student import Student
from students.models.student_record import StudentRecord
from teachers.models.teach_record import TeachRecord


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()

    def get_serializer_class(self, *args, **kwargs):
        if self.request.query_params.get('query', ''):
            return StudentMiniSerializer
        return StudentBasicInfoSerializer

    def list(self, request, *args, **kwargs):
        query = request.query_params.get('query', '')
        if query:
            q_filter = Q(id__startswith=query) | Q(name__contains=query)
            students = self.queryset.filter(
                q_filter,
            )[:50]
            return Response(self.get_serializer_class()(students, many=True).data)
        return Response(status=400, data={'reason': '不可以获取全部列表哦'})

    @detail_route(
        methods=['GET'],
    )
    def grade(self, request, pk):
        selected_courses = CourseRecord.objects.filter(
            student_id=pk
        ).values_list('course_id', flat=True)
        grade_filter = Q(sub_exam__course_id__in=selected_courses) | Q(sub_exam__course_id__in=[1, 2, 3])
        exam_records = StudentExamRecord.objects.filter(
            Q(student_id=pk),
            grade_filter,
            Q(score__gte=0)
        ).order_by('sub_exam__course_id').values('sub_exam__course_id').annotate(
            highest=Max('t_score'),
            lowest=Min('t_score'),
            average=Avg('t_score'),
        )

        return Response(exam_records)

    @detail_route(
        methods=['GET'],
    )
    def teachers(self, request, pk):
        last_study_record = StudentRecord.objects.filter(
            student_id=pk,
            term_id=9,
        ).select_related('stu_class').last()
        if not last_study_record:
            return Response([])

        teachers = TeachRecord.objects.filter(
            teach_class_id=last_study_record.stu_class.id
        ).values('teacher_id', 'teacher__name', 'course_id')
        return Response(teachers)

    @detail_route(
        methods=['GET'],
    )
    def kaoqin(self, request, pk):
        records = KaoqinRecord.objects.filter(
            student_id=pk,
            event_id__gte=9900100
        ).values('event__type_id', 'term').annotate(
            count=Count('id'),
        ).order_by('term__start_year').order_by('term__order')

        sumary = KaoqinRecord.objects.filter(
            student_id=pk,
            event_id__gte=9900100
        ).values('event__type_id').annotate(
            count=Count('event__type_id'),
        )

        return Response({
            'records': records,
            'summary': sumary,
        })
