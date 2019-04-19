/**
 * Created by 胡晓慧 on 2019/4/12.
 */

import { getCoursePercent, getCourseSelectionDistribution } from '@/services/api';
import { COURSE_ALIAS, SEX_MAP } from "@/constants";

export default {
  namespace: 'course',

  state: {
    distributions: [],
    coursePercents: [],
    totalStudents: 0,
    loading: false,
  },

  effects: {
    * fetchSelectionDistribution(_, { call, put }) {
      const response = yield call(getCourseSelectionDistribution);
      yield put({
        type: 'saveDistribution',
        payload: response
      });
    },
    * fetchCoursePercents({ payload }, { call, put }) {
      const response = yield call(getCoursePercent, payload.year || 2019);
      yield put({
        type: 'saveCoursePercents',
        payload: response
      });
    },
  },

  reducers: {
    saveDistribution(state, action) {
      if (!action.payload) {
        return state;
      }
      const distributions = action.payload.map((data) => {
        return {
          course: COURSE_ALIAS[data.course_id],
          sex: `${data.year}_${SEX_MAP[data.student__sex]}`,
          year: data.year,
          count: data.count
        };
      });
      return {
        ...state,
        distributions
      };
    },
    saveCoursePercents(state, action) {
      if (!action.payload) {
        return state;
      }
      const { total } = action.payload;
      let maxCount = 0;
      const coursePercents = action.payload.records.map((data) => {
        maxCount = data.count;
        return {
          course: COURSE_ALIAS[data.course_id],
          percent: (data.count / total * 100).toFixed(2),
          count: data.count
        };
      });
      return {
        ...state,
        coursePercents,
        totalStudents: maxCount * 1.2,
      };
    },
    clear() {
      return {};
    },
  },
};
