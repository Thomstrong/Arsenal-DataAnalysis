export const COURSE_ALIAS = {
  59: '技',
  58: '英2',
  57: '1B',
  53: '英选9',
  38: '通用',
  31: '科学',
  17: '政',
  13: '信技',
  12: '美',
  11: '音',
  9: '体',
  8: '地',
  7: '史',
  6: '生',
  5: '化',
  4: '物',
  3: '英',
  2: '数',
  1: '语',
};

export const COURSE_COLOR = {
  59: '#F44336',
  58: '#2196F3',
  57: '#8BC34A',
  53: '#FF5722',
  38: '#E91E63',
  31: '#03A9F4',
  17: '#CDDC39',
  13: '#795548',
  12: '#9C27B0',
  11: '#FFEB3B',
  9: '#9E9E9E',
  8: '#673AB7',
  7: '#009688',
  6: '#FFC107',
  5: '#3F51B5',
  4: '#4CAF50',
  3: '#FF9800',
  2: '#607D8B',
  1: '#00BCD4',
};

export const COURSE_FULLNAME_ALIAS = {
  59: '技术',
  58: '英语2',
  57: '1B模块总分',
  53: '英语选修9',
  38: '通用技术',
  31: '科学',
  17: '政治',
  13: '信息技术',
  12: '美术',
  11: '音乐',
  9: '体育',
  8: '地理',
  7: '历史',
  6: '生物',
  5: '化学',
  4: '物理',
  3: '英语',
  2: '数学',
  1: '语文',
};

export const GAOKAO_COURSES = [1, 2, 3, 4, 5, 6, 7, 8, 17, 59];

export const WEEKDAY_ALIAS = [
  '周一',
  '周二',
  '周三',
  '周四',
  '周五',
  '周六',
  '周日',
];

export const EVENT_TYPE_ALIAS = {
  100000: '作弊',
  99005: '进校',
  99004: '离校',
  99003: '早退',
  99002: '校服违纪',
  99001: '迟到',
  1003: '操场考勤机',
  1002: '校徽_早退',
  1001: '迟到_晚到',
};

export const SEX_MAP = {
  1: '男',
  2: '女',
  null: '未知',
};

export const POLICY_TYPE = {
  gqt: 1,
  sxd: 2,
  gcd: 3,
  normal: 4,
  other: 5,
};

export const POLICY_TYPE_ALIAS = {
  [POLICY_TYPE.gqt]: '共青团员',
  [POLICY_TYPE.sxd]: '少先队员',
  [POLICY_TYPE.gcd]: '共产党员',
  [POLICY_TYPE.normal]: '一般',
  [POLICY_TYPE.other]: '民主党派',
};

export const SCORE_LEVEL_ALIAS = {
  highest: '最高分',
  lowest: '最低分',
  average: '平均分',
};

export const DATE_REANGE_ALIAS = {
  7: '一周',
  30: '一个月',
  90: '一个季度',
  180: '半年',
  365: '一年'
};

export const INTERVAL_MAP = {
  7: 1,
  30: 2,
  90: 5,
  180: 10,
  365: 20,
};

export const CLASS_CAMPUS_CHOICE = {
  1: '东部校区',
  0: '白杨校区',
};

export const STAY_ALIAS = {
  1: '住校',
  0: '走读',
};

export const SEX_FULL_MAP = {
  1: '男生',
  2: '女生',
  null: '未知',
};

export const GRADE_ALIAS = {
  0: '初三',
  1: '高一',
  2: '高二',
  3: '高三',
};

export const LINE_INDEX_ALIAS = {
  0: '2018年一段线',
  1: '2018年二段线',
  2: '2018年三段线',
};

export const LINE_SCORE = [
  588,
  490,
  344,
];

export const RANGE_ALIAS = {
  "59": "<60",
  "79": "60-79",
  "89": "80-89",
  "99": "90-99",
  "129": "100-129",
  "150": "130-150",
};

export const getDengDi = (dengdi) => {
  if (dengdi <= 0.15) {
    return 4;
  }

  if (dengdi <= 0.45) {
    return 3;
  }

  if (dengdi <= 0.75) {
    return 2;
  }

  if (dengdi <= 0.95) {
    return 1;
  }

  return 0;
};
