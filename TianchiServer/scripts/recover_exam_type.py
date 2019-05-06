import os

from django.conf import settings
from progress.bar import Bar

from exams.models.exam_type import ExamType

# finish
# python manage.py runscript recover_exam_type
def run():
    root = settings.BASE_DIR
    file_name = '6_exam_type'
    file_path = os.path.join(root, 'scripts', 'data', file_name + '.csv')
    err_file_path = os.path.join(root, 'scripts', 'data', file_name + '_err.csv')
    err_record_file = open(err_file_path, 'w')
    err_record_file.write('\n')
    with open(file_path, encoding='utf-8') as data_file:
        # 读取表头
        data_file.readline()

        lines = data_file.read().splitlines()
        bar = Bar('Processing', max=len(lines))
        for line in lines:
            bar.next()
            split_line = line.replace('"', '').split(',')
            type_id = split_line[0]
            type_name = split_line[1]
            try:
                ExamType.objects.get_or_create(
                    id=int(type_id),
                    name=type_name
                )
            except Exception as e:
                print(repr(e))
                err_record_file.write('{},{}\n'.format(line, repr(e)))
                continue
        bar.finish()
