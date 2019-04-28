import { getClassBasic, getClassGrade, getClassList, getClassTeachers, getDistribution, getClassKaoqinData} from '@/services/api';
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
    kaoqinData: [],
    kaoqinSummary: [],
    totalTrend: [],
    subTrends: [],
    termList: [],
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
    //todo 修改为班级考勤信息
    * fetchKaoqinData({ payload }, { call, put }) {
      const response = yield call(getClassKaoqinData,{
        ...payload
      });
      yield put({
        type: 'saveKaoqinData',
        payload: response,
        termMap: payload.termMap
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

    //todo 班级考勤信息的修改
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
    clear() {
      return {
        radarData: [],
      };
    }
    ,
  },
};
