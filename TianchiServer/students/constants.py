class SexType(object):
    boy = 1
    girl = 2


SEX_TYPE_CHOICE = (
    (SexType.boy, '男'),
    (SexType.girl, '女'),
)


class ResidenceType(object):
    city = 1


RESIDENCE_TYPE_CHOICE = (
    (ResidenceType.city, '城镇'),
)


class PolicyType(object):
    gqt = 1
    sxd = 2
    gcd = 3
    normal = 4
    other = 5


POLICY_TYPE_CHOICE = (
    (PolicyType.gqt, '共青团员'),
    (PolicyType.sxd, '少先队员'),
    (PolicyType.gcd, '共产党员'),
    (PolicyType.normal, '一般'),
    (PolicyType.other, '民主党派'),
)
