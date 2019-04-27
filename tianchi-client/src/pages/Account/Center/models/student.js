/**
 * Created by 胡晓慧 on 2019/4/12.
 */

import {
  fakeChartData,
  getCompare,
  getConsumption,
  getGrade,
  getKaoqinData,
  getStudentBasic,
  getStudentList,
  getStudentTeachers,
} from '@/services/api';
import { COURSE_ALIAS, COURSE_FULLNAME_ALIAS, EVENT_TYPE_ALIAS, SCORE_LEVEL_ALIAS, WEEKDAY_ALIAS } from "@/constants";

let data =
  [
    {
      "x": "China",
      "value": 2,
      "category": "asia"
    }, {
    "x": "India",
    "value": 3,
    "category": "asia"
  }, {
    "x": "United States",
    "value": 4,
    "category": "america"
  }, {
    "x": "Indonesia",
    "value": 2,
    "category": "asia"
  }, {
    "x": "Brazil",
    "value": 5,
    "category": "america"
  }, {
    "x": "Pakistan",
    "value": 2,
    "category": "asia"
  }, {
    "x": "Nigeria",
    "value": 1,
    "category": "africa"
  }, {
    "x": "Bangladesh",
    "value": 2,
    "category": "asia"
  }, {
    "x": "Russia",
    "value": 3,
    "category": "europe"
  }, {
    "x": "Japan",
    "value": 2,
    "category": "asia"
  }
  ];

