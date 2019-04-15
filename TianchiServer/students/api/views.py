# Create your views here.
from django.db.models import Max, Min, Avg, Q
from rest_framework import viewsets
from rest_framework.decorators import detail_route
from rest_framework.response import Response

from courses.models.course_record import CourseRecord
from exams.models.exam_record import StudentExamRecord
from students.api.serializers import StudentBasicInfoSerializer
from students.models.student import Student
from students.models.student_record import StudentRecord
from teachers.models.teach_record import TeachRecord


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()
    serializer_class = StudentBasicInfoSerializer

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
            return Response(status=404)

        teachers = TeachRecord.objects.filter(
            teach_class_id=last_study_record.stu_class.id
        ).values('teacher_id', 'teacher__name', 'course_id')
        return Response(teachers)
