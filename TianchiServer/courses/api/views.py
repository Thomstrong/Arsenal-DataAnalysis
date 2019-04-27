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
        if type == 'arc_count':
            gaokao_selections = [4, 5, 6, 7, 8, 17, 59]
            course_count = len(gaokao_selections)
            index_map = {
                gaokao_selections[i]: i
                for i in range(len(gaokao_selections))
            }
            year = request.query_params.get('year', 2019)
            records = CourseRecord.objects.filter(
                year=year
            ).order_by(
                'student_id'
            ).values('student_id', 'course_id')

            student_id = None
            selections = []
            selection_matrix = [[0 for _ in range(course_count)] for _ in range(course_count)]
            for record in records:
                if student_id is None:
                    student_id = record['student_id']
                if record['student_id'] == student_id:
                    selections.append(record['course_id'])
                    continue

                for i, j in [(0, 1), (0, 2), (1, 2)]:
                    course_i = selections[i]
                    course_j = selections[j]
                    selection_matrix[index_map[course_i]][index_map[course_j]] += 1
                    selection_matrix[index_map[course_j]][index_map[course_i]] += 1
                student_id = record['student_id']
                selections = [record['course_id']]
            for i, j in [(0, 1), (0, 2), (1, 2)]:
                course_i = selections[i]
                course_j = selections[j]
                selection_matrix[index_map[course_i]][index_map[course_j]] += 1
                selection_matrix[index_map[course_j]][index_map[course_i]] += 1

            edges = []
            for i in range(course_count):
                for j in range(i + 1, course_count):
                    edges.append({
                        "source": gaokao_selections[i],
                        "target": gaokao_selections[j],
                        "sourceWeight": selection_matrix[i][j],
                        "targetWeight": selection_matrix[i][j]
                    })
            return Response({
                'nodes': gaokao_selections,
                'edges': edges
            })
        if type == '3_in_7':
            return Response([])
        if type == 'pie_data':
            return Response([])
        if type == 'polygon_tree':
            return Response([])
