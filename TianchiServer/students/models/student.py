from django.db import models

from students.constants import SEX_TYPE_CHOICE, RESIDENCE_TYPE_CHOICE, POLICY_TYPE_CHOICE


class Student(models.Model):
    id = models.CharField('学号', unique=True, max_length=255, primary_key=True)
    name = models.CharField(max_length=255)
    sex = models.IntegerField(choices=SEX_TYPE_CHOICE)
    nation = models.CharField('民族', max_length=20)
    born_year = models.IntegerField('出生年份')
    native_place = models.CharField('民族', max_length=255)
    residence_type = models.IntegerField('家庭类型', choices=RESIDENCE_TYPE_CHOICE)
    policy = models.IntegerField('政治面貌', choices=POLICY_TYPE_CHOICE)
    is_stay_school = models.BooleanField('是否住校', default=False)
    is_left = models.BooleanField('是否退学', default=False)
    room_num = models.CharField(max_length=10, default='')

    def __unicode__(self):
        return '{} - {}'.format(self.id, self.name)

    def __str__(self):
        return self.__unicode__()
