import os

from django.conf import settings
from progress.bar import Bar

from classes.constants import Grade, Campus
from classes.models import Class
from courses.models.course import Course
from teachers.models.teach_record import TeachRecord
from teachers.models.teacher import Teacher
from terms.models import Term

# finish
# python manage.py runscript recover_teacher_and_record
def run():
    grade_name_to_int = {
        '初三': Grade.Zero,
        '高一': Grade.One,
        '高二': Grade.Two,
        '高三': Grade.Three,
    }

    root = settings.BASE_DIR
    file_name = '1_teacher'
    file_path = os.path.join(root, 'scripts', 'data', file_name + '.csv')
    err_file_path = os.path.join(root, 'scripts', 'data', file_name + '_err.csv')
    err_record_file = open(err_file_path, 'w')
    err_record_file.write('\n')
    with open(file_path, encoding='utf_8') as data_file:
        data_file.readline()

        lines = data_file.read().splitlines()
        bar = Bar('Processing', max=len(lines))
        for line in lines:
            bar.next()
            try:
                split_line = line.replace('"', '').split(',')
                grade_name = split_line[3]
                if grade_name_to_int[grade_name] == Grade.Zero:
                    continue
                term = split_line[0].split('-')
                class_id = int(split_line[1])
                class_name = split_line[2]

                course_id = int(split_line[4])
                course_name = split_line[5]

                teacher_id = split_line[6]
                teacher_name = split_line[7]

                term_in_db, _ = Term.objects.get_or_create(
                    start_year=int(term[0]),
                    end_year=int(term[1]),
                    order=int(term[2]),
                )

                class_in_db, _ = Class.objects.get_or_create(
                    id=class_id,
                    class_name=class_name,
                    grade_name=grade_name_to_int[grade_name],
                    campus_name=Campus.New if "东" in class_name else Campus.Old
                )

                course_in_db, _ = Course.objects.get_or_create(
                    id=course_id,
                    name=course_name
                )

                teacher_in_db, _ = Teacher.objects.get_or_create(
                    id=teacher_id,
                    name=teacher_name
                )

                teach_record, _ = TeachRecord.objects.get_or_create(
                    teacher=teacher_in_db,
                    term=term_in_db,
                    teach_class=class_in_db,
                    course=course_in_db,
                )
            except Exception as e:
                print(e)
                err_record_file.write('{},{}\n'.format(line, repr(e)))
                continue
        bar.finish()
    err_record_file.close()
