import { getClassBasic, getClassList, getClassTeachers, getDistribution, } from '@/services/api';
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
    clear() {
      return {
        radarData: [],
      };
    }
    ,
  },
};
