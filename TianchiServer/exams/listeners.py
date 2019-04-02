def before_update_record(sender, instance, **kwargs):
    if instance.id is None or instance.score < 0:
        return

    instance.sub_exam.update_score(instance.score, is_add=False)


def after_update_record(sender, instance, created, **kwargs):
    if instance.score < 0:
        return

    instance.sub_exam.update_score(instance.score, is_add=True)


def delete_exam_record(sender, instance, **kwargs):
    if instance.score < 0:
        return

    instance.sub_exam.update_score(instance.score, is_add=False)
