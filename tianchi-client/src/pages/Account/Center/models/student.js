/**
 * Created by 胡晓慧 on 2019/4/12.
 */

import {
  fakeChartData,
  getConsumption,
  getKaoqinData,
  getStudentBasic,
  getGrade,
  getStudentList,
  getStudentTeachers,
} from '@/services/api';
import { COURSE_ALIAS, EVENT_TYPE_ALIAS, SCORE_LEVEL_ALIAS, WEEKDAY_ALIAS } from "@/constants";

let data =
  [
    {
      "x": "China",
      "value": 138322000,
      "category": "asia"
    }, {
    "x": "India",
    "value": 131600000,
    "category": "asia"
  }, {
    "x": "United States",
    "value": 324982000,
    "category": "america"
  }, {
    "x": "Indonesia",
    "value": 263510000,
    "category": "asia"
  }, {
    "x": "Brazil",
    "value": 207505000,
    "category": "america"
  }, {
    "x": "Pakistan",
    "value": 196459000,
    "category": "asia"
  }, {
    "x": "Nigeria",
    "value": 191836000,
    "category": "africa"
  }, {
    "x": "Bangladesh",
    "value": 162459000,
    "category": "asia"
  }, {
    "x": "Russia",
    "value": 146804372,
    "category": "europe"
  }, {
    "x": "Japan",
    "value": 126790000,
    "category": "asia"
  }, {
    "x": "Mexico",
    "value": 123518000,
    "category": "america"
  }, {
    "x": "Ethiopia",
    "value": 104345000,
    "category": "africa"
  }, {
    "x": "Philippines",
    "value": 104037000,
    "category": "asia"
  }, {
    "x": "Egypt",
    "value": 93013300,
    "category": "africa"
  }, {
    "x": "Vietnam",
    "value": 92700000,
    "category": "asia"
  }, {
    "x": "Germany",
    "value": 82800000,
    "category": "europe"
  }, {
    "x": "Democratic Republic of the Congo",
    "value": 82243000,
    "category": "africa"
  }, {
    "x": "Iran",
    "value": 80135400,
    "category": "asia"
  }, {
    "x": "Turkey",
    "value": 79814871,
    "category": "asia"
  }, {
    "x": "Thailand",
    "value": 68298000,
    "category": "asia"
  }, {
    "x": "France",
    "value": 67013000,
    "category": "europe"
  }, {
    "x": "United Kingdom",
    "value": 65110000,
    "category": "europe"
  }, {
    "x": "Italy",
    "value": 60599936,
    "category": "europe"
  }, {
    "x": "Tanzania",
    "value": 56878000,
    "category": "africa"
  }, {
    "x": "South Africa",
    "value": 55908000,
    "category": "africa"
  }, {
    "x": "Myanmar",
    "value": 54836000,
    "category": "asia"
  }, {
    "x": "South Korea",
    "value": 51446201,
    "category": "asia"
  }, {
    "x": "Colombia",
    "value": 49224700,
    "category": "america"
  }, {
    "x": "Kenya",
    "value": 48467000,
    "category": "africa"
  }, {
    "x": "Spain",
    "value": 46812000,
    "category": "europe"
  }, {
    "x": "Argentina",
    "value": 43850000,
    "category": "america"
  }, {
    "x": "Ukraine",
    "value": 42541633,
    "category": "europe"
  }, {
    "x": "Sudan",
    "value": 42176000,
    "category": "africa"
  }, {
    "x": "Uganda",
    "value": 41653000,
    "category": "africa"
  }, {
    "x": "Algeria",
    "value": 41064000,
    "category": "africa"
  }, {
    "x": "Poland",
    "value": 38424000,
    "category": "europe"
  }, {
    "x": "Iraq",
    "value": 37883543,
    "category": "asia"
  }, {
    "x": "Canada",
    "value": 36541000,
    "category": "america"
  }, {
    "x": "Morocco",
    "value": 34317500,
    "category": "africa"
  }, {
    "x": "Saudi Arabia",
    "value": 33710021,
    "category": "asia"
  }, {
    "x": "Uzbekistan",
    "value": 32121000,
    "category": "asia"
  }, {
    "x": "Malaysia",
    "value": 32063200,
    "category": "asia"
  }, {
    "x": "Peru",
    "value": 31826018,
    "category": "america"
  }, {
    "x": "Venezuela",
    "value": 31431164,
    "category": "america"
  }, {
    "x": "Nepal",
    "value": 28825709,
    "category": "asia"
  }, {
    "x": "Angola",
    "value": 28359634,
    "category": "africa"
  }, {
    "x": "Ghana",
    "value": 28308301,
    "category": "africa"
  }, {
    "x": "Yemen",
    "value": 28120000,
    "category": "asia"
  }, {
    "x": "Afghanistan",
    "value": 27657145,
    "category": "asia"
  }, {
    "x": "Mozambique",
    "value": 27128530,
    "category": "africa"
  }, {
    "x": "Australia",
    "value": 24460900,
    "category": "australia"
  }, {
    "x": "North Korea",
    "value": 24213510,
    "category": "asia"
  }, {
    "x": "Taiwan",
    "value": 23545680,
    "category": "asia"
  }, {
    "x": "Cameroon",
    "value": 23248044,
    "category": "africa"
  }, {
    "x": "Ivory Coast",
    "value": 22671331,
    "category": "africa"
  }, {
    "x": "Madagascar",
    "value": 22434363,
    "category": "africa"
  }, {
    "x": "Niger",
    "value": 21564000,
    "category": "africa"
  }, {
    "x": "Sri Lanka",
    "value": 21203000,
    "category": "asia"
  }, {
    "x": "Romania",
    "value": 19760000,
    "category": "europe"
  }, {
    "x": "Burkina Faso",
    "value": 19632147,
    "category": "africa"
  }, {
    "x": "Syria",
    "value": 18907000,
    "category": "asia"
  }, {
    "x": "Mali",
    "value": 18875000,
    "category": "africa"
  }, {
    "x": "Malawi",
    "value": 18299000,
    "category": "africa"
  }, {
    "x": "Chile",
    "value": 18191900,
    "category": "america"
  }, {
    "x": "Kazakhstan",
    "value": 17975800,
    "category": "asia"
  }, {
    "x": "Netherlands",
    "value": 17121900,
    "category": "europe"
  }, {
    "x": "Ecuador",
    "value": 16737700,
    "category": "america"
  }, {
    "x": "Guatemala",
    "value": 16176133,
    "category": "america"
  }, {
    "x": "Zambia",
    "value": 15933883,
    "category": "africa"
  }, {
    "x": "Cambodia",
    "value": 15626444,
    "category": "asia"
  }, {
    "x": "Senegal",
    "value": 15256346,
    "category": "africa"
  }, {
    "x": "Chad",
    "value": 14965000,
    "category": "africa"
  }, {
    "x": "Zimbabwe",
    "value": 14542235,
    "category": "africa"
  }, {
    "x": "Guinea",
    "value": 13291000,
    "category": "africa"
  }, {
    "x": "South Sudan",
    "value": 12131000,
    "category": "africa"
  }, {
    "x": "Rwanda",
    "value": 11553188,
    "category": "africa"
  }, {
    "x": "Belgium",
    "value": 11356191,
    "category": "europe"
  }, {
    "x": "Tunisia",
    "value": 11299400,
    "category": "africa"
  }, {
    "x": "Cuba",
    "value": 11239004,
    "category": "america"
  }, {
    "x": "Bolivia",
    "value": 11145770,
    "category": "america"
  }, {
    "x": "Somalia",
    "value": 11079000,
    "category": "africa"
  }, {
    "x": "Haiti",
    "value": 11078033,
    "category": "america"
  }, {
    "x": "Greece",
    "value": 10783748,
    "category": "europe"
  }, {
    "x": "Benin",
    "value": 10653654,
    "category": "africa"
  }, {
    "x": "Czech Republic",
    "value": 10578820,
    "category": "europe"
  }, {
    "x": "Portugal",
    "value": 10341330,
    "category": "europe"
  }, {
    "x": "Burundi",
    "value": 10114505,
    "category": "africa"
  }, {
    "x": "Dominican Republic",
    "value": 10075045,
    "category": "america"
  }, {
    "x": "Sweden",
    "value": 10054100,
    "category": "europe"
  }, {
    "x": "United Arab Emirates",
    "value": 10003223,
    "category": "asia"
  }, {
    "x": "Jordan",
    "value": 9889270,
    "category": "asia"
  }, {
    "x": "Azerbaijan",
    "value": 9823667,
    "category": "asia"
  }, {
    "x": "Hungary",
    "value": 9799000,
    "category": "europe"
  }, {
    "x": "Belarus",
    "value": 9498600,
    "category": "europe"
  }, {
    "x": "Honduras",
    "value": 8866351,
    "category": "america"
  }, {
    "x": "Austria",
    "value": 8773686,
    "category": "europe"
  }, {
    "x": "Tajikistan",
    "value": 8742000,
    "category": "asia"
  }, {
    "x": "Israel",
    "value": 8690220,
    "category": "asia"
  }, {
    "x": "Switzerland",
    "value": 8417700,
    "category": "europe"
  }, {
    "x": "Papua New Guinea",
    "value": 8151300,
    "category": "australia"
  }];

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
    },
    termList: [],
    studentList: [],
    wordCloudData: data,
    visitData: [],
    visitData2: [],
    salesData: [],
    searchData: [],
    offlineData: [],
    offlineChartData: [],
    salesTypeData: [],
    salesTypeDataOnline: [],
    salesTypeDataOffline: [],
    radarData: [],
    consumptionData: {
      hourly: [],
      daily: [],
      date: ''
    },
    student: [],
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
    * fetchKaoqinData({ payload }, { call, put }) {
      const response = yield call(getKaoqinData, payload.studentId);
      yield put({
        type: 'saveKaoqinData',
        payload: response,
        termMap: payload.termMap
      });
    },
    * fetchConsumptionData({ payload }, { call, put }) {
      const response = yield call(getConsumption, payload);
      yield put({
        type: 'saveConsumptionData',
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
        termMap: payload.termMap
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
            }
          })
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
    saveStudentList(state, action) {
      return {
        ...state,
        studentList: action.payload ? action.payload : state.studentInfo,
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
    saveConsumptionData(state, action) {
      if (!action.payload) {
        return state;
      }
      const lastWeekData = action.payload.last_week_data;
      const thisWeekData = action.payload.this_week_data;
      const dailyData = [];
      for (let data of lastWeekData) {
        dailyData.push({
          time: WEEKDAY_ALIAS[data.weekday],
          diftime: "上周",
          cost: -data.total_cost
        });
      }

      for (let data of thisWeekData) {
        dailyData.push({
          time: WEEKDAY_ALIAS[data.weekday],
          diftime: "本周",
          cost: -data.total_cost
        });
      }

      return {
        ...state,
        consumptionData: {
          date: action.payload.date,
          daily: dailyData,
          hourly: action.payload.hourly_data.map(data => {
            return {
              hour: data.hour,
              total_cost: -data.total_cost
            };
          })
        }
      };
    },
    clear() {
      return {
        visitData: [],
        visitData2: [],
        salesData: [],
        searchData: [],
        offlineData: [],
        offlineChartData: [],
        salesTypeData: [],
        salesTypeDataOnline: [],
        salesTypeDataOffline: [],
        radarData: [],
      };
    },
  },
};
