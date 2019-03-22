from django.db import models

from terms.constants import TERM_ORDER_CHOICE


class Term(models.Model):
    start_year = models.IntegerField('起始年份')
    end_year = models.IntegerField('终止年份')
    order = models.IntegerField(choices=TERM_ORDER_CHOICE)

    def __unicode__(self):
        return '{} 年 - {} 年 第 {} 学期'.format(
            self.start_year,
            self.end_year,
            self.order
        )
