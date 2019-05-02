# Create your views here.
from django.db.models import Q, Max, Min, Avg, Count
from rest_framework import viewsets
from rest_framework.decorators import detail_route
from rest_framework.response import Response

from classes.api.serializers import ClassBasicSerializer, ClassMiniSerializer
from classes.constants import EXAM_RANGES
from classes.models import Class
from exams.models.exam_record import StudentExamRecord, ClassExamRecord
from kaoqins.models.kaoqin_record import KaoqinRecord
from students.constants import SexType, PolicyType
from students.models.student_record import StudentRecord
from teachers.models.teach_record import TeachRecord
from utils.decorators import required_params

gaokao_courses = [1, 2, 3, 4, 5, 6, 7, 8, 17, 59]


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
        ).distinct('teacher_id').values('teacher_id', 'teacher__name', 'course_id')
        return Response(teachers)

    @required_params(params=['type'])
    @detail_route(
        methods=['GET'],
    )
    def grade(self, request, pk):
        type = request.query_params.get('type', '')
        if not type:
            return Response('type 输入有误', status=400)

        if type == 'radar':
            students = StudentRecord.objects.filter(
                stu_class_id=pk
            ).values_list('student_id', flat=True)
            exam_records = StudentExamRecord.objects.filter(
                Q(score__gte=0),
                student_id__in=students,
                sub_exam__course_id__in=gaokao_courses,
            ).order_by('sub_exam__course_id').values('sub_exam__course_id').annotate(
                highest=Max('t_score'),
                lowest=Min('t_score'),
                average=Avg('t_score'),
            )

            return Response(exam_records)

        if type == 'trend':
            records = ClassExamRecord.objects.filter(
                stu_class_id=pk,
                sub_exam__course_id__in=gaokao_courses,
            ).order_by('sub_exam__started_at').values(
                'sub_exam__exam__name'
            ).values(
                'sub_exam__course_id',
                'sub_exam__exam__name',
                'total_score',
                'attend_count'
            )

            formated_records = {}
            total = 0
            exam_name = ''
            for record in records:
                if not exam_name:
                    exam_name = record['sub_exam__exam__name']
                    formated_records[exam_name] = []
                if not exam_name == record['sub_exam__exam__name']:
                    formated_records[exam_name].append({
                        'course': 0,
                        'score': total
                    })
                    exam_name = record['sub_exam__exam__name']
                    formated_records[exam_name] = []
                    total = 0

                avg_score = record['total_score'] / record['attend_count']
                formated_records[exam_name].append({
                    'course': record['sub_exam__course_id'],
                    'score': avg_score
                })
                total += avg_score
            if exam_name:
                formated_records[exam_name].append({
                    'course': 0,
                    'score': total
                })
            return Response(formated_records)

    @detail_route(
        methods=['GET'],
    )
    def kaoqin(self, request, pk):
        students = StudentRecord.objects.filter(
            stu_class_id=pk
        ).values_list('student_id', flat=True)
        records = KaoqinRecord.objects.filter(
            student_id__in=students,
            event_id__gte=9900100
        ).exclude(event_id=9900500).values('event__type_id', 'term').annotate(
            count=Count('id'),
        ).order_by('term__start_year').order_by('term__order')

        sumary = KaoqinRecord.objects.filter(
            student_id__in=students,
            event_id__gte=9900100
        ).exclude(event_id=9900500).values('event__type_id').annotate(
            count=Count('id'),
        ).order_by('-count')

        return Response({
            'records': records,
            'summary': sumary,
        })

    @required_params(params=['exam_id'])
    @detail_route(
        methods=['GET']
    )
    def rank(self, request, pk):
        exam_id = request.query_params.get('exam_id', '')
        if not exam_id:
            return Response('exam_id 输入有误', status=400)

        stu_class = self.get_object()
        records = ClassExamRecord.objects.filter(
            stu_class__grade_name=stu_class.grade_name,
            sub_exam__exam_id=exam_id,
            attend_count__gt=0,
            stu_class_id__isnull=False
        ).select_related(
            'stu_class',
            'sub_exam'
        ).values(
            'sub_exam_id',
            'stu_class_id',
            'stu_class__class_name',
            'sub_exam__course_id',
            'total_score',
            'attend_count',
        ).order_by(
            'sub_exam__course_id',
            'stu_class_id'
        )
        formatted_data = {}
        for record in records:
            course_id = record['sub_exam__course_id']
            if course_id not in formatted_data:
                formatted_data[course_id] = []
            formatted_data[course_id].append({
                'class_id': record['stu_class_id'],
                'class_name': record['stu_class__class_name'],
                'average': record['total_score'] / record['attend_count'],
            })

        result = {}

        for course_id in formatted_data:
            result[course_id] = sorted(
                formatted_data[course_id],
                key=lambda d: d['average'],
                reverse=False
            )
        return Response(result)

    @detail_route(
        methods=['GET'],
    )
    def exams(self, request, pk):
        exams = ClassExamRecord.objects.filter(
            stu_class_id=pk
        ).values(
            'sub_exam__exam__name',
            'sub_exam__exam_id',
        ).distinct('sub_exam__exam_id')
        return Response(exams)

    @required_params(params=['exam_id'])
    @detail_route(
        methods=['GET'],
    )
    def student_exam_list(self, request, pk):
        exam_id = request.query_params.get('exam_id', '')
        if not exam_id:
            return Response('exam_id 输入有误', status=400)
        if exam_id == 'latest':
            exam_id = ClassExamRecord.objects.filter(
                stu_class_id=pk
            ).order_by(
                '-sub_exam__started_at'
            ).values('sub_exam__exam_id').first()['sub_exam__exam_id']
        students = StudentRecord.objects.filter(
            stu_class_id=pk
        ).values_list('student_id', flat=True)
        records = StudentExamRecord.objects.filter(
            student_id__in=students,
            sub_exam__exam_id=exam_id,
            score__gte=0
        ).values(
            'student_id',
            'student__name',
            'sub_exam__course_id',
            'score'
        )

        formated_data = {}
        for record in records:
            student = "{}-{}".format(record['student_id'], record['student__name'])
            if student not in formated_data:
                formated_data[student] = {}
            formated_data[student][
                record['sub_exam__course_id']
            ] = record['score']

        return Response(formated_data)

    @required_params(params=['exam_id'])
    @detail_route(
        methods=['GET'],
    )
    def score_distribution(self, request, pk):
        exam_id = request.query_params.get('exam_id', '')
        if not exam_id:
            return Response('exam_id 错误!', 404)
        grade = self.get_object().grade_name
        class_ids = ClassExamRecord.objects.filter(
            sub_exam__exam_id=exam_id,
            stu_class__grade_name=grade,
            stu_class_id__isnull=False,
        ).values_list('stu_class_id', flat=True).order_by(
            'stu_class_id'
        )

        records = {}
        for class_id in class_ids:
            studnts = StudentRecord.objects.filter(
                stu_class_id=class_id,
                student_id__isnull=False,
            ).values_list('student_id', flat=True)
            records[class_id] = {}
            for exam_range in EXAM_RANGES:
                records[class_id][exam_range[1]] = StudentExamRecord.objects.filter(
                    student_id__in=studnts,
                    sub_exam__exam_id=exam_id,
                    score__gte=exam_range[0],
                    score__lte=exam_range[1],
                ).values('sub_exam__course_id').annotate(
                    count=Count('id')
                )
        return Response(records)
