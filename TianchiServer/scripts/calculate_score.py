import math

from progress.bar import Bar

from exams.models.exam_record import StudentExamRecord
from exams.models.sub_exam import SubExam


# python manage.py runscript calculate_score
def run():
    bar = Bar('Standard:', max=SubExam.objects.filter(attend_num__gt=1).count())
    for sub_exam in SubExam.objects.filter(attend_num__gt=1):
        bar.next()
        average_score = sub_exam.total_score / sub_exam.attend_num
        standard = 0.0
        for student_record in sub_exam.studentexamrecord_set.filter(score__gte=0.0):
            standard += math.pow(student_record.score - average_score, 2)
        sub_exam.standard = math.pow(standard / (sub_exam.attend_num - 1), 1 / 2)
        sub_exam.save()
    bar.finish()

    bar = Bar('Z_T_SCORE', max=StudentExamRecord.objects.all().count())
    for student_exam_record in StudentExamRecord.objects.filter(score__gte=0):
        bar.next()
        sub_exam = student_exam_record.sub_exam
        if not sub_exam.standard:
            student_exam_record.z_score = 0.0
            student_exam_record.t_score = 80
            student_exam_record.save()
            continue

        score = student_exam_record.score
        average = sub_exam.total_score / sub_exam.attend_num
        student_exam_record.z_score = (score - average) / sub_exam.standard
        student_exam_record.t_score = student_exam_record.z_score * 8 + 80
        student_exam_record.save()
    bar.finish()

    bar = Bar('DengDi:', max=SubExam.objects.all().count())
    for sub_exam in SubExam.objects.all():
        i = 1
        bar.next()
        student_exam_records = sub_exam.studentexamrecord_set.all().order_by('-t_score')
        bar.max += student_exam_records.count()
        for student_exam_record in student_exam_records:
            bar.next()
            student_exam_record.deng_di = i / sub_exam.attend_num
            student_exam_record.save()
            i += 1
    bar.finish()
