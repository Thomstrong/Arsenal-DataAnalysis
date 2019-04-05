import os

from dateutil.parser import parse as parse_date
from django.conf import settings
from progress.bar import Bar

from courses.models.course import Course
from exams.models.exam import Exam
from exams.models.exam_record import ClassExamRecord
from exams.models.sub_exam import SubExam
from students.models.student import Student
from students.models.student_record import StudentRecord
from terms.models import Term


# python manage.py runscript refine_class_exam_record
def run():
    ClassExamRecord.objects.all().delete()
    root = settings.BASE_DIR
    file_name = '5_chengji'
    file_path = os.path.join(root, 'scripts', 'data', file_name + '.csv')
    err_file_path = os.path.join(root, 'scripts', 'data', file_name + '_err.csv')
    err_record_file = open(err_file_path, 'w')
    err_record_file.write('\n')
    with open(file_path, encoding='utf-8') as data_file:
        data_file.readline()  # read header

        lines = data_file.read().splitlines()
        bar = Bar('Processing', max=len(lines))
        for line in lines:
            split_line = line.replace('"', '').split(',')
            bar.next()
            try:
                started_at = parse_date(split_line[7])
                term = split_line[5].split('-')
                if not term[0]:
                    if started_at.month < 3:
                        term = [started_at.year - 1, started_at.year, 1]
                    if 3 <= started_at.month < 9:
                        term = [started_at.year - 1, started_at.year, 2]
                    if started_at.month >= 9:
                        term = [started_at.year, started_at.year + 1, 1]

                term_in_db = Term.objects.get(
                    start_year=int(term[0]),
                    end_year=int(term[1]),
                    order=int(term[2]),
                )

                course_id = int(split_line[3])
                course_in_db = Course.objects.get(
                    id=course_id,
                )

                exam_id = int(split_line[1])
                exam_in_db = Exam.objects.get(
                    id=exam_id,
                )

                sub_exam = SubExam.objects.get(
                    course=course_in_db,
                    exam=exam_in_db
                )

                student_id = split_line[8]
                if split_line[9]:
                    score = float(split_line[9])
                else:
                    raise Exception('no score')

                try:
                    student_in_db = Student.objects.filter(
                        id=student_id
                    ).first()
                    class_exam_record_id = int(split_line[0])
                    class_exam, _ = ClassExamRecord.objects.get_or_create(
                        id=int(class_exam_record_id),
                        sub_exam=sub_exam
                    )
                    if not class_exam.stu_class and \
                            StudentRecord.objects.filter(
                                student=student_in_db,
                                term=term_in_db
                            ).exists():
                        class_exam.stu_class = StudentRecord.objects.filter(
                            student=student_in_db,
                            term=term_in_db
                        ).first().stu_class
                    class_exam.update_score(score)
                except Exception as e:
                    # useless student record
                    raise Exception(e)

            except Exception as e:
                print(repr(e))
                err_record_file.write('{},{}\n'.format(line, repr(e)))
                continue
        bar.finish()
    err_record_file.close()
