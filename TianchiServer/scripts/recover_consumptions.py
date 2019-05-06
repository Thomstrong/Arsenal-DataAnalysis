import os

import dateutil.parser
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from progress.bar import Bar

from consumptions.models import Consumption, DailyConsumption, HourlyConsumption
from students.constants import SexType
from students.models.student import Student


# python -W ignore manage.py runscript recover_consumptions
def run():
    Consumption.objects.all().delete()
    DailyConsumption.objects.all().delete()
    HourlyConsumption.objects.all().delete()
    sex_to_int = {
        '男': SexType.boy,
        '女': SexType.girl,
    }
    root = settings.BASE_DIR
    file_name = '7_consumption'
    file_path = os.path.join(root, 'scripts', 'data', file_name + '.csv')
    err_file_path = os.path.join(root, 'scripts', 'data', file_name + '_err.csv')
    err_record_file = open(err_file_path, 'w')
    with open(file_path, encoding='utf-8') as data_file:
        data_file.readline()

        lines = data_file.read().splitlines()
        bar = Bar('Processing', max=len(lines))
        for line in lines:
            bar.next()
            try:
                split_line = line.replace('"', '').split(',')
                deal_time = split_line[0]
                time = dateutil.parser.parse(deal_time)
                money_deal = float(split_line[1])
                student_id = split_line[2]
                sex = sex_to_int.get(split_line[4], '')
                student = Student.objects.get(
                    id=student_id,
                )
                if not student.sex and not sex:
                    continue

                if not student.sex:
                    student.sex = sex
                    student.is_left = False
                    student.save()

                Consumption.objects.create(
                    created_at=time,
                    cost=money_deal,
                    student=student
                )
            except Exception as e:
                print(e)
                err_record_file.write('{},{}\n'.format(line, repr(e)))
                continue
        bar.finish()
    err_record_file.close()
