import {
  getClassBasic,
  getClassExamList,
  getClassGrade,
  getClassKaoqinData,
  getClassList,
  getClassTeachers,
  getDistribution,
  getExamRank,
} from '@/services/api';
import { COURSE_ALIAS, COURSE_FULLNAME_ALIAS, EVENT_TYPE_ALIAS, SCORE_LEVEL_ALIAS, WEEKDAY_ALIAS } from "@/constants";
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
    //选定的某一场考试的情况，包括考试各科成绩和分数段分布，以及各个科目的排名，一批等的过线人数，所有学生的排名情况
    courseRankData: {
      totalScore: 0,
      rankData: [],
      classNum: 0,
    },
    examData: {
      examRank: {},
      examStudentList: [],
      examCompareData: [],
      examDistributeData: [],
    },
    scoreData: [],
    classMap: {},
    //某一班级对应的所有考试名称和id
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
    //todo 修改为班级考勤信息
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
    //todo 针对班级某场考试而言的相关信息
    * fetchExamRank({ payload }, { call, put }) {
      const response = yield call(getExamRank, {
        ...payload
      });

      yield put({
        type: 'saveExamRank',
        payload: response,
      });
    },
    * fetchExamData({ payload }, { call, put }) {
      const response = yield call(getClassKaoqinData, {
        ...payload
      });
      yield put({
        type: 'saveExamData',
        payload: response,
      });
    },
    * fetchStudentsListData({ payload }, { call, put }) {
      const response = yield call(getClassKaoqinData, {
        ...payload
      });
      yield put({
        type: 'saveStudentsList',
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
    //todo 某一场exam信息的赋值
    saveExamData(state, action) {
      state.examData.examRank = {
        //总分的排名
        allRank: 5,
        //年级段的班级数
        totalClassNum: 12,
        //不同的班级参与的考试不一样，不同考试含有的科目不一样，因此subject是可变的
        allSubjectRank: [
          {
            subjectName: "语文排名",
            subjectRank: 2,
          },
          {
            subjectName: "数学排名",
            subjectRank: 3,
          },
          {
            subjectName: "英语排名",
            subjectRank: 4,
          }, {
            subjectName: "历史排名",
            subjectRank: 1,
          }, {
            subjectName: "物理排名",
            subjectRank: 10,
          },
        ],
        studentCrossNum: [
          {
            lineName: "2018年一段线过线人数(588)",
            studentNum: 10,
          },
          {
            lineName: "2018年二段线过线人数(490)",
            studentNum: 30,
          },
          {
            lineName: "2018年三段线过线人数(344)",
            studentNum: 40,
          },
        ],
      };
      //学生列表数据
      state.examData.examStudentList = [
        {
          index: 1,
          name: "李四",
          count: 678,
          chinese: 125,
          math: 110,
          english: 134,
          physical: 98,
          chemistry: 88,
          biological: 77,
          political: 33,
          history: 89,
          geography: 66,
          technology: 98
        },
        {
          index: 2,
          name: "张三",
          count: 678,
          chinese: 125,
          math: 110,
          english: 134,
          physical: 98,
          chemistry: 88,
          biological: 77,
          political: 33,
          history: 89,
          geography: 66,
          technology: 98
        }
      ];
      // 各科目与其他班的对比数据
      //基本条状data，展示该班在对应年级平均分的排名情况
      //因为bizchart的高亮是针对于整个图表而言的，所以计划把选中的这个班级的成绩放在第一位，剩下的班级从大到小排列
      //todo 注意传入数据的顺序,最后一个数据显示在第一位
      state.examData.examCompareData = [

        {
          className: "高一13班",
          score: 300
        },
        {
          className: "高一12班",
          score: 400
        },
        {
          className: "高一10班",
          score: 600
        },
        {
          className: "高一二班",
          score: 700
        },
        //todo 注意最后一个数据显示在第一位
        {
          className: "高一3班",
          score: 500
        },
      ];
      //层叠条状data，该班不同分数段的同学的占比
      // 因为bizchart的高亮是针对于整个图表而言的，所以计划把选中的这个班级的成绩放在第一位，剩下的班级按序排列
      //todo 注意传入数据的顺序,最后一个数据显示在第一位
      const cdata = [
        {
          State: "高一1班",
          不及格: 30352,
          "60-80": 20439,
          "80-100": 10225
        },
        {
          State: "高一2班",
          不及格: 38253,
          "60-80": 42538,
          "80-100": 15757
        },
        {
          State: "高一4班",
          不及格: 51896,
          "60-80": 67358,
          "80-100": 18794
        },
        {
          State: "高一5班",
          不及格: 72083,
          "60-80": 85640,
          "80-100": 22153
        },
        {
          State: "高一3班",
          不及格: 25635,
          "60-80": 1890,
          "80-100": 9314
        },
      ];
      const cds = new DataSet();
      const cdv = cds.createView().source(cdata);
      cdv.transform({
        type: "fold",
        fields: ["不及格", "60-80", "80-100"],
        // 展开字段集
        key: "分数段",
        // key字段
        value: "人数",
        // value字段
        retains: ["State"] // 保留字段集，默认为除fields以外的所有字段
      });
      state.examData.examDistributeData = cdv;

      return {
        ...state,
      };
    },
    //todo 某一场exam信息的赋值
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
      state.courseRankData = rankData;
      return {
        ...state,
        courseRankData: {
          totalRank,
          classNum,
          rankData
        },
        scoreData,
        classMap
      };
    },

    // todo 最近一次考试的学生排名情况
    saveStudentsList(state, action) {
      return {
        ...state,
        studentsList: [
          {
            index: 1,
            name: "李四",
            count: 678,
            chinese: 125,
            math: 110,
            english: 134,
            physical: 98,
            chemistry: 88,
            biological: 77,
            political: 33,
            history: 89,
            geography: 66,
            technology: 98
          },
          {
            index: 2,
            name: "张三",
            count: 678,
            chinese: 125,
            math: 110,
            english: 134,
            physical: 98,
            chemistry: 88,
            biological: 77,
            political: 33,
            history: 89,
            geography: 66,
            technology: 98
          }
        ],
      };
    },

    // todo 该班对应的考试列表
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
