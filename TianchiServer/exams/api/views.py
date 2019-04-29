# Create your views here.
from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response

from exams.api.serializers import ClassExamSerializer
from exams.models.exam_record import ClassExamRecord
from utils.decorators import required_params


class ClassExamViewSet(viewsets.ModelViewSet):
    queryset = ClassExamRecord.objects.all()
    serializer_class = ClassExamSerializer

    @required_params(params=['start_year', 'grade', 'course'])
    @list_route(
        methods=['GET']
    )
    def summary(self, request):
        start_year = request.query_params.get('start_year', '')
        grade = request.query_params.get('grade', '')
        course = request.query_params.get('course', '')
        if not start_year or not start_year.isdigit():
            return Response('start_year 输入有误', status=400)
        if not grade or not grade.isdigit():
            return Response('start_year 输入有误', status=400)
        if not course or not course.isdigit():
            return Response('start_year 输入有误', status=400)
        records = ClassExamRecord.objects.filter(
            sub_exam__exam__term__start_year=start_year,
            stu_class__grade_name=grade,
            sub_exam__course_id=course
        ).prefetch_related(
            'sub_exam__exam',
            'stu_class'
        ).order_by('sub_exam__started_at','stu_class__class_name')
        data = self.get_serializer_class()(records, many=True).data
        return Response(data)
