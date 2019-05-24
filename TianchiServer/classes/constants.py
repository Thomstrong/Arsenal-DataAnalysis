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


SCORE_RANGES = [
    (None, 59),
    (59, 79),
    (79, 89),
    (89, 99),
    (99, 129),
    (129, None)
]

Z_SCORE_RANGES = [
    (None, -2),
    (-2, -1),
    (-1, 0),
    (0, 1),
    (1, 2),
    (2, None)
]

T_SCORE_RANGES = [
    (None, 56),
    (56, 72),
    (72, 80),
    (80, 88),
    (88, 104),
    (104, None)
]

SCORE_DISTRIBUTION_RANGES = {
    'score': SCORE_RANGES,
    't_score': T_SCORE_RANGES,
    'z_score': Z_SCORE_RANGES
}
