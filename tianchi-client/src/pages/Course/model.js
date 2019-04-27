/**
 * Created by 胡晓慧 on 2019/4/12.
 */

import { getClassExamData, getCourseSelectionDistribution } from '@/services/api';
import { COURSE_ALIAS, SEX_MAP } from "@/constants";
import DataSet from "@antv/data-set";

export default {
  namespace: 'course',

  state: {
    distributions: [],
    coursePercents: [],
    arcCourse: {},
    detailDistribution: [],
    courseSelectionTree: {},
    courseSelectionPie: [],
    courseSelectionPieOther: [],
    pieOtherOffsetAngle: 0,
    pieSum: 0,
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
    //todo 待修改payload表示选择的年份，与玉珏图的年份选择相同
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
        payload: response
      });
    }
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

    //  todo
    saveArcCourse(state, { payload }) {
      if (!payload) {
        return state;
      }
      //和弦图数据,sourceweight和targetweight相等，表示人数
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
    saveDetailPercent(state, { payload }) {
      if (!payload) {
        return state;
      }

      const { total, data } = payload;
      const tree_data = {
        name: "root",
        children: []
      };
      const courseSelectionPie = [];
      // other部分的数据
      const courseSelectionPieOther = [];
      let pieOtherSum = 0;
      for (let selectionHash in data) {
        const courses = selectionHash.split('#').map(id => COURSE_ALIAS[id]).join('');
        const count = data[selectionHash];
        tree_data.children.push({
          name: courses,
          value: count
        });

        if (count < 8) {
          courseSelectionPieOther.push({
            otherType: courses,
            value: count
          });
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

      //计算所有的数值和，以便求百分比
      const otherRatio = pieOtherSum / total; // 确定Other 的占比
      //  确定两条辅助线的位置
      const pieOtherOffsetAngle = otherRatio * Math.PI; // other 占的角度的一半


      const dv = new DataSet.View().source(tree_data, {
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
      };
    },

  },
};
