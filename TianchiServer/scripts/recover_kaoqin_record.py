import os

from dateutil.parser import parse as parse_date
from django.conf import settings
from progress.bar import Bar

from classes.constants import Grade
from classes.models import Class
from kaoqins.models.kaoqin_event import KaoqinEvent
from kaoqins.models.kaoqin_record import KaoqinRecord
from students.models.student import Student
from students.models.student_record import StudentRecord
from terms.models import Term


# python -W ignore manage.py runscript recover_kaoqin_record
def run():
    root = settings.BASE_DIR
    file_name = '3_kaoqin'
    file_path = os.path.join(root, 'scripts', 'data', file_name + '.csv')
    err_file_path = os.path.join(root, 'scripts', 'data', file_name + '_err.csv')
    err_record_file = open(err_file_path, 'w')
    err_record_file.write('\n')
    grade_name_to_int = {
        '初三': Grade.Zero,
        '高一': Grade.One,
        '高二': Grade.Two,
        '高三': Grade.Three,
    }

    with open(file_path) as data_file:
        data_file.readline()  # read header

        lines = data_file.read().splitlines()
        bar = Bar('Processing', max=len(lines))
        for line in lines:
            split_line = line.split(',')
            bar.next()
            try:
                student_id = split_line[6]
                student_name = split_line[7]
                stu_in_db, is_new_stu = Student.objects.get_or_create(
                    id=student_id
                )
                if is_new_stu:
                    stu_in_db.name = student_name
                    stu_in_db.save()

                class_name = split_line[8]
                class_id = split_line[9]
                try:
                    class_in_db = Class.objects.get(
                        id=class_id
                    )
                except:
                    index = class_name.index('高')
                    grade_name = class_name[index: index + 2]
                    class_in_db = Class.objects.create(
                        id=class_id,
                        grade_name=grade_name_to_int[grade_name],
                        class_name=class_name,
                    )
                created_at = parse_date(split_line[2])
                term = split_line[1].split('-')
                if not term[0]:
                    if created_at.month < 3:
                        term = [created_at.year - 1, created_at.year, 1]
                    if 3 <= created_at.month < 9:
                        term = [created_at.year - 1, created_at.year, 2]
                    if created_at.month >= 9:
                        term = [created_at.year, created_at.year + 1, 1]

                term_in_db, _ = Term.objects.get_or_create(
                    start_year=int(term[0]),
                    end_year=int(term[1]),
                    order=int(term[2]),
                )

                StudentRecord.objects.get_or_create(
                    student=stu_in_db,
                    stu_class=class_in_db,
                    term=term_in_db
                )

                event_id = split_line[5]
                event_in_db = KaoqinEvent.objects.get(
                    id=event_id,
                )

                record_id = int(split_line[0])

                KaoqinRecord.objects.get_or_create(
                    id=record_id,
                    term=term_in_db,
                    created_at=created_at,
                    event=event_in_db,
                    student=stu_in_db,
                )

            except Exception as e:
                print(repr(e))
                err_record_file.write('{},{}\n'.format(line, repr(e)))
                continue
        bar.finish()
    err_record_file.close()
