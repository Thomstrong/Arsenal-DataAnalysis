import { getCostSummary, getKaoqinSummary, getStudentSummary } from '@/services/api';
import {
  CLASS_CAMPUS_CHOICE,
  EVENT_TYPE_ALIAS,
  GRADE_ALIAS,
  POLICY_TYPE_ALIAS,
  SEX_FULL_MAP,
  STAY_ALIAS
} from "@/constants";

export default {
  namespace: 'dashboard',

  state: {
    campusData: [],
    totalStudentCount: 0,
    stayData: [],
    totalStayCount: 0,
    gradeData: [],
    nationData: [],
    nativePlaceData: [],
    policyData: [],
    yearCostData: [],
    totalYearCost: 0,
    dailyAvgCost: 0,
    kaoqinSummaryData: [],
    totalKaoqinCount: 0,
    sexHourlyCostData: [],
    stayCostData: [],
    gradeCostData: [],
    enterSchoolData: [],
  },

  effects: {
    * fetchCampusSummary(_, { call, put }) {
      const response = yield call(getStudentSummary, {
        base: 'campus'
      });
      yield put({
        type: 'saveCampusData',
        payload: response,
      });
    },
    * fetchKaoqinSummary({ payload }, { call, put }) {
      const response = yield call(getKaoqinSummary, {
        base: 'year',
        ...payload,
      });
      yield put({
        type: 'saveKaoqinSummaryData',
        payload: response,
      });
    },
    * fetchEnterSchoolSummary({ payload }, { call, put }) {
      const response = yield call(getKaoqinSummary, {
        base: 'enter_school',
      });
      yield put({
        type: 'saveEnterSchoolData',
        payload: response,
      });
    },
    * fetchYearCostSummary({ payload }, { call, put }) {
      const response = yield call(getCostSummary, {
        base: 'year',
        ...payload,
      });
      yield put({
        type: 'saveYearCost',
        payload: response,
      });
    },
    * fetchStaySummary(_, { call, put }) {
      const response = yield call(getStudentSummary, {
        base: 'stay_school'
      });
      yield put({
        type: 'saveSatyData',
        payload: response,
      });
    },
    * fetchGradeSummary(_, { call, put }) {
      const response = yield call(getStudentSummary, {
        base: 'grade'
      });
      yield put({
        type: 'saveGradeData',
        payload: response,
      });
    },
    * fetchNationSummary(_, { call, put }) {
      const response = yield call(getStudentSummary, {
        base: 'nation'
      });
      yield put({
        type: 'saveNationData',
        payload: response
      });
    },
    * fetchPolicySummary(_, { call, put }) {
      const response = yield call(getStudentSummary, {
        base: 'policy'
      });
      yield put({
        type: 'savePolicyData',
        payload: response
      });
    },
    * fetchNativePlaceSummary(_, { call, put }) {
      const response = yield call(getStudentSummary, {
        base: 'native_place'
      });
      yield put({
        type: 'saveNativePlaceData',
        payload: response
      });
    },
    * fetchSexHourlyCostSummary(_, { call, put }) {
      const response = yield call(getCostSummary, {
        base: 'sex'
      });
      yield put({
        type: 'saveSexHourlyCostData',
        payload: response
      });
    },
    * fetchStayCostSummary(_, { call, put }) {
      const response = yield call(getCostSummary, {
        base: 'stay_school'
      });
      yield put({
        type: 'saveStaySchoolCostData',
        payload: response
      });
    },
    * fetchGradeCostSummary(_, { call, put }) {
      const response = yield call(getCostSummary, {
        base: 'grade'
      });
      yield put({
        type: 'saveGradeCostData',
        payload: response
      });
    },

  },

  reducers: {
    saveCampusData(state, { payload }) {
      if (!payload) {
        return state;
      }
      let totalStudentCount = 0;
      return {
        ...state,
        campusData: payload.map(data => {
          totalStudentCount += data.count;
          return {
            campus: CLASS_CAMPUS_CHOICE[data.stu_class__campus_name],
            count: data.count
          };
        }),
        totalStudentCount
      };
    },
    saveSexHourlyCostData(state, { payload }) {
      if (!payload) {
        return state;
      }
      return {
        ...state,
        sexHourlyCostData: payload.map(data => {
          return {
            hour: data.hour,
            sex: SEX_FULL_MAP[data.student__sex],
            cost: Number(data.total_cost.toFixed(2))
          };
        })
      };
    },
    saveStaySchoolCostData(state, { payload }) {
      if (!payload) {
        return state;
      }
      return {
        ...state,
        stayCostData: payload.map(data => {
          return {
            hour: data.hour,
            stayType: STAY_ALIAS[Number(data.student__is_stay_school)],
            cost: Number(data.total_cost.toFixed(2))
          };
        })
      };
    },
    saveYearCost(state, { payload }) {
      if (!payload) {
        return state;
      }
      let totalYearCost = 0;
      let count = 0;
      return {
        ...state,
        yearCostData: payload.map(data => {
          totalYearCost += data.total_cost;
          count += 1;
          return {
            x: data.date,
            y: Number(data.total_cost.toFixed(2))
          };
        }),
        totalYearCost: Number(totalYearCost.toFixed(2)),
        dailyAvgCost: Number((totalYearCost / count).toFixed(2))
      };
    },
    saveKaoqinSummaryData(state, { payload }) {
      if (!payload) {
        return state;
      }
      let totalKaoqinCount = 0;
      return {
        ...state,
        kaoqinSummaryData: payload.map(data => {
          totalKaoqinCount += data.count;
          return {
            x: EVENT_TYPE_ALIAS[data.event__type_id],
            y: data.count
          };
        }),
        totalKaoqinCount: totalKaoqinCount,
      };
    },
    saveEnterSchoolData(state, { payload }) {
      if (!payload) {
        return state;
      }
      const data = [];
      for (let i in payload) {
        for (let j in payload[i]) {
          data.push({
            weekday: Number(i),
            hour: Number(j),
            count: payload[i][j]
          });
        }
      }
      return {
        ...state,
        enterSchoolData: data,
      };
    },
    saveSatyData(state, { payload }) {
      if (!payload) {
        return state;
      }
      let totalStayCount = 0;
      return {
        ...state,
        stayData: payload.map(data => {
          if (data.student__is_stay_school) {
            totalStayCount += data.count;
          }
          return {
            type: STAY_ALIAS[Number(data.student__is_stay_school)],
            name: `${STAY_ALIAS[Number(data.student__is_stay_school)]}${SEX_FULL_MAP[data.student__sex]}`,
            value: data.count,
          };
        }),
        totalStayCount
      };
    },
    saveGradeData(state, { payload }) {
      if (!payload) {
        return state;
      }
      return {
        ...state,
        gradeData: payload.map(data => {
          return {
            type: GRADE_ALIAS[data.stu_class__grade_name],
            name: `${GRADE_ALIAS[data.stu_class__grade_name]}${SEX_FULL_MAP[data.student__sex]}`,
            value: data.count,
          };
        })
      };
    },
    saveNationData(state, { payload }) {
      if (!payload) {
        return state;
      }
      return {
        ...state,
        nationData: payload.map(data => {
          return {
            x: data.student__nation,
            y: data.count,
          };
        })
      };
    },
    saveGradeCostData(state, { payload }) {
      if (!payload) {
        return state;
      }
      const gradeCostData = [];
      for (let grade of ['1', '2', '3']) {
        payload[grade].map((data) => [
          gradeCostData.push({
            hour: data.hour,
            cost: Number(data.avg_cost.toFixed(2)),
            grade: GRADE_ALIAS[Number(grade)]
          })
        ]);
      }
      return {
        ...state,
        gradeCostData
      };
    },
    savePolicyData(state, { payload }) {
      if (!payload) {
        return state;
      }
      return {
        ...state,
        policyData: payload.map(data => {
          return {
            x: POLICY_TYPE_ALIAS[data.student__policy],
            y: data.count,
          };
        })
      };
    },
    saveNativePlaceData(state, { payload }) {
      if (!payload) {
        return state;
      }
      return {
        ...state,
        nativePlaceData: payload.map(data => {
          return {
            x: data.student__native_place,
            y: data.count,
          };
        })
      };
    },
    clear() {
      return {};
    },
  },
};
