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
} from '@/services/api';
import {
  COURSE_ALIAS,
  COURSE_FULLNAME_ALIAS,
  EVENT_TYPE_ALIAS,
  LINE_SCORE,
  SCORE_LEVEL_ALIAS,
  WEEKDAY_ALIAS,
  COURSE_COLOR
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
    kaoqinSummary: [],
    totalTrend: [],
    subTrends: [],
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
    classExamList: [],
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
        type: 'trend'
      });
      yield put({
        type: 'saveTrendData',
        payload: response
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
      return {
        ...state,
        radarData: payload.map((data) => {
          return {
            'item': COURSE_ALIAS[data.sub_exam__course_id],
            [SCORE_LEVEL_ALIAS.highest]: Number(data.highest.toFixed(0)),
            [SCORE_LEVEL_ALIAS.lowest]: Number(data.lowest.toFixed(0)),
            [SCORE_LEVEL_ALIAS.average]: Number(data.average.toFixed(0)),
          };
        })
      };
    },
    saveTrendData(state, { payload }) {
      if (!payload) {
        return state;
      }
      const totalTrend = [];
      let subTrends = {};
      for (let key in payload) {
        for (let record of payload[key]) {
          if (record.course === 0) {
            totalTrend.push({
              exam: key,
              score: record.score
            });
            continue;
          }
          if (!subTrends[record.course]) {
            subTrends[record.course] = [];
          }
          subTrends[record.course].push({
            exam: key,
            score: record.score
          });
        }
      }
      return {
        ...state,
        totalTrend,
        subTrends,
      };
    },
    saveKaoqinData(state, action) {
      if (!action.payload) {
        return state;
      }
      const termList = {};
      const { termMap } = action;
      const { summary, records } = action.payload;
      state.kaoqinSummary = summary.map((data) => {
        return {
          'name': EVENT_TYPE_ALIAS[data.event__type_id],
          'count': data.count
        };
      });
      state.kaoqinData = records.map((data) => {
        termList[termMap[data.term]] = 1;
        return {
          'name': EVENT_TYPE_ALIAS[data.event__type_id],
          [termMap[data.term]]: data.count,
        };
      });
      state.termList = Object.keys(termList);
      return state;
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
