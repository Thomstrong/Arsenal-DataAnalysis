from django.db.models import Count, Q, Sum
from progress.bar import Bar

from classes.constants import Grade
from consumptions.models import HourlyConsumption, Consumption, DailyConsumption
from exams.models.exam_record import StudentExamRecord
from students.models.student import Student
from students.models.student_record import StudentRecord
from wordcloud.models.tag_record import TagRecord
from wordcloud.models.word_cloud_tag import WordCloudTag


# python manage.py runscript generate_ciyun_tag
def run():
    TagRecord.objects.all().delete()
    try:
        # 清晨消费
        tag_in_db, _ = WordCloudTag.objects.get_or_create(
            title='早起鸟儿'
        )
        morning_records = HourlyConsumption.objects.filter(
            Q(hour=5) | Q(hour=6)
        ).values('student_id').annotate(
            count=Count('id')
        )
        bar = Bar('Consumption at morning record:', max=len(morning_records))

        for record in morning_records:
            bar.next()
            student_id = record['student_id']
            student_in_db = Student.objects.get(id=student_id)
            TagRecord.objects.create(
                student=student_in_db,
                tag=tag_in_db,
                value=record['count'] * 8
            )
        bar.finish()
        # 进校时间
        morning_records = HourlyConsumption.objects.filter(
            Q(hour=5) | Q(hour=6)
        ).values('student_id').annotate(
            count=Count('id')
        )
        bar = Bar('Kaoqin at morning record:', max=len(morning_records))

        for record in morning_records:
            bar.next()
            student_id = record['student_id']
            student_in_db = Student.objects.get(id=student_id)
            tag_record, _ = TagRecord.objects.get_or_create(
                student=student_in_db,
                tag=tag_in_db,
            )
            tag_record.value += (record['count'] * 5)
            tag_record.save()
        bar.finish()

        # 单科成绩
        tag_map = {
            59: '技术达人',
            58: '语言能手',
            53: '语言能手',
            38: '技术达人',
            17: '马克思主义',
            13: '技术达人',
            12: '审美一流',
            11: '乐感十足',
            9: '体育健将',
            8: '季风洋流',
            7: '读史明智',
            6: '孟德尔',
            5: '氧化还原',
            4: '电磁声光力',
            3: '语言能手',
            2: '圆锥曲线',
            1: '文言文',
        }

        tag_in_db_map = {}
        for course_id in tag_map:
            tag_in_db_map[course_id], _ = WordCloudTag.objects.get_or_create(
                title=tag_map[course_id]
            )

        student_records = StudentExamRecord.objects.filter(
            deng_di__lte=0.4,
            student_id__isnull=False,
        ).values(
            'sub_exam__course_id',
            'score',
            'student_id'
        )

        counter = {}
        bar = Bar('Generate Counter:', max=len(student_records))

        for record in student_records:
            bar.next()
            student_id = record['student_id']
            course_id = record['sub_exam__course_id']
            if student_id not in counter:
                counter[student_id] = {}
            if course_id not in counter[student_id]:
                counter[student_id][course_id] = 0
            counter[student_id][course_id] += int(record['score'] / 20)
        bar.finish()

        bar = Bar('Course Tags:', max=len(counter))
        for student_id in counter:
            student_in_db = Student.objects.get(id=student_id)
            bar.next()
            bar.max += len(counter[student_id])
            for course_id in counter[student_id]:
                bar.next()
                if course_id == 57 or course_id == 31:
                    continue
                TagRecord.objects.create(
                    student=student_in_db,
                    tag=tag_in_db_map[course_id],
                    value=counter[student_id][course_id]
                )
        bar.finish()

        # 免考
        free_exam_records = StudentExamRecord.objects.filter(
            score=-3,
            student_id__isnull=False
        ).values('student_id').annotate(
            count=Count('id')
        )

        tag_in_db, _ = WordCloudTag.objects.get_or_create(
            title='免考金牌'
        )
        bar = Bar('Free exam:', max=len(free_exam_records))

        for record in free_exam_records:
            bar.next()
            student_id = record['student_id']
            student_in_db = Student.objects.get(id=student_id)
            TagRecord.objects.create(
                student=student_in_db,
                tag=tag_in_db,
                value=record['count'] * 20
            )
        bar.finish()

        # 等第
        tag_in_db, _ = WordCloudTag.objects.get_or_create(
            title='成绩优异'
        )
        dengdi_records = StudentExamRecord.objects.filter(
            deng_di__lte=0.02,
            student_id__isnull=False
        ).values('student_id').annotate(
            count=Count('id')
        )
        bar = Bar('Dengdi record:', max=len(dengdi_records))

        for record in dengdi_records:
            bar.next()
            student_id = record['student_id']
            student_in_db = Student.objects.get(id=student_id)
            TagRecord.objects.create(
                student=student_in_db,
                tag=tag_in_db,
                value=record['count'] * 10
            )
        bar.finish()

        # 深夜消费
        tag_in_db, _ = WordCloudTag.objects.get_or_create(
            title='深夜食堂'
        )
        night_records = HourlyConsumption.objects.filter(
            Q(hour=22) | Q(hour=23) | Q(hour=0),
            student_id__isnull=False,
        ).values('student_id').annotate(
            count=Count('id')
        )
        bar = Bar('Consumption at night record:', max=len(night_records))

        for record in night_records:
            bar.next()
            student_id = record['student_id']
            student_in_db = Student.objects.get(id=student_id)
            TagRecord.objects.create(
                student=student_in_db,
                tag=tag_in_db,
                value=record['count'] * 15
            )
        bar.finish()

        # 下午茶
        tag_in_db, _ = WordCloudTag.objects.get_or_create(
            title='下午茶'
        )

        after_noon_records = HourlyConsumption.objects.filter(
            Q(hour=15) | Q(hour=16) | Q(hour=14),
            student_id__isnull=False,
        ).values('student_id').annotate(
            count=Count('id')
        )
        bar = Bar('Afternoon cost record:', max=len(after_noon_records))

        for record in after_noon_records:
            bar.next()
            student_id = record['student_id']
            student_in_db = Student.objects.get(id=student_id)
            TagRecord.objects.create(
                student=student_in_db,
                tag=tag_in_db,
                value=record['count'] * 5
            )
        bar.finish()

        # 高额消费
        tag_in_db, _ = WordCloudTag.objects.get_or_create(
            title='大手笔'
        )
        money_dada_records = Consumption.objects.filter(
            cost__lt=-35,
            student_id__isnull=False,
        ).values('student_id').annotate(
            sum=-Sum('cost'),
        )
        bar = Bar('Money dada cost record:', max=len(money_dada_records))

        for record in money_dada_records:
            bar.next()
            student_id = record['student_id']
            student_in_db = Student.objects.get(id=student_id)
            TagRecord.objects.create(
                student=student_in_db,
                tag=tag_in_db,
                value=int(record['sum'] / 10)
            )
        bar.finish()

        # 勤俭节约
        tag_in_db, _ = WordCloudTag.objects.get_or_create(
            title='勤俭节约'
        )
        money_dada_students = money_dada_records.values_list('student_id', flat=True)
        money_nono_records = DailyConsumption.objects.filter(
            total_cost__gt=-5,
            student_id__isnull=False,
        ).exclude(student_id__in=money_dada_students).values('student_id').annotate(
            count=Count('id'),
        )
        bar = Bar('Money nono record:', max=len(money_nono_records))

        for record in money_nono_records:
            bar.next()
            student_id = record['student_id']
            student_in_db = Student.objects.get(id=student_id)
            TagRecord.objects.create(
                student=student_in_db,
                tag=tag_in_db,
                value=record['count'] * 5
            )
        bar.finish()

        # 模范学生
        tag_in_db, _ = WordCloudTag.objects.get_or_create(
            title='遵守校规'
        )

        students = Student.objects.all().exclude(
            kaoqinrecord__event__id__in=[
                9900100, 9900200, 9900300,
            ]
        )
        bar = Bar('Good student record:', max=len(students))

        for student in students:
            bar.next()
            TagRecord.objects.create(
                student=student,
                tag=tag_in_db,
                value=20
            )
        bar.finish()

        # 萌新入校
        tag_in_db, _ = WordCloudTag.objects.get_or_create(
            title='萌新入校'
        )

        students = StudentRecord.objects.filter(
            term__start_year=2018,
            stu_class__grade_name=Grade.One,
            student_id__isnull=False
        ).values_list('student_id', flat=True)
        bar = Bar('New student record:', max=len(students))

        for student in Student.objects.filter(id__in=students):
            bar.next()
            TagRecord.objects.create(
                student=student,
                tag=tag_in_db,
                value=20
            )
        bar.finish()

        # 默默无闻
        tag_in_db, _ = WordCloudTag.objects.get_or_create(
            title='默默无闻'
        )

        have_tag_students = TagRecord.objects.values_list('student_id', flat=True)

        no_tag_students = Student.objects.exclude(
            id__in=have_tag_students
        )
        bar = Bar('No tag record:', max=len(no_tag_students))

        for student in no_tag_students:
            bar.next()
            TagRecord.objects.create(
                student=student,
                tag=tag_in_db,
                value=100
            )
        bar.finish()

    except Exception as e:
        print(repr(e))
