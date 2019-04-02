from classes.constants import Campus


def check_campus(sender, instance, created, **kwargs):
    instance.campus_name = Campus.New if "东" in instance.class_name else Campus.Old