export default {
  namespace: 'student',

  state: {
    studentInfo: {
      id: '',
      name: '',
      radarData: [],
      teacherInfo: [],
      kaoqinData: [],
      kaoqinSummary: [],
      totalTrend: [],
      subTrends: [],
    },
    vsStudentInfo: {
      id: '',
      name: ''
    },
    gradeVsData: [],
    termList: [],
    studentList: [],
    vsStudentList: [],
    wordCloudData: data,
    radarData: [],
    hourlyAvgCost: [],
    dailySumCost: [],
    dailyPredictData: {
      date: '',
      dateRange: 0,
      lastCycleData: [],
      thisCycleData: [],
      predictData: [],
    },
    hourlyCost: [],
    consumptionData: {

      daily: [],
      date: ''
    },
    loading: false,
  },

  effects: {
    * fetchBasic({ payload }, { call, put }) {
      const response = yield call(getStudentBasic, payload.studentId);
      yield put({
        type: 'saveStudentBasic',
        payload: response
      });
    },
    * fetchVsBasic({ payload }, { call, put }) {
      const response = yield call(getStudentBasic, payload.studentId);
      yield put({
        type: 'saveVsStudentBasic',
        payload: response
      });
    },
    * fetchRadarData({ payload }, { call, put }) {
      const response = yield call(getGrade, {
        ...payload,
        type: 'radar'
      });
      yield put({
        type: 'saveRadarData',
        payload: response
      });
    },
    * fetchTeacher({ payload }, { call, put }) {
      const response = yield call(getStudentTeachers, payload.studentId);
      yield put({
        type: 'saveStudentTeachers',
        payload: response
      });
    },
    * fetchStudentList({ payload }, { call, put }) {
      const response = yield call(getStudentList, payload.query);
      yield put({
        type: 'saveStudentList',
        payload: response
      });
    },
    * fetchVsStudentList({ payload }, { call, put }) {
      const response = yield call(getStudentList, payload.query);
      yield put({
        type: 'saveVsStudentList',
        payload: response
      });
    },
    * fetchKaoqinData({ payload }, { call, put }) {
      const response = yield call(getKaoqinData, payload.studentId);
      yield put({
        type: 'saveKaoqinData',
        payload: response,
        termMap: payload.termMap
      });
    },
    * fetchHourlyAvgCost({ payload }, { call, put }) {
      const response = yield call(getConsumption, {
        ...payload,
        type: 'hourly_avg'
      });
      yield put({
        type: 'saveHourlyAvgCost',
        payload: response,
      });
    },
    * fetchDailySumCost({ payload }, { call, put }) {
      const response = yield call(getConsumption, {
        ...payload,
        type: 'daily_sum'
      });
      yield put({
        type: 'saveDailySumCost',
        payload: response,
      });
    },
    * fetchTotalTrend({ payload }, { call, put }) {
      const response = yield call(getGrade, {
        ...payload,
        type: 'total_trend'
      });
      yield put({
        type: 'saveTotalTrend',
        payload: response,
      });
    },
    * fetchSubTrends({ payload }, { call, put }) {
      const response = yield call(getGrade, {
        ...payload,
        type: 'subject_trend'
      });
      yield put({
        type: 'saveSubTrends',
        payload: response,
      });
    },
    * fetchDailyPredictData({ payload }, { call, put }) {
      const response = yield call(getConsumption, {
        ...payload,
        type: 'predict'
      });
      yield put({
        type: 'saveDailyPredictData',
        payload: response,
      });
    },
    * fetchHourlyCost({ payload }, { call, put }) {
      const response = yield call(getConsumption, {
        ...payload,
        type: 'hourly'
      });
      yield put({
        type: 'saveHourlyCost',
        payload: response,
      });
    },
    * fetchGradeCompare({ payload }, { call, put }) {
      const response = yield call(getCompare, {
        ...payload,
        type: 'grade'
      });
      yield put({
        type: 'saveGradeVsData',
        payload: response,
      });
    }
  },

  reducers: {
    save(state, { payload }) {
      return {
        ...state,
        ...payload,
      };
    },
    saveTotalTrend(state, { payload }) {
      if (!payload) {
        return state;
      }
      return {
        ...state,
        studentInfo: {
          ...state.studentInfo,
          totalTrend: payload.map(data => {
            return {
              exam: data.sub_exam__exam__name,
              score: data.total_score
            };
          })
        },
      };
    },
    saveSubTrends(state, { payload }) {
      if (!payload) {
        return state;
      }

      return {
        ...state,
        studentInfo: {
          ...state.studentInfo,
          subTrends: payload
        },
      };
    },
    saveStudentBasic(state, action) {
      return {
        ...state,
        studentInfo: action.payload ? {
          ...state.studentInfo,
          ...action.payload
        } : state.studentInfo,
      };
    },
    saveVsStudentBasic(state, action) {
      return {
        ...state,
        vsStudentInfo: action.payload ? {
          ...state.vsStudentInfo,
          ...action.payload
        } : state.vsStudentInfo,
      };
    },
    saveStudentList(state, action) {
      return {
        ...state,
        studentList: action.payload ? action.payload : [],
      };
    },
    saveVsStudentList(state, action) {
      return {
        ...state,
        vsStudentList: action.payload ? action.payload : [],
      };
    },
    saveStudentTeachers(state, action) {
      return {
        ...state,
        studentInfo: action.payload ? {
          ...state.studentInfo,
          teacherInfo: action.payload.map((data) => {
            return {
              id: data.teacher_id,
              name: data.teacher__name,
              courseName: COURSE_ALIAS[data.course_id],
            };
          })
        } : state.studentInfo,
      };
    },
    saveRadarData(state, action) {
      return {
        ...state,
        studentInfo: action.payload ? {
          ...state.studentInfo,
          radarData: action.payload.map((data) => {
            return {
              'item': COURSE_ALIAS[data.sub_exam__course_id],
              [SCORE_LEVEL_ALIAS.highest]: Number(data.highest.toFixed(0)),
              [SCORE_LEVEL_ALIAS.lowest]: Number(data.lowest.toFixed(0)),
              [SCORE_LEVEL_ALIAS.average]: Number(data.average.toFixed(0)),
            };
          })
        } : state.studentInfo,
      };
    },
    saveKaoqinData(state, action) {
      if (!action.payload) {
        return state;
      }
      const termList = {};
      const { termMap } = action;
      const { summary, records } = action.payload;
      state.studentInfo.kaoqinSummary = summary.map((data) => {
        return {
          'name': EVENT_TYPE_ALIAS[data.event__type_id],
          'count': data.count
        };
      });
      state.studentInfo.kaoqinData = records.map((data) => {
        termList[termMap[data.term]] = 1;
        return {
          'name': EVENT_TYPE_ALIAS[data.event__type_id],
          [termMap[data.term]]: data.count,
        };
      });
      state.termList = Object.keys(termList);
      return state;
    },
    saveHourlyAvgCost(state, { payload }) {
      if (!payload) {
        return state;
      }
      return {
        ...state,
        hourlyAvgCost: payload
      };
    },
    saveDailySumCost(state, { payload }) {
      if (!payload) {
        return state;
      }
      return {
        ...state,
        dailySumCost: payload
      };
    },
    saveHourlyCost(state, { payload }) {
      if (!payload) {
        return state;
      }
      const hourlyCost = [];
      payload.student_data.map((data) => {
          hourlyCost.push({
            type: '该学生',
            hour: data.hour,
            cost: -data.avg_cost
          });
        }
      );
      payload.global_data.map((data) => {
          hourlyCost.push({
            type: '全校',
            hour: data.hour,
            cost: -data.avg_cost
          });
        }
      );
      return {
        ...state,
        hourlyCost
      };
    },
    saveDailyPredictData(state, { payload }) {
      if (!payload) {
        return state;
      }
      const dailyPredictData = {};
      dailyPredictData.date = payload.date;
      dailyPredictData.dateRange = payload.date_range;
      dailyPredictData.lastCycleData = payload.last_cycle_data.map((data) => {
        return {
          date: data.date,
          offset: data.offset,
          'last': -data.total_cost
        };
      });
      dailyPredictData.thisCycleData = payload.this_cycle_data.map((data) => {
        return {
          date: data.date,
          offset: data.offset,
          'now': -data.total_cost
        };
      });
      dailyPredictData.predictData = payload.this_cycle_data.map((data) => {
        return {
          date: data.date,
          offset: data.offset,
          'future': -data.total_cost
        };
      });

      return {
        ...state,
        dailyPredictData
      };
    },
    saveGradeVsData(state, { payload }) {
      if (!payload) {
        return state;
      }

      return {
        ...state,
        gradeVsData: payload.map((data) => {
          return {
            ...data,
            course: COURSE_FULLNAME_ALIAS[data.course]
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
