/**
 * Created by 胡晓慧 on 2019/4/12.
 */

import { getClassExamData, getCoursePercent, getCourseSelectionDistribution } from '@/services/api';
import { COURSE_ALIAS, SEX_MAP } from "@/constants";

export default {
  namespace: 'course',

  state: {
    distributions: [],
    coursePercents: [],
    totalStudents: 0,
    classExamData: {
      highest: [],
      lowest: [],
      average: [],
    },
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
    * fetchClassExamData({ payload }, { call, put }) {
      const response = yield call(getClassExamData, payload);
      yield put({
        type: 'saveClassExamData',
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
    saveClassExamData(state, { payload }) {
      if (!payload) {
        return state;
      }
      const classExamData = {
        highest: [],
        lowest: [],
        average: [],
      };

      for (let data of payload) {
        const baseInfo = {
          stuClass: data.stu_class,
          exam: data.exam_name
        };

        classExamData.highest.push({
          ...baseInfo,
          score: data.highest_score
        });
        classExamData.lowest.push({
          ...baseInfo,
          score: data.lowest_score
        });
        classExamData.average.push({
          ...baseInfo,
          score: Number((data.total_score / data.attend_count).toFixed(0))
        });
      }
      return {
        ...state,
        classExamData
      };
    },
    clear() {
      return {};
    },
  },
};
