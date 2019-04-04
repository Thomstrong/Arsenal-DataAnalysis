# Generated by Django 2.1.7 on 2019-04-01 15:59

from django.db import migrations, models
from progress.bar import Bar


# from subexam's standard get each student's z_score
def get_zt_score(apps, schema_editor):
    students = apps.get_model('exams', 'StudentExamRecord')
    bar = Bar('Processing', max=len(students.objects.all()))
    for student in students.objects.all():
        bar.next()
        if student.score >= 0:
            if not student.sub_exam.standard:
                student.z_score = 0.0
            else:
                student.z_score = (student.score - student.sub_exam.total_score / student.sub_exam.attend_num) / student.sub_exam.standard
            student.t_score = student.z_score * 8 + 80
        student.save()
    bar.finish()


class Migration(migrations.Migration):
    dependencies = [
        ('exams', '0004_20190403_sub_exam_standard'),
    ]

    operations = [
        migrations.AddField(
            model_name='StudentExamRecord',
            name='z_score',
            field=models.FloatField(default=0.0),
        ),
        migrations.AddField(
            model_name='StudentExamRecord',
            name='t_score',
            field=models.FloatField(default=0.0),
        ),

        migrations.RunPython(get_zt_score, reverse_code=migrations.RunPython.noop),
    ]
