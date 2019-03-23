import os

from django.conf import settings
from progress.bar import Bar

from exams.models.exam_type import ExamType


# python manage.py runscript recover_exam_type
def run():
    root = settings.BASE_DIR
    file_path = os.path.join(root, 'scripts', 'data', '6_exam_type.csv')
    with open(file_path) as data_file:
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
                print('Exeption:{}\nRecord:{}'.format(e, line))
                continue
        bar.finish()
