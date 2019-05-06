from django.db.models import Count, Q
from progress.bar import Bar

from courses.models.course import Course
from courses.models.course_record import CourseRecord
from exams.models.exam_record import StudentExamRecord


# python manage.py runscript generate_course_chosen_record
from students.models.student_record import StudentRecord


def run():
    filter_with_exam = Q(
        score__gte=0.0,
        sub_exam__exam__type_id__in=[6, 7, 9],  # 模拟考/五校联考/十校联考
        sub_exam__course_id__in=[4, 5, 6, 7, 8, 17, 59],  # 文综/理综/技术
        sub_exam__exam__term__end_year__gte=2017,  # 17 年开始实行7选3
    )
    student_ids = StudentExamRecord.objects.prefetch_related('sub_exam__exam__term').filter(
        filter_with_exam
    ).values('student_id', 'sub_exam__exam_id').annotate(
        course_count=Count('sub_exam__course_id', distinct=True)).filter(
        course_count__gte=3
    ).values_list('student_id', flat=True).distinct()

    student_exam_records = StudentExamRecord.objects.select_related('sub_exam__course').filter(
        Q(student_id__in=student_ids),
        filter_with_exam
    ).prefetch_related('student').order_by('student_id')

    course_map = {}
    for course in Course.objects.filter(id__in=[4, 5, 6, 7, 8, 17, 59]):
        course_map[course.id] = course

    cur_stu_id = None
    cur_student = None
    course_counter = {}
    bar = Bar('Processing:', max=len(student_exam_records))
    for student_exam_record in student_exam_records:
        bar.next()
        started_at = student_exam_record.sub_exam.started_at
        if not cur_stu_id or cur_stu_id == student_exam_record.student_id:
            course_counter[started_at] = course_counter.get(started_at, [])
            course_counter[started_at].append(student_exam_record.sub_exam.course_id)
            cur_stu_id = student_exam_record.student_id
            cur_student = student_exam_record.student
            continue
        year = StudentRecord.objects.filter(
            student_id=cur_student.id
        ).select_related('term').order_by('term__end_year').last().term.end_year
        for time in sorted(course_counter.keys(), reverse=True):
            if len(course_counter[time]) == 3:
                for course_id in course_counter[time]:
                    course = course_map[course_id]
                    _, is_new = CourseRecord.objects.get_or_create(
                        course=course,
                        student=cur_student,
                        year=year
                    )
                    if not is_new:
                        print('student:{}-{} not new'.format(cur_student.id, course.name))
                break

        cur_stu_id = student_exam_record.student_id
        course_counter = {
            started_at: [student_exam_record.sub_exam.course_id]
        }
        cur_student = student_exam_record.student
    bar.finish()
