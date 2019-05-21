import {
  getClassBasic,
  getClassExamList,
  getClassGrade,
  getClassKaoqinData,
  getClassList,
  getClassTeachers,
  getDistribution,
  getExamRank,
  getExamRecords,
  getScoreDistribution,
  getExamSummary,
} from '@/services/api';
import {
  COURSE_ALIAS,
  COURSE_COLOR,
  COURSE_FULLNAME_ALIAS,
  EVENT_TYPE_ALIAS,
  LINE_SCORE,
  SCORE_LEVEL_ALIAS,
  WEEKDAY_ALIAS
} from "@/constants";
import DataSet from "@antv/data-set";


export default {
  namespace: 'stuClass',

  state: {
    distributionData: {
      total: 0,
      boy: 0,
      stay: 0,
      local: 0,
      policy: 0,
    },
    classInfo: {
      id: null,
      name: '',
      campus: '',
      term: 1970,
    },
    teachers: [],
    classList: [],
    loading: false,
    radarData: [],
    kaoqinData: [],
    kaoqinDetail: {},
    kaoqinSummary: [],
    kaoqinCount:0,
    totalTrend: [],
    subTrends: [],
    maxRank: 0,
    studentsList: [],
    termList: [],

    courseRankData: {
      totalRank: 0,
      rankData: [],
      classNum: 0,
    },
    scoreData: [],
    classMap: {},
    examRecords: [],
    overLineCounter: [0, 0, 0],
    scoreDistributionData: [],
    examSummary: {},
    classExamList: [],
    scoreType: '',
  },

  effects: {
    * fetchBasic({ payload }, { call, put }) {
      const response = yield call(getClassBasic, payload);
      yield put({
        type: 'saveClassBasic',
        payload: response
      });
    },
    * fetchDistribution({ payload }, { call, put }) {
      const response = yield call(getDistribution, payload);
      yield put({
        type: 'saveDistributionData',
        payload: response
      });
    },
    * fetchTeacher({ payload }, { call, put }) {
      const response = yield call(getClassTeachers, payload);
      yield put({
        type: 'saveTeachers',
        payload: response
      });
    },
    * fetchClassList({ payload }, { call, put }) {
      const response = yield call(getClassList, payload);
      yield put({
        type: 'saveClassList',
        payload: response
      });
    },
    * fetchRadarData({ payload }, { call, put }) {
      const response = yield call(getClassGrade, {
        ...payload,
        type: 'radar'
      });
      yield put({
        type: 'saveRadarData',
        payload: response
      });
    },
    * fetchTrendData({ payload }, { call, put }) {
      const response = yield call(getClassGrade, {
        ...payload,
        type: 'trend',
      });
      yield put({
        type: 'saveTrendData',
        payload: response,
        scoreType: payload.scoreType
      });
    },
    * fetchKaoqinData({ payload }, { call, put }) {
      const response = yield call(getClassKaoqinData, {
        ...payload
      });
      yield put({
        type: 'saveKaoqinData',
        payload: response,
        termMap: payload.termMap
      });
    },
    * fetchExamRank({ payload }, { call, put }) {
      const response = yield call(getExamRank, {
        ...payload
      });

      yield put({
        type: 'saveExamRank',
        payload: response,
      });
    },
    * fetchExamRecords({ payload }, { call, put }) {
      const response = yield call(getExamRecords, {
        ...payload
      });
      yield put({
        type: 'saveExamRecords',
        payload: response,
      });
    },
    * fetchScoreDistribution({ payload }, { call, put }) {
      const response = yield call(getScoreDistribution, {
        ...payload
      });
      yield put({
        type: 'saveScoreDistribution',
        payload: response,
      });
    },
    * fetchExamSummary({ payload }, { call, put }) {
      const response = yield call(getExamSummary, {
        ...payload
      });
      yield put({
        type: 'saveExamSummary',
        payload: response,
      });
    },
    * fetchClassExamList({ payload }, { call, put }) {
      const response = yield call(getClassExamList, {
        ...payload
      });
      yield put({
        type: 'saveClassExamList',
        payload: response,
      });
    },


  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveClassBasic(state, { payload }) {
      if (!payload) {
        return state;
      }
      return {
        ...state,
        classInfo: {
          ...payload
        },
      };
    },
    saveDistributionData(state, { payload }) {
      if (!payload) {
        return state;
      }
      return {
        ...state,
        distributionData: {
          ...payload
        },
      };
    },
    saveClassList(state, { payload }) {
      if (!payload) {
        return state;
      }
      return {
        ...state,
        classList: payload,
      };
    },
    saveTeachers(state, { payload }) {
      if (!payload) {
        return state;
      }
      return {
        ...state,
        teachers: payload.map((data) => {
          return {
            id: data.teacher_id,
            name: data.teacher__name,
            courseName: COURSE_ALIAS[data.course_id],
            color: COURSE_COLOR[data.course_id],
          };
        })
      };
    },
    saveRadarData(state, { payload }) {
      if (!payload) {
        return state;
      }

      let radarData = new DataSet.View().source(payload.map((data) => {
        return {
          'item': COURSE_ALIAS[data.sub_exam__course_id],
          [SCORE_LEVEL_ALIAS.highest]: data.highest > 0 ? Number(data.highest.toFixed(0)) : 0,
          [SCORE_LEVEL_ALIAS.lowest]: data.lowest > 0 ? Number(data.lowest.toFixed(0)) : 0,
          [SCORE_LEVEL_ALIAS.average]: data.average > 0 ? Number(data.average.toFixed(0)) : 0,
        };
      })).transform({
        type: "fold",
        fields: Object.values(SCORE_LEVEL_ALIAS),
        key: "user",
        value: "score" // value字段
      });

      if (radarData.rows.length && radarData.range('score')[1] > 100) {
        radarData = radarData.transform({
          type: 'map',
          callback(data) {
            data.score = Number((data.score / radarData.range('score')[1] * 100).toFixed(0));
            return data;
          }
        });
      }
      return {
        ...state,
        radarData: radarData.rows
      };
    },
    saveTrendData(state, { payload, scoreType }) {
      if (!payload) {
        return state;
      }
      let maxRank = 0;
      const totalTrend = [];
      let subTrends = {};
      const results = payload.results;
      const typeMap = payload.type_map;
      for (let key in results) {
        for (let record of results[key]) {
          if (record.course === 60) {
            totalTrend.push({
              exam: key,
              type: typeMap[key],
              score: record.score
            });
            continue;
          }
          if (!subTrends[record.course]) {
            subTrends[record.course] = [];
          }
          subTrends[record.course].push({
            exam: key,
            type: typeMap[key],
            score: record.score
          });
          maxRank = maxRank > record.score ? maxRank : record.score;
        }
      }

      subTrends = new DataSet.View().source([subTrends]).transform({
        type: "fold",
        fields: Object.keys(subTrends),
        // 展开字段集
        key: "title",
        // key字段
        value: "lineData" // value字段
      }).rows;
      return {
        ...state,
        totalTrend,
        subTrends,
        maxRank,
        scoreType
      };
    },
    saveKaoqinData(state, action) {
      if (!action.payload) {
        return state;
      }
      let termList = {};
      let count = 0;
      const { termMap } = action;
      const { summary, records, details } = action.payload;
      state.kaoqinSummary = summary.map((data) => {
        count = count + data.count;
        return {
          'name': EVENT_TYPE_ALIAS[data.event__type_id],
          'count': data.count
        };
      });
      const kaoqinData = records.map((data) => {
        termList[termMap[data.term]] = 1;
        return {
          'name': EVENT_TYPE_ALIAS[data.event__type_id],
          [termMap[data.term]]: data.count,
        };
      });

      termList = Object.keys(termList);
      const data = new DataSet.View().source(kaoqinData).transform({
        type: "fold",
        fields: termList,
        key: "term",
        value: "count"
      }).transform({
        type: 'filter',
        callback(row) {
          return row.count;
        }
      });

      data.rows.sort((a, b) => {
        return (b.term > a.term) ? -1 : 1;
      });


      const kaoqinDetail = {};
      let studentList = {};
      details.map(data => {
        if (!kaoqinDetail[termMap[data.term]]) {
          kaoqinDetail[termMap[data.term]] = [];
        }
        studentList[data.name] = 1;
        kaoqinDetail[termMap[data.term]].push({
          'name': EVENT_TYPE_ALIAS[data.event_id],
          [data.name]: data.count,
        });
      });
      studentList = Object.keys(studentList);

      return {
        ...state,
        kaoqinData: data.rows,
        termList,
        kaoqinDetail,
        studentList,
        kaoqinCount:count
      };
    },
    saveExamRecords(state, { payload }) {
      if (!payload) {
        return state;
      }
      let overLineCounter = [0, 0, 0];

      const examRecords = [];

      for (let student in payload) {
        const records = payload[student];
        let totalScore = 0;
        for (let courseId in records) {
          const score = records[courseId];
          totalScore += score;
        }
        for (let lineIndex in overLineCounter) {
          if (totalScore > LINE_SCORE[lineIndex]) {
            overLineCounter[lineIndex] += 1;
            break;
          }
        }
        examRecords.push({
          name: student,
          ...records,
          total: totalScore
        });
      }

      examRecords.sort((a, b) => b.total - a.total);
      return {
        ...state,
        examRecords: examRecords.map((data, index) => {
          return { ...data, rank: index + 1 };
        }),
        overLineCounter
      };
    },
    saveExamRank(state, { payload }) {
      if (!payload) {
        return state;
      }

      const curClass = state.classInfo.id;
      const rankData = [];
      let totalScoreData = {};
      let classList = {};
      let subScore = {};
      let classMap = {};
      for (let courseId in payload) {
        if (!subScore[courseId]) {
          subScore[courseId] = [];
        }

        const records = payload[courseId];
        for (let index in records) {
          const classId = records[index].class_id;
          classMap[classId] = records[index].class_name;
          classList[classId] = 1;
          if (classId === curClass) {
            rankData.push({
              course: `${COURSE_FULLNAME_ALIAS[courseId]}排名`,
              rank: Number(index)
            });
          }

          subScore[courseId].push({
            classId: classId,
            score: records[index].average
          });

          if (!totalScoreData[classId]) {
            totalScoreData[classId] = 0;
          }
          totalScoreData[classId] += records[index].average;
        }
      }
      classList = Object.keys(classList);
      totalScoreData = new DataSet.View().source([totalScoreData]).transform({
        type: "fold",
        fields: classList,
        // 展开字段集
        key: 'classId',
        // key字段
        value: 'score',
      }).rows;
      totalScoreData = totalScoreData.sort((a, b) => a.score - b.score);
      const classNum = Object.keys(classMap).length;
      let totalRank = 0;
      for (let index in totalScoreData) {
        if (Number(totalScoreData[index].classId) === curClass) {
          totalRank = Number(index);
          break;
        }
      }
      const scoreData = {
        '-1': totalScoreData,
        ...subScore,
      };
      return {
        ...state,
        courseRankData: {
          totalRank,
          classNum,
          rankData
        },
        scoreData,
        classMap,
      };
    },
    saveScoreDistribution(state, { payload }) {
      if (!payload) {
        return state;
      }
      let scoreDistributionData = {};
      for (let classId in payload) {
        for (let maxScore in payload[classId]) {
          for (let record of payload[classId][maxScore]) {
            const courseId = record.sub_exam__course_id;
            if (!scoreDistributionData[courseId]) {
              scoreDistributionData[courseId] = [];
            }
            scoreDistributionData[courseId].push({
              classId,
              maxScore,
              count: record.count
            });
          }
        }
      }
      return {
        ...state,
        scoreDistributionData,
      };
    },
    saveExamSummary(state, { payload }) {
      if (!payload) {
        return state;
      }
      const examSummary = {};
      return {
        ...state,
        examSummary: {
          attendCount: payload.attend_count,
          absentCount: payload.absent_count,
          freeCount: payload.free_count
        }
      };
    },
    saveClassExamList(state, { payload }) {
      if (!payload) {
        return state;
      }
      return {
        ...state,
        classExamList: payload.map(data => {
          return {
            id: data.sub_exam__exam_id,
            name: data.sub_exam__exam__name,
          };
        }),
      };
    },
    clear() {
      return {
        radarData: [],
      };
    }
    ,
  },
};
