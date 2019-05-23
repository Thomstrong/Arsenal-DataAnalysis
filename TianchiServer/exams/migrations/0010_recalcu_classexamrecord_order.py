# Generated by Django 2.1.7 on 2019-05-24 01:25

from django.db import migrations, models
from progress.bar import Bar

from classes.constants import Grade, Campus


def get_class_order(apps, schema_editor):
    ClassExamRecord = apps.get_model('exams', 'ClassExamRecord')
    SubExam = apps.get_model('exams', 'SubExam')
    bar = Bar('Processing', max=SubExam.objects.all().count())
    ClassExamRecord.objects.filter(stu_class__isnull=True).delete()
    for sub_exam in SubExam.objects.all():
        bar.next()
        for grade in [Grade.One, Grade.Two, Grade.Three]:
            for campus in [Campus.New, Campus.Old]:
                records = ClassExamRecord.objects.exclude(
                    stu_class__isnull=True
                ).filter(
                    sub_exam=sub_exam,
                    stu_class__grade_name=grade,
                    stu_class__campus_name=campus
                ).values_list('id', 'attend_count', 'total_score', 'sub_exam__course_id')
                if not records:
                    continue
                formatted_records = []
                for record in records:
                    avg = 0
                    if record[3] == 60 and record[1]:
                        avg = record[2]
                    if record[3] != 60 and record[1]:
                        avg = (record[2] / record[1])
                    formatted_records.append({
                        'id': record[0],
                        'avg': avg
                    })
                sorted_records = sorted(formatted_records, key=lambda d: d['avg'], reverse=True)
                bar.max += len(sorted_records)
                for index, record in enumerate(sorted_records):
                    bar.next()
                    ClassExamRecord.objects.filter(id=record['id']).update(order=(index + 1))
    bar.finish()


class Migration(migrations.Migration):
    dependencies = [
        ('exams', '0009_studentexamrecord_class_rank'),
    ]

    operations = [
        migrations.RunPython(get_class_order, reverse_code=migrations.RunPython.noop),
    ]
