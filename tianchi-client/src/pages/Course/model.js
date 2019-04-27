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
    * fetchCourseSelectionPie({ payload }, { call, put }) {
      const response = yield call(getCourseSelectionDistribution, {
        ...payload,
        type: 'pie_data'
      });
      yield put({
        type: 'saveCourseSelectionPie',
        payload: response
      });
    }, * fetchCourseSelectionTree({ payload }, { call, put }) {
      const response = yield call(getCourseSelectionDistribution, {
        ...payload,
        type: 'polygon_tree'
      });
      yield put({
        type: 'saveCourseSelectionTree',
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
          const courses = selection.split('#').map(id => COURSE_ALIAS[id]);
          detailDistribution.push({
            year: String(year),
            selection: courses.join(''),
            count: data.data[selection]
          });
        }
      }
      return {
        ...state,
        detailDistribution
      };
    },
    saveCourseSelectionPie(state) {
      const courseSelectionPie = [
        {
          type: "分类一",
          value: 200
        },
        {
          type: "分类二",
          value: 18
        },
        {
          type: "分类三",
          value: 32
        },
        {
          type: "分类四",
          value: 15
        },
        {
          type: "Other",
          value: 10
        }
      ];
      // other部分的数据
      const courseSelectionPieOther = [
        {
          otherType: "Other1",
          value: 2
        },
        {
          otherType: "Other2",
          value: 3
        },
        {
          otherType: "Other3",
          value: 5
        },
        {
          otherType: "Other4",
          value: 2
        },
        {
          otherType: "Other5",
          value: 3
        }
      ];
      //计算所有的数值和，以便求百分比
      let pieSum = 0;
      courseSelectionPie.forEach(function (obj) {
        pieSum += obj.value;
      });
      //为什么要这么做呢只是为了获得other的大小，本可以用courseSelectionPie[-1].value但实际编码中报错，.value不存在
      let pieOtherSum = 0;
      courseSelectionPieOther.forEach(function (obj) {
        pieOtherSum += obj.value;
      });
      const otherRatio = pieOtherSum / pieSum; // 确定Other 的占比
      //  确定两条辅助线的位置
      const pieOtherOffsetAngle = otherRatio * Math.PI; // other 占的角度的一半

      return {
        ...state,
        courseSelectionPie,
        courseSelectionPieOther,
        pieOtherOffsetAngle,
        pieSum,
      };
    },
    saveCourseSelectionTree(state) {
      const data = {
        name: "root",
        children: [
          {
            name: "政史地",
            value: 560
          },
          {
            name: "理化生",
            value: 500
          },
          {
            name: "政史化",
            value: 150
          },
          {
            name: "分类 4",
            value: 140
          },
          {
            name: "分类 5",
            value: 115
          },
          {
            name: "分类 6",
            value: 95
          },
          {
            name: "分类 7",
            value: 90
          },
          {
            name: "分类 8",
            value: 75
          },
          {
            name: "分类 9",
            value: 98
          },
          {
            name: "分类 10",
            value: 60
          },
          {
            name: "分类 11",
            value: 45
          },
          {
            name: "分类 12",
            value: 40
          },
          {
            name: "分类 13",
            value: 40
          },
          {
            name: "分类 14",
            value: 35
          },
          {
            name: "分类 15",
            value: 40
          },
          {
            name: "分类 16",
            value: 40
          },
          {
            name: "分类 17",
            value: 40
          },
          {
            name: "分类 18",
            value: 30
          },
          {
            name: "分类 19",
            value: 28
          },
          {
            name: "分类 20",
            value: 16
          }
        ]
      };
      const dv = new DataSet.View().source(data, {
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
        courseSelectionTree
      };
    },

  },
};
