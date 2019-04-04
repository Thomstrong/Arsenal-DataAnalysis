# Generated by Django 2.1.7 on 2019-04-01 15:59

from django.db import migrations, models
import math
import django.db.models.deletion


# get each subexam's standard
def get_standard(apps, schema_editor):
    sub_exams = apps.get_model('exams', 'SubExam')
    for sub_exam in sub_exams.objects.all():
        average_score = sub_exam.total_score / sub_exam.attend_num
        standard = 0.0
        for student_record in sub_exam.studentexamrecord_set.filter(score_gte=0.0):
            standard += math.pow(student_record.score - average_score, 2)
        sub_exam.standard = math.pow(standard / (sub_exam.attend_num - 1), 1 / 2)
        sub_exam.save()


class Migration(migrations.Migration):
    dependencies = [
        ('exams', '0004_auto_20190403_2156'),
    ]

    operations = [
        migrations.AddField(
            model_name='SubExam',
            name='standard',
            field=models.FloatField(default=0.0),
        ),
        migrations.RunPython(get_standard, reverse_code=migrations.RunPython.noop),
    ]
