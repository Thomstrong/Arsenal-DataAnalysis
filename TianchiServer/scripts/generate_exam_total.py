from progress.bar import Bar

from classes.models import Class
from courses.models.course import Course
from exams.models.exam_record import ClassExamRecord
from exams.models.sub_exam import SubExam


# python manage.py runscript generate_exam_total
def run():
    ClassExamRecord.objects.filter(
        sub_exam__course_id=60
    ).delete()
    course, _ = Course.objects.get_or_create(
        id=60,
        name='总分'
    )

    bar = Bar('Processing:', max=Class.objects.all().count())
    for stu_class in Class.objects.all():
        bar.next()
        class_exams = ClassExamRecord.objects.filter(
            stu_class=stu_class
        ).prefetch_related(
            'sub_exam__exam'
        )

        bar.max += class_exams.count()
        for class_exam in class_exams:
            bar.next()
            exam = class_exam.sub_exam.exam
            total_sub_exam, _ = SubExam.objects.get_or_create(
                exam=exam,
                course=course,
            )

            class_exam_record, _ = ClassExamRecord.objects.get_or_create(
                stu_class=stu_class,
                sub_exam=total_sub_exam,
            )
            avg = (class_exam.total_score / class_exam.attend_count) if class_exam.attend_count else 0
            class_exam_record.update_score(avg)
    bar.finish()
