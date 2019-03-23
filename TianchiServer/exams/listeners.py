def before_update_record(sender, instance, **kwargs):
    if instance.id is None or instance.score < 0:
        return

    sub_exam = instance.sub_exam
    sub_exam.total_score -= instance.score
    sub_exam.attend_num -= 1
    sub_exam.save()


def after_update_record(sender, instance, created, **kwargs):
    if instance.score < 0:
        return

    sub_exam = instance.sub_exam
    sub_exam.total_score += instance.score
    sub_exam.attend_num += 1
    sub_exam.save()


def delete_exam_record(sender, instance, **kwargs):
    if instance.score < 0:
        return

    sub_exam = instance.sub_exam
    sub_exam.total_score -= instance.score
    sub_exam.attend_num -= 1
    sub_exam.save()
