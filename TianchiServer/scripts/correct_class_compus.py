from progress.bar import Bar

from classes.models import Class


# python manage.py runscript correct_class_compus
def run():
    classes = Class.objects.all()

    bar = Bar('Processing', max=classes.count())
    for stu_class in classes:
        bar.next()
        stu_class.save()
    bar.finish()
