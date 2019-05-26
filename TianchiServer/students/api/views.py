# Create your views here.
import datetime
from datetime import timedelta

from dateutil.parser import parse as parse_date
from django.db.models import Max, Min, Avg, Q, Count, Sum, F
from rest_framework import viewsets
from rest_framework.decorators import detail_route, list_route
from rest_framework.response import Response

from consumptions.api.serializers import DailyConsumptionSerializer
from consumptions.models import DailyConsumption, HourlyConsumption, Consumption
from courses.models.course_record import CourseRecord
from exams.models.exam_record import StudentExamRecord
from kaoqins.models.kaoqin_record import KaoqinRecord
from students.api.serializers import StudentBasicInfoSerializer, StudentMiniSerializer
from students.models.student import Student
from students.models.student_record import StudentRecord
from teachers.models.teach_record import TeachRecord
from utils.decorators import required_params
from utils.pridictions import Predictor
from wordcloud.models.tag_record import TagRecord

gaokao_courses = [1, 2, 3, 4, 5, 6, 7, 8, 17, 59]


class StudentViewSet(viewsets.ModelViewSet):
    queryset = Student.objects.all()

    def get_serializer_class(self, *args, **kwargs):
        if self.request.query_params.get('query', ''):
            return StudentMiniSerializer
        return StudentBasicInfoSerializer

    def list(self, request, *args, **kwargs):
        query = request.query_params.get('query', '')
        if query:
            q_filter = (Q(id__startswith=query) | Q(name__contains=query)) & ~Q(name='未知')
            students = self.queryset.filter(
                q_filter,
            ).order_by('is_left')[:50]
            return Response(self.get_serializer_class()(students, many=True).data)
        return Response(status=400, data={'reason': '不可以获取全部列表哦'})

    @required_params(params=['base'])
    @list_route(
        methods=['GET']
    )
    def summary(self, request):
        base = request.query_params.get('base', '')
        if not base:
            return Response('type 输入有误', status=400)
        record_filter = (Q(term__end_year=2019) | Q(term__start_year=2019)) & Q(student__is_left=False)
        if base == 'campus':
            records = StudentRecord.objects.filter(
                record_filter
            ).values('stu_class__campus_name').annotate(
                count=Count('student_id', distinct=True)
            ).values('stu_class__campus_name', 'count')

            total = Student.objects.all().count()
            result = [{
                'campus_name': record['stu_class__campus_name'],
                'count': record['count']
            } for record in records]
            return Response({
                'result': result,
                'total': total
            })

        if base == 'stay_school':
            record = StudentRecord.objects.filter(
                record_filter
            ).values('student__is_stay_school', 'student__sex').annotate(
                count=Count('student_id', distinct=True)
            ).values('student__is_stay_school', 'student__sex', 'count')
            return Response(record)

        if base == 'grade':
            record = StudentRecord.objects.filter(
                record_filter
            ).values('stu_class__grade_name', 'student__sex').annotate(
                count=Count('student_id', distinct=True)
            ).values('stu_class__grade_name', 'student__sex', 'count')
            return Response(record)

        if base == 'nation':
            record = StudentRecord.objects.filter(
                record_filter
            ).values('student__nation').annotate(
                count=Count('student_id', distinct=True)
            ).values('student__nation', 'count').order_by('-count')
            return Response(record)

        if base == 'policy':
            record = StudentRecord.objects.filter(
                record_filter
            ).values('student__policy').annotate(
                count=Count('student_id', distinct=True)
            ).values('student__policy', 'count').order_by('-count')
            return Response(record)

        if base == 'native_place':
            record = StudentRecord.objects.filter(
                record_filter
            ).values('student__native_place').annotate(
                count=Count('student_id', distinct=True)
            ).values('student__native_place', 'count').order_by('-count')
            return Response(record)

        return Response('请求错误', status=400)

    @required_params(params=['type'])
    @detail_route(
        methods=['GET'],
    )
    def grade(self, request, pk):
        type = request.query_params.get('type', '')
        if not type:
            return Response('type 输入有误', status=400)

        if type == 'radar':
            selected_courses = CourseRecord.objects.filter(
                student_id=pk
            ).values_list('course_id', flat=True)
            if not selected_courses:
                selected_courses = gaokao_courses
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

        score_type = request.query_params.get('score_type', '')
        score_types = ['t_score', 'z_score', 'score', 'deng_di', 'class_rank']
        if score_type not in score_types:
            return Response('score_type must in {}'.format(','.join(score_types)), status=400)

        if type == 'total_trend':
            if score_type == 'class_rank':
                records = StudentExamRecord.objects.filter(
                    student_id=pk,
                    sub_exam__course_id=60,
                    class_rank__gt=0
                ).order_by('sub_exam__started_at').values(
                    'sub_exam__exam__name'
                ).annotate(
                    total_score=Sum(score_type)
                ).values(
                    'sub_exam__exam__name',
                    'sub_exam__exam__type_id',
                    'total_score'
                )
                return Response(records)
            records = StudentExamRecord.objects.filter(
                student_id=pk,
                sub_exam__course_id__in=gaokao_courses,
                score__gt=0
            ).order_by('sub_exam__started_at').values(
                'sub_exam__exam__name'
            ).annotate(
                total_score=Sum(score_type) if not (score_type == 'deng_di' or score_type == 'z_score') else Avg(
                    score_type)
            ).values(
                'sub_exam__exam__name',
                'sub_exam__exam__type_id',
                'total_score'
            )
            return Response(records)

        if type == 'subject_trend':
            records = StudentExamRecord.objects.filter(
                Q(class_rank__gt=0) if score_type == 'class_rank' else Q(score__gt=0),
                student_id=pk,
                sub_exam__course_id__in=gaokao_courses,
            ).order_by('sub_exam__started_at').values(
                'sub_exam__exam__name'
            ).values(
                'sub_exam__exam__name',
                'sub_exam__exam__type_id',
                'sub_exam__course_id',
                score_type
            )

            formated_records = {}
            for record in records:
                if record['sub_exam__course_id'] not in formated_records:
                    formated_records[record['sub_exam__course_id']] = []
                formated_records[record['sub_exam__course_id']].append({
                    'exam': record['sub_exam__exam__name'],
                    'type': record['sub_exam__exam__type_id'],
                    'score': record.get(score_type)
                })
            return Response(formated_records)

        return Response('请求错误', status=400)

    @detail_route(
        methods=['GET'],
    )
    def teachers(self, request, pk):
        last_study_record = StudentRecord.objects.filter(
            student_id=pk,
            term__end_year=2019,
        ).select_related('term', 'stu_class').last()
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
            count=Count('id'),
        ).order_by('-count')

        return Response({
            'records': records,
            'summary': sumary,
        })

    @required_params(params=['type', 'date'])
    @detail_route(
        methods=['GET'],
    )
    def consumptions(self, request, pk):
        info_type = request.query_params.get('type', '')
        if not info_type:
            return Response(status=400)

        if info_type == 'daily_detail':
            time_stamp = int(request.query_params.get('date', 0))
            date = datetime.datetime.fromtimestamp(time_stamp / 1e3)
            records = Consumption.objects.filter(
                created_at__gte=date.date(),
                created_at__lt=date.date() + timedelta(days=1),
                student_id=pk,
            ).order_by('created_at').values('created_at', 'cost')

            formatted_records = []

            for record in records:
                formatted_records.append({
                    'time': record['created_at'].time(),
                    'cost': -record['cost'],
                })
            return Response(formatted_records)

        if info_type == 'hourly_avg':
            records = HourlyConsumption.objects.filter(
                student_id=pk,
            ).order_by('hour').values('hour').annotate(
                avg_cost=-Avg('total_cost')
            )
            return Response(records)

        if info_type == 'daily_sum':
            records = DailyConsumption.objects.filter(
                student_id=pk,
            ).order_by('date').values('date').annotate(
                total=-Sum('total_cost')
            )

            if not records:
                return Response([])

            record_count = len(records)
            i = 1
            info_pairs = []
            costs = []
            while i < record_count:
                last_day_record = records[i - 1]
                info_pairs.append([
                    last_day_record['total'],
                    last_day_record['date'].weekday()
                ])
                costs.append(records[i]['total'])
                i += 1

            predict_cost = -1
            tomorrow_date = records[i - 1]['date'] + timedelta(days=1)
            if costs:
                predict_data = [records[i - 1]['total'], tomorrow_date.weekday()]
                predict_cost = Predictor.bayes_predict(info_pairs, costs, predict_data)

            result = list(records) + [{
                'date': tomorrow_date,
                'total': float('%.1f' % predict_cost)
            }]

            average = DailyConsumption.objects.filter(
                student_id=pk,
            ).values('student_id').annotate(
                avg=-Avg('total_cost')
            ).values('avg')[0]['avg']

            total = DailyConsumption.objects.values_list('student_id', flat=True).distinct().count()
            rank = DailyConsumption.objects.values('student_id').annotate(
                avg=-Avg('total_cost')
            ).filter(avg__gt=average).count()

            return Response({
                'result': result,
                'avg': average,
                'rank': 1 - rank / total
            })
        date_range = request.query_params.get('date_range', None)
        if not date_range or not date_range.isdigit():
            return Response('range error')
        date_range = int(date_range)

        if info_type == 'hourly':
            date = parse_date(request.query_params['date']).date()
            records = HourlyConsumption.objects.filter(
                student_id=pk,
                date__range=[
                    date - timedelta(days=date_range),
                    date
                ]
            ).order_by('hour').values('hour').annotate(
                avg_cost=Avg('total_cost')
            ).values('hour', 'avg_cost')

            global_records = HourlyConsumption.objects.filter(
                date__range=[
                    date - timedelta(days=date_range),
                    date
                ]
            ).order_by('hour').values('hour').annotate(
                avg_cost=Avg('total_cost')
            ).values('hour', 'avg_cost')
            return Response({
                'student_data': records,
                'global_data': global_records,
            })

        if info_type == 'predict':
            date = parse_date(request.query_params['date']).date()
            daily_data = DailyConsumption.objects.filter(
                student_id=pk,
                date__range=[
                    date - timedelta(days=date_range),
                    date + timedelta(days=date_range - 1)
                ]
            ).order_by('date').annotate(
                offset=F('date') - date
            )

            last_cycle_data = []
            i = 0
            for data in daily_data:
                if data.date < date:
                    data.offset += (date_range + 1)
                    last_cycle_data.append(data)
                    i += 1
                    continue
                break
            this_cycle_data = daily_data[i:]

            return Response({
                'date': date,
                'date_range': date_range,
                'this_cycle_data': DailyConsumptionSerializer(this_cycle_data, many=True).data,
                'last_cycle_data': DailyConsumptionSerializer(last_cycle_data, many=True).data,
                'predict_data': [],
            })

    @required_params(params=['with', 'type'])
    @detail_route(
        methods=['GET'],
    )
    def compare(self, request, pk):
        info_type = request.query_params.get('type', '')
        if not info_type:
            return Response(status=400)

        another_id = request.query_params.get('with', '')
        if not another_id:
            return Response(status=400)

        if info_type == 'grade':
            exam_records = StudentExamRecord.objects.filter(
                student_id__in=[pk, another_id],
                sub_exam__course_id__in=gaokao_courses,
                score__gte=0
            ).select_related(
                'student'
            ).order_by('sub_exam__course_id').values('sub_exam__course_id', 'student__name', 'student_id').annotate(
                average=Avg('t_score'),
            )
            formatted_records = []

            for record in exam_records:
                formatted_records.append({
                    'course': record['sub_exam__course_id'],
                    'student': '{}-{}'.format(record['student_id'], record['student__name']),
                    'average': float('%.2f' % record['average']),
                })
            return Response(formatted_records)
        if info_type == 'kaoqin':
            records = KaoqinRecord.objects.filter(
                student_id__in=[pk, another_id],
                event_id__gte=9900100
            ).select_related(
                'student'
            ).values('student_id', 'event__type_id').annotate(
                count=Count('id'),
            ).values('student_id', 'student__name', 'event__type_id', 'count')

            chat_records = StudentExamRecord.objects.filter(
                student_id__in=[pk, another_id],
                score=-1
            ).select_related(
                'student'
            ).values('student_id').annotate(
                count=Count('id'),
            ).values('student_id', 'student__name', 'count')
            formatted_records = []
            for record in records:
                formatted_records.append({
                    'student': '{}-{}'.format(record['student_id'], record['student__name']),
                    'type': record['event__type_id'],
                    'count': record['count'],
                })
            for record in chat_records:
                formatted_records.append({
                    'student': '{}-{}'.format(record['student_id'], record['student__name']),
                    'type': '100000',
                    'count': record['count'],
                })

            return Response(formatted_records)

    @detail_route(
        methods=['GET'],
    )
    def tags(self, request, pk):
        records = TagRecord.objects.filter(
            student_id=pk
        ).values(
            'tag_id',
            'value'
        )
        return Response(records)
