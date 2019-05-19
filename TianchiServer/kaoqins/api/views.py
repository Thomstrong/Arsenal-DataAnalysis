from django.db.models import Count, Q
from rest_framework import viewsets
from rest_framework.decorators import list_route
from rest_framework.response import Response
from rest_framework_extensions.cache.decorators import cache_response

from kaoqins.api.serializers import KaoqinRecordMiniSerializer
from kaoqins.models.kaoqin_record import KaoqinRecord
from utils.cache_funcs import ONE_MONTH
from utils.decorators import required_params


class KaoqinRecordViewSet(viewsets.ModelViewSet):
    queryset = KaoqinRecord.objects.all()

    def get_serializer_class(self, *args, **kwargs):
        return KaoqinRecordMiniSerializer

    @cache_response(ONE_MONTH)
    @required_params(params=['base'])
    @list_route(
        methods=['GET']
    )
    def summary(self, request):
        base = request.query_params.get('base', '')
        if not base:
            return Response('base 输入有误', status=400)
        if base == 'year':
            year = request.query_params.get('year', -1)
            if year == -1 or not year.isdigit():
                return Response('year error!', status=400)
            records = KaoqinRecord.objects.filter(
                Q(term__end_year=year) | Q(term__start_year=year),
                event_id__gte=9900100,
                event_id__lte=9900300,
            ).values('event__type_id').annotate(
                count=Count('id'),
            ).order_by('event__type_id')
            return Response(records)

        if base == 'enter_school':
            records = KaoqinRecord.objects.filter(
                Q(term__end_year=2019) | Q(term__start_year=2019),
                Q(event_id=9900400) | Q(event_id=9900500)
            ).values('created_at').order_by('created_at')

            response_counter = [[0 for _ in range(24)] for _ in range(7)]
            for record in records:
                created_at = record['created_at']
                week_day = created_at.weekday()
                hour = created_at.hour
                response_counter[week_day][hour] += 1
            return Response(response_counter)

        if base == 'mixed':
            records = KaoqinRecord.objects.raw(
                '''SELECT \"terms_term\".\"start_year\" AS \"id\", \"terms_term\".\"end_year\", \"kaoqins_kaoqinevent\".\"type_id\", \"classes_class\".\"grade_name\", 
COUNT(DISTINCT \"kaoqins_kaoqinrecord\".\"id\") AS \"count\" 
FROM \"kaoqins_kaoqinrecord\"
INNER JOIN \"kaoqins_kaoqinevent\" ON (\"kaoqins_kaoqinrecord\".\"event_id\" = \"kaoqins_kaoqinevent\".\"id\") 
LEFT OUTER JOIN \"students_studentrecord\" ON (\"kaoqins_kaoqinrecord\".\"student_id\" = \"students_studentrecord\".\"student_id\" AND \"kaoqins_kaoqinrecord\".\"term_id\" = \"students_studentrecord\".\"term_id\") 
LEFT OUTER JOIN \"terms_term\" ON (\"kaoqins_kaoqinrecord\".\"term_id\" = \"terms_term\".\"id\")
LEFT OUTER JOIN \"classes_class\" ON (\"students_studentrecord\".\"stu_class_id\" = \"classes_class\".\"id\") 
WHERE \"kaoqins_kaoqinrecord\".\"event_id\" IN ('9900100', '9900200', '9900300') 
GROUP BY \"terms_term\".\"start_year\", \"kaoqins_kaoqinevent\".\"type_id\", \"classes_class\".\"grade_name\", \"terms_term\".\"end_year\"
ORDER BY \"terms_term\".\"start_year\" ASC''')

            results = []

            for record in records:
                if not record.grade_name:
                    continue
                results.append({
                'term': '{}-{}'.format(record.id, record.end_year),
                'grade': record.grade_name,
                'type': record.type_id,
                'count': record.count,
            })
            return Response(results)

        return Response('request error', status=400)
