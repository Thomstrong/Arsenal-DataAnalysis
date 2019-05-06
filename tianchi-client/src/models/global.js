import { getTermMap, getTotalHourlyAvgCost, getWordCloudMap, queryNotices } from '@/services/api';

export default {
  namespace: 'global',

  state: {
    collapsed: false,
    notices: [],
    termMap: null,
    wordCloudMap: null,
    totalHourlyAvgCost: [],
  },

  effects: {
    * fetchNotices(_, { call, put, select }) {
      const data = yield call(queryNotices);
      yield put({
        type: 'saveNotices',
        payload: data,
      });
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: data.length,
          unreadCount,
        },
      });
    },
    * clearNotices({ payload }, { put, select }) {
      yield put({
        type: 'saveClearedNotices',
        payload,
      });
      const count = yield select(state => state.global.notices.length);
      const unreadCount = yield select(
        state => state.global.notices.filter(item => !item.read).length
      );
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: count,
          unreadCount,
        },
      });
    },
    * changeNoticeReadState({ payload }, { put, select }) {
      const notices = yield select(state =>
        state.global.notices.map(item => {
          const notice = { ...item };
          if (notice.id === payload) {
            notice.read = true;
          }
          return notice;
        })
      );
      yield put({
        type: 'saveNotices',
        payload: notices,
      });
      yield put({
        type: 'user/changeNotifyCount',
        payload: {
          totalCount: notices.length,
          unreadCount: notices.filter(item => !item.read).length,
        },
      });
    },
    * fetchTermMap({ payload }, { call, put }) {
      const response = yield call(getTermMap);
      yield put({
        type: 'saveTermMap',
        payload: response
      });
    },
    * fetchWordCloudMap({ payload }, { call, put }) {
      const response = yield call(getWordCloudMap);
      yield put({
        type: 'saveWordCloudMap',
        payload: response
      });
    },
    * fetchTotalHourlyAvgCost({ payload }, { call, put }) {
      const response = yield call(getTotalHourlyAvgCost);
      yield put({
        type: 'saveTotalHourlyAvgCost',
        payload: response
      });
    },
  },

  reducers: {
    changeLayoutCollapsed(state, { payload }) {
      return {
        ...state,
        collapsed: payload,
      };
    },
    saveNotices(state, { payload }) {
      return {
        ...state,
        notices: payload,
      };
    },
    saveTotalHourlyAvgCost(state, { payload }) {
      if (!payload) {
        return state;
      }
      let i = 0;
      const len = payload.length;
      if (!len) {
        return;
      }
      const template = {
        ...payload[0],
        total_avg: 0,
      };
      for (let hour = 0; hour < 24 && i < len; hour++) {
        if (payload[i].hour === hour) {
          i += 1;
          continue;
        }
        payload.push({
          ...template,
          hour
        });
      }
      return {
        ...state,
        totalHourlyAvgCost: payload,
      };
    },
    saveTermMap(state, { payload }) {
      let termMap = {};
      payload.map((data) => {
        termMap[data.id] = data.name;
      });
      return {
        ...state,
        termMap,
      };
    },
    saveWordCloudMap(state, { payload }) {
      if (!payload) {
        return state;
      }
      let wordCloudMap = {};
      payload.map((data) => {
        wordCloudMap[data.id] = data.title;
      });
      return {
        ...state,
        wordCloudMap,
      };
    },
    saveClearedNotices(state, { payload }) {
      return {
        ...state,
        notices: state.notices.filter(item => item.type !== payload),
      };
    },
  },

  subscriptions: {
    setup({ history }) {
      // Subscribe history(url) change, trigger `load` action if pathname is `/`
      return history.listen(({ pathname, search }) => {
        if (typeof window.ga !== 'undefined') {
          window.ga('send', 'pageview', pathname + search);
        }
      });
    },
  },
};
