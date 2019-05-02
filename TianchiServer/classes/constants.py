class Grade(object):
    Zero = 0
    One = 1
    Two = 2
    Three = 3


class Campus(object):
    Old = 0
    New = 1


CLASS_GRADE_CHOICE = (
    (Grade.Zero, '初三'),
    (Grade.One, '高一'),
    (Grade.Two, '高二'),
    (Grade.Three, '高三'),
)

CLASS_CAMPUS_CHOICE = (
    (Campus.New, '东部校区'),
    (Campus.Old, '白杨校区'),
)

EXAM_RANGES = [
    (0, 59),
    (60, 79),
    (80, 89),
    (90, 99),
    (100, 129),
    (130, 150)
]
