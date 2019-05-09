# Create your views here.
from django.db.models import Count, Sum
from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response

from courses.api.serializers import CourseRecordSerializer, CourseSerializer
from courses.models.course import Course
from courses.models.course_record import CourseRecord
from utils.decorators import required_params
from wordcloud.constants import TagType
from wordcloud.models.tag_record import CourseTag
from wordcloud.models.word_cloud_tag import WordCloudTag

gaokao_selections = [4, 5, 6, 7, 8, 17, 59]
all_selections = ['6#8#17', '8#17#59', '5#6#59', '4#5#8', '6#7#59', '4#5#7', '5#8#17', '4#5#59', '5#8#59', '5#6#17',
                  '4#6#59', '5#7#8', '4#6#7', '5#17#59', '4#8#17', '6#8#59', '4#7#8', '6#17#59', '6#7#8', '4#17#59',
                  '7#8#59', '4#6#8', '4#5#17', '5#7#17', '4#6#17', '7#17#59', '4#7#17', '6#7#17', '4#8#59', '4#7#59',
                  '7#8#17', '5#6#8', '5#7#59', '4#5#6', '5#6#7']


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
            results = []
            for year in [2017, 2018, 2019]:
                records = CourseRecord.objects.filter(
                    year=year
                ).order_by(
                    'student_id', 'course_id'
                ).values('student_id', 'course_id')

                student_id = None
                selections = []
                counter = {
                    option: 0
                    for option in all_selections
                }
                for record in records:
                    if student_id is None:
                        student_id = record['student_id']
                    if record['student_id'] == student_id:
                        selections.append(str(record['course_id']))
                        continue
                    selection = '#'.join(selections)
                    counter[selection] += 1
                    student_id = record['student_id']
                    selections = [str(record['course_id'])]
                if selections:
                    selection = '#'.join(selections)
                    counter[selection] += 1

                results.append({
                    'year': year,
                    'data': counter
                })
            return Response(results)
        if type == 'pie_and_tree':
            year = request.query_params.get('year', 2019)
            records = CourseRecord.objects.filter(
                year=year
            ).order_by(
                'student_id', 'course_id'
            ).values('student_id', 'course_id')

            student_id = None
            selections = []
            counter = {
                option: 0
                for option in all_selections
            }
            total = 0
            for record in records:
                total += 1
                if student_id is None:
                    student_id = record['student_id']
                if record['student_id'] == student_id:
                    selections.append(str(record['course_id']))
                    continue
                selection = '#'.join(selections)
                counter[selection] += 1
                student_id = record['student_id']
                selections = [str(record['course_id'])]
            if selections:
                selection = '#'.join(selections)
                counter[selection] += 1

            counter_data = [{
                'courses': key,
                'value': counter[key]
            } for key in counter]

            return Response({
                'total': int(total / 3),
                'data': counter_data
            })


class CourseViewSet(viewsets.ModelViewSet):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

    @list_route(
        methods=['GET']
    )
    def tags(self, request):
        data = {}
        for course in [4, 5, 6, 7, 8, 17, 59, 61]:
            data[course] = CourseTag.objects.filter(
                course_id=course,
            ).values_list(
                'tag',
                'value'
            ).order_by('-value')[:150]

        tag_map = {}
        tags = WordCloudTag.objects.filter(
            type=TagType.Course
        ).values_list('id', 'title')

        for tag in tags:
            tag_map[tag[0]] = tag[1]

        summary = CourseTag.objects.values(
            'course_id'
        ).annotate(
            sum=Sum('value')
        ).order_by('-sum')

        return Response({
            'tagMap': tag_map,
            'data': data,
            'summary': summary
        })
