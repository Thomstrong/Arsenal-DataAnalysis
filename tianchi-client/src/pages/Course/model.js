/**
 * Created by 胡晓慧 on 2019/4/12.
 */

import { getClassExamData, getCollageMajorSubject, getCourseSelectionDistribution } from '@/services/api';
import { COURSE_ALIAS, COURSE_FULLNAME_ALIAS, SEX_MAP } from "@/constants";
import DataSet from "@antv/data-set";

export default {
  namespace: 'course',

  state: {
    distributions: [],
    coursePercents: [],
    coursePercentYear: 0,
    arcCourse: {},
    detailDistribution: [],
    courseSelectionTree: {},
    courseSelectionPie: [],
    courseSelectionPieOther: [],
    pieOtherOffsetAngle: 0,
    pieTreeYear: 0,
    pieSum: 0,
    totalStudents: 0,
    classExamData: {
      highest: [],
      lowest: [],
      average: [],
    },
    classExamSummary: {},
    loading: false,
    subjectYear: 0,
    subjectGrade: 0,
    subjectCourse: 0,
    subject2Major: null,
    majorMap: {},
    collage2Subject: [],
    totalMajor: 0
  },

  effects: {
    * fetchSelectionDistribution(_, { call, put }) {
      const response = yield call(getCourseSelectionDistribution, {
        type: 'selection'
      });
      yield put({
        type: 'saveDistribution',
        payload: response
      });
    },
    * fetchCoursePercents({ payload }, { call, put }) {
      const response = yield call(getCourseSelectionDistribution, {
        ...payload,
        type: 'course_percent'
      });
      yield put({
        type: 'saveCoursePercents',
        payload: response,
        year: payload.year,
      });
    },
    * fetchClassExamData({ payload }, { call, put }) {
      const response = yield call(getClassExamData, payload);
      yield put({
        type: 'saveClassExamData',
        payload: response,
        ...payload
      });
    },
    * fetchArcCourse({ payload }, { call, put }) {
      const response = yield call(getCourseSelectionDistribution, {
        ...payload,
        type: 'arc_count'
      });
      yield put({
        type: 'saveArcCourse',
        payload: response
      });
    },
    * fetchDetailDistribution(_, { call, put }) {
      const response = yield call(getCourseSelectionDistribution, {
        type: '3_in_7'
      });
      yield put({
        type: 'saveDetailDistribution',
        payload: response
      });
    },
    * fetchDetailPercent({ payload }, { call, put }) {
      const response = yield call(getCourseSelectionDistribution, {
        ...payload,
        type: 'pie_and_tree'
      });
      yield put({
        type: 'saveDetailPercent',
        payload: response,
        year: payload.year,
      });
    },
    * fetchSubject2Major(_, { call, put }) {
      const response = yield call(getCollageMajorSubject, {
        type: 'tagCloud'
      });
      yield put({
        type: 'saveSubject2Major',
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
        coursePercentYear: action.year
      };
    },
    saveClassExamData(state, { payload, startYear, grade, course }) {
      if (!payload) {
        return state;
      }
      const classExamData = {
        highest: [],
        lowest: [],
        average: [],
      };
      const classExamSummary = {
        highestClass: "",
        highestExam: "",
        highestScore: 0,
        averageHighClass: "",
        averageHighExam: "",
        averageHighScore: 0,
        averageLowClass: "",
        averageLowExam: "",
        averageLowScore: 150,
        lowestClass: "",
        lowestExam: "",
        lowestScore: 150,
      };

      for (let data of payload) {
        const baseInfo = {
          stuClass: data.stu_class,
          exam: data.exam_name
        };
        const average = Number((data.total_score / data.attend_count).toFixed(0));
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
          score: average
        });
        if (data.highest_score > classExamSummary.highestScore) {
          classExamSummary.highestScore = data.highest_score;
          classExamSummary.highestClass = data.stu_class;
          classExamSummary.highestExam = data.exam_name;
        }
        if (average > classExamSummary.averageHighScore) {
          classExamSummary.averageHighScore = average;
          classExamSummary.averageHighClass = data.stu_class;
          classExamSummary.averageHighExam = data.exam_name;
        }
        if (average < classExamSummary.averageLowScore) {
          classExamSummary.averageLowScore = average;
          classExamSummary.averageLowClass = data.stu_class;
          classExamSummary.averageLowExam = data.exam_name;
        }
        if (data.lowest_score < classExamSummary.lowestScore) {
          classExamSummary.lowestScore = data.lowest_score;
          classExamSummary.lowestClass = data.stu_class;
          classExamSummary.lowestExam = data.exam_name;
        }
      }
      return {
        ...state,
        classExamData,
        classExamSummary,
        subjectYear: startYear,
        subjectGrade: grade,
        subjectCourse: course,
      };
    },
    clear() {
      return {};
    },

    saveArcCourse(state, { payload }) {
      if (!payload) {
        return state;
      }
      const arcCourse = {
        nodes: payload.nodes.map(courseId => {
          return {
            id: courseId,
            name: COURSE_ALIAS[courseId]
          };
        }),
        edges: payload.edges
      };
      return {
        ...state,
        arcCourse
      };
    },
    saveDetailDistribution(state, { payload }) {
      if (!payload) {
        return state;
      }
      const detailDistribution = [];
      for (let data of payload) {
        const { year } = data;
        for (let selection in data.data) {
          const courses = selection.split('#').map(id => COURSE_ALIAS[id]).join('');
          detailDistribution.push({
            year: String(year),
            selection: courses,
            count: data.data[selection]
          });
        }
      }
      return {
        ...state,
        detailDistribution
      };
    },
    saveDetailPercent(state, { payload, year }) {
      if (!payload) {
        return state;
      }

      const { total, data } = payload;
      const sortedData = new DataSet.View().source(data).transform({
        type: 'sort-by',
        fields: ['value'], // 根据指定的字段集进行排序，与lodash的sortBy行为一致
        order: 'DESC'        // 默认为 ASC，DESC 则为逆序
      }).rows;
      let children = [];
      let courseSelectionPie = [];
      // other部分的数据
      let courseSelectionPieOther = [];
      let pieOtherSum = 0;
      let otherInOtherSum = 0;
      let otherInOtherCount = 0;
      for (let record of sortedData) {
        const selectionHash = record.courses;
        const courses = selectionHash.split('#').map(id => COURSE_ALIAS[id]).join('');
        const count = record.value;
        children.push({
          name: courses,
          value: count
        });
        const radio = count / total;
        if (radio < 0.02) {
          if (otherInOtherCount > 13 || radio < 0.01) {
            otherInOtherSum += count;
            pieOtherSum += count;
            continue;
          }
          courseSelectionPieOther.push({
            otherType: courses,
            value: count
          });
          otherInOtherCount += 1;
          pieOtherSum += count;
          continue;
        }
        courseSelectionPie.push({
          type: courses,
          value: count
        });
      }
      courseSelectionPie.push({
        type: '其他',
        value: pieOtherSum
      });
      courseSelectionPieOther.push({
        otherType: '其他',
        value: otherInOtherSum
      });

      //计算所有的数值和，以便求百分比
      const otherRatio = pieOtherSum / total; // 确定Other 的占比
      //  确定两条辅助线的位置
      const pieOtherOffsetAngle = otherRatio * Math.PI; // other 占的角度的一半

      const treeData = {
        name: "root",
        children
      };
      const dv = new DataSet.View().source(treeData, {
        type: "hierarchy"
      }).transform({
        field: "value",
        type: "hierarchy.treemap",
        tile: "treemapResquarify",
        as: ["x", "y"]
      });
      const courseSelectionTree = dv.getAllNodes();
      courseSelectionTree.map(node => {
        node.name = node.data.name;
        node.value = node.data.value;
        return node;
      });
      return {
        ...state,
        courseSelectionTree,
        courseSelectionPie,
        courseSelectionPieOther,
        pieOtherOffsetAngle,
        pieSum: total,
        pieTreeYear: year,
      };
    },

    saveSubject2Major(state, { payload }) {
      if (!payload) {
        return state;
      }
      const collage2Subject = payload.summary.map(data => {
        return {
          name: COURSE_FULLNAME_ALIAS[data.course_id],
          value: data.sum
        };
      });
      return {
        ...state,
        subject2Major: payload.data,
        majorMap: payload.tagMap,
        collage2Subject,
      };
    },

  },
};
