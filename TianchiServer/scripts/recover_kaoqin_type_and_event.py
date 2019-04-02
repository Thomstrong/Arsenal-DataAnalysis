import os

from django.conf import settings

from kaoqins.models.kaoqin_event import KaoqinEvent
from kaoqins.models.kaoqin_type import KaoqinType
from progress.bar import Bar


# python manage.py runscript recover_kaoqin_type_and_event
def run():
    root = settings.BASE_DIR
    file_path = os.path.join(root, 'scripts', 'data', '4_kaoqintype.csv')
    with open(file_path,encoding='utf-8') as data_file:
        data_file.readline()

        lines = data_file.read().splitlines()
        bar = Bar('Processing', max=len(lines))
        for line in lines:
            bar.next()
            split_line = line.replace('"', '').split(',')
            kaoqin_type_id = str(int(split_line[0]))
            kaoqin_type_name = split_line[1]
            kaoqin_event_id = split_line[2]
            kaoqin_event_name = split_line[3]

            kaoqin_type, _ = KaoqinType.objects.get_or_create(
                id=kaoqin_type_id,
                name=kaoqin_type_name
            )
            KaoqinEvent.objects.get_or_create(
                id=kaoqin_event_id,
                type=kaoqin_type,
                name=kaoqin_event_name
            )
        bar.finish()
