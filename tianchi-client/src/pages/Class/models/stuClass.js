import { getClassBasic, getClassGrade, getClassList, getClassTeachers, getDistribution, } from '@/services/api';
import { COURSE_ALIAS, EVENT_TYPE_ALIAS, SCORE_LEVEL_ALIAS, WEEKDAY_ALIAS } from "@/constants";


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

    totalTrend: [],
    subTrends: []
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
      console.log(payload)
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
    clear() {
      return {
        radarData: [],
      };
    }
    ,
  },
};
