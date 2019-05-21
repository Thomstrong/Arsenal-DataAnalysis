from progress.bar import Bar

from exams.models.exam_record import ClassExamRecord, StudentExamRecord

from exams.models.sub_exam import SubExam
from students.models.student import Student


# python manage.py runscript calculate_stu_exam_rank
def run():
    # calculate class rank
    StudentExamRecord.objects.filter(sub_exam__course_id=60).delete()
    StudentExamRecord.objects.filter(class_rank__gt=0).update(class_rank=0)
    class_exam_records = ClassExamRecord.objects.filter(
        attend_count__gt=0,
        stu_class__isnull=False
    ).order_by(
        'stu_class_id',
        'sub_exam__exam_id'
    ).exclude()
    bar = Bar('Class Ranking', max=len(class_exam_records))
    exam_id = None
    total_score_counter = {}
    for class_exam_record in class_exam_records:
        bar.next()
        if not exam_id:
            exam_id = class_exam_record.sub_exam.exam_id

        if exam_id != class_exam_record.sub_exam.exam_id:
            sorted_records = sorted(total_score_counter.items(), key=lambda d: d[1], reverse=True)

            for index, record in enumerate(sorted_records):
                student_in_db = Student.objects.get(id=record[0])
                sub_exam_in_db = SubExam.objects.get(exam_id=exam_id, course_id=60)
                StudentExamRecord.objects.create(
                    student=student_in_db,
                    sub_exam=sub_exam_in_db,
                    score=record[1],
                    class_rank=index + 1
                )
            total_score_counter = {}
            exam_id = class_exam_record.sub_exam.exam_id

        stu_class = class_exam_record.stu_class
        students = stu_class.studentrecord_set.values(
            'student_id'
        ).distinct().values_list('student_id', flat=True)

        sub_exam_id = class_exam_record.sub_exam_id

        student_exam_records = StudentExamRecord.objects.filter(
            sub_exam_id=sub_exam_id,
            student_id__in=students,
            score__gte=0
        ).order_by('deng_di')

        for index, student_record in enumerate(student_exam_records):
            student_record.class_rank = index + 1
            student_record.save()

            student_id = student_record.student_id
            if student_id not in total_score_counter:
                total_score_counter[student_id] = student_record.score
                continue
            total_score_counter[student_id] += student_record.score

    if exam_id:
        bar.max += 1
        sorted_records = sorted(total_score_counter.items(), key=lambda d: d[1], reverse=True)

        for index, record in enumerate(sorted_records):
            student_in_db = Student.objects.get(id=record[0])
            sub_exam_in_db = SubExam.objects.get(exam_id=exam_id, course_id=60)
            StudentExamRecord.objects.create(
                student=student_in_db,
                sub_exam=sub_exam_in_db,
                score=record[1],
                class_rank=index + 1
            )
    bar.next()
    bar.finish()
