from django.db.models import Count
from progress.bar import Bar

from students.models.student_record import StudentRecord
from terms.models import Term


# python manage.py runscript refine_student_record_term
def run():
    records = StudentRecord.objects.select_related('term').values(
        'student_id',
        'stu_class__grade_name'
    ).annotate(
        count=Count('id')
    ).filter(count=1)

    bar = Bar('Refine student record:', max=records.count())
    for record in records:
        bar.next()
        student_record = StudentRecord.objects.get(
            student_id=record['student_id'],
            stu_class__grade_name=record['stu_class__grade_name']
        )
        if student_record.term.end_year == 2019:
            continue

        term = Term.objects.get(
            start_year=student_record.term.start_year,
            end_year=student_record.term.end_year,
            order=student_record.term.order % 2 + 1
        )

        StudentRecord.objects.create(
            student=student_record.student,
            term=term,
            stu_class=student_record.stu_class
        )
    bar.finish()
