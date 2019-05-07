# Generated by Django 2.1.7 on 2019-05-07 00:41

from django.db import migrations, models
from progress.bar import Bar

from classes.constants import Grade


def get_class_order(apps, schema_editor):
    ClassExamRecord = apps.get_model('exams', 'ClassExamRecord')
    SubExam = apps.get_model('exams', 'SubExam')
    bar = Bar('Processing', max=SubExam.objects.all().count())

    for sub_exam in SubExam.objects.all():
        bar.next()
        for grade in [Grade.One, Grade.Two, Grade.Three]:
            records = ClassExamRecord.objects.exclude(
                stu_class__isnull=True
            ).filter(
                sub_exam=sub_exam,
                stu_class__grade_name=grade,
            ).values_list('id', 'attend_count', 'total_score')
            if not records:
                continue
            formated_records = []
            for record in records:
                formated_records.append({
                    'id': record[0],
                    'avg': (record[2] / record[1]) if record[1] else 0
                })
            sorted_records = sorted(formated_records, key=lambda d: d['avg'], reverse=True)
            bar.max += len(sorted_records)
            for index, record in enumerate(sorted_records):
                bar.next()
                ClassExamRecord.objects.filter(id=record['id']).update(order=(index + 1))

    bar.finish()


class Migration(migrations.Migration):
    dependencies = [
        ('exams', '0007_auto_20190405_0054'),
    ]

    operations = [
        migrations.AddField(
            model_name='classexamrecord',
            name='order',
            field=models.IntegerField(default=0),
        ),
        migrations.RunPython(get_class_order, reverse_code=migrations.RunPython.noop),
    ]