import os

from dateutil.parser import parse as parse_date
from django.conf import settings
from progress.bar import Bar

from courses.models.course import Course
from exams.models.exam import Exam
from exams.models.exam_record import ClassExamRecord, StudentExamRecord
from exams.models.exam_type import ExamType
from exams.models.sub_exam import SubExam
from students.models.student import Student
from students.models.student_record import StudentRecord
from terms.models import Term


# python -W ignore manage.py runscript recover_student_exam
def run():
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
            if not split_line[3]:
                # no course id pass
                continue
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

                exam_type_id = int(split_line[6])
                exam_type_in_db = ExamType.objects.get(
                    id=exam_type_id
                )

                exam_id = int(split_line[1])
                exam_name = split_line[2]
                try:
                    exam_in_db = Exam.objects.get(
                        id=exam_id,
                    )
                except:
                    exam_in_db = Exam.objects.create(
                        id=exam_id,
                        type=exam_type_in_db,
                        term=term_in_db,
                        name=exam_name.strip()
                    )

                try:
                    sub_exam = SubExam.objects.get(
                        course=course_in_db,
                        exam=exam_in_db
                    )
                except:
                    sub_exam = SubExam.objects.create(
                        course=course_in_db,
                        started_at=started_at,
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
                    if not student_in_db:
                        student_in_db = Student.objects.create(
                            id=student_id,
                            name='未知',
                            is_left=True
                        )
                    StudentExamRecord.objects.create(
                        student=student_in_db,
                        sub_exam=sub_exam,
                        score=score
                    )
                    class_exam_record_id = int(split_line[0])
                    class_exam, _ = ClassExamRecord.objects.get_or_create(
                        id=int(class_exam_record_id),
                        sub_exam=sub_exam
                    )
                    student_records = StudentRecord.objects.filter(
                        student=student_in_db,
                        term=term_in_db
                    )
                    record_count = student_records.count()
                    exam_class = class_exam.stu_class
                    if record_count == 0 and exam_class:
                        StudentRecord.objects.create(
                            student=student_in_db,
                            term=term_in_db,
                            stu_class=exam_class
                        )
                    if record_count > 1:
                        err_record_file.write('{},{}\n'.format(line, 'term error!'))
                    if record_count == 1:
                        student_record = student_records.first()
                        if not exam_class:
                            class_exam.stu_class = student_record.stu_class  # save after update_score
                        if exam_class and not exam_class.id == student_record.stu_class.id:
                            err_record_file.write('{},{}-{}-{}\n'.format(
                                line, 'stu_class strange!',
                                str(exam_class.id), str(student_record.stu_class.id)
                            ))
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
