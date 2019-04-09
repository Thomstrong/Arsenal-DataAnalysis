from classes.constants import Campus


def check_campus(sender, instance, **kwargs):
    if instance.id:
        return
    instance.campus_name = Campus.New if "东" in instance.class_name else Campus.Old
