import cpca

from students.models.student import Student


# python manage.py runscript refine_student_native_place
def run():
    students = Student.objects.filter(
        native_place__isnull=False
    )

    places = [
        student.native_place
        for student in students
    ]
    df = cpca.transform(places, cut=False)
    i = 0
    converted_data = df.values
    while i < len(converted_data):
        new_place = '{}{}'.format(converted_data[i][0], converted_data[i][1])
        students[i].native_place = new_place if new_place else '未登记'
        students[i].save()
        i += 1
