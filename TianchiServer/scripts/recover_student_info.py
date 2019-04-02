import os

from django.conf import settings
from progress.bar import Bar

from classes.constants import Grade
from classes.constants import Campus
from classes.models import Class
from students.constants import SexType, ResidenceType, PolicyType
from students.models.student import Student
from students.models.student_record import StudentRecord
from terms.models import Term


# python manage.py runscript recover_student_info
def run():
    sex_to_int = {
        '男': SexType.boy,
        '女': SexType.girl,
    }

    residence_type_to_int = {
        '城镇': ResidenceType.city,
    }

    policy_to_int = {
        '共青团员': PolicyType.gqt,
        '少先队员': PolicyType.sxd,
        '共产党员': PolicyType.gcd,
        '一般': PolicyType.normal,
        '民主党派': PolicyType.other,
    }
    grade_name_to_int = {
        '初三': Grade.Zero,
        '高一': Grade.One,
        '高二': Grade.Two,
        '高三': Grade.Three,
    }
    root = settings.BASE_DIR
    file_name = '2_student_info'
    file_path = os.path.join(root, 'scripts', 'data', file_name + '.csv')
    err_file_path = os.path.join(root, 'scripts', 'data', file_name + '_err.csv')
    err_record_file = open(err_file_path, 'w')
    err_record_file.write('\n')
    with open(file_path) as data_file:
        data_file.readline()  # read header

        lines = data_file.read().splitlines()
        bar = Bar('Processing', max=len(lines))
        for line in lines:
            split_line = line.split(',')
            bar.next()
            try:
                stu_id = split_line[0]
                stu_name = split_line[1]
                sex = sex_to_int[split_line[2]]
                nation = split_line[3]
                born_year = int(split_line[4]) if split_line[4] else -1
                native_place = split_line[6]
                residence_type = residence_type_to_int[split_line[7]]
                policy = policy_to_int[split_line[8]]
                is_stay = True if split_line[11] else False
                is_left = True if split_line[12] else False
                room_num = split_line[13]

                class_name = split_line[5]
                class_id = split_line[9]

                term = split_line[10].split('-')

                try:
                    class_in_db = Class.objects.get(
                        id=class_id,
                    )
                except:
                    index = class_name.index('高')
                    grade_name = class_name[index: index + 2]
                    class_in_db = Class.objects.create(
                        id=class_id,
                        class_name=class_name,
                        grade_name=grade_name_to_int[grade_name]
                    )

                term_in_db, _ = Term.objects.get_or_create(
                    start_year=int(term[0]),
                    end_year=int(term[1]),
                    order=int(term[2]),
                )

                student, _ = Student.objects.get_or_create(
                    id=stu_id,
                    name=stu_name,
                    sex=sex,
                    nation=nation,
                    born_year=born_year,
                    native_place=native_place,
                    residence_type=residence_type,
                    policy=policy,
                    is_stay_school=is_stay,
                    is_left=is_left,
                    room_num=room_num,
                )

                StudentRecord.objects.get_or_create(
                    student=student,
                    term=term_in_db,
                    stu_class=class_in_db
                )
            except Exception as e:
                print(repr(e))
                err_record_file.write('{},{}\n'.format(line, repr(e)))
                continue
        bar.finish()
    err_record_file.close()
