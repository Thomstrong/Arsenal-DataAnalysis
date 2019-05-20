import React, { Fragment, PureComponent, Suspense } from 'react';
import { connect } from 'dva';
import { POLICY_TYPE_ALIAS, SCORE_LEVEL_ALIAS, SCORE_TYPE_ALIAS, SEX_MAP } from "@/constants";
import router from 'umi/router';
import _ from 'lodash';
import PageLoading from '@/components/PageLoading';
import {
  Affix,
  Avatar,
  BackTop,
  Card,
  Col,
  DatePicker,
  Divider,
  Empty,
  Icon,
  message,
  Row,
  Select,
  Spin,
  Switch,
  Tabs,
  Tag
} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import TagCloud from '@/components/Charts/TagCloud';
import styles from './Center.less';
import { Axis, Chart, Coord, Geom, Legend, Tooltip } from "bizcharts";
import DataSet from "@antv/data-set";
import moment from "moment";
import Link from 'umi/link';
import imgUrl from '../../../../public/tagcloud/light.jpeg';
import stuImg from '../../../../public/tagcloud/Rectangular.jpeg';

const ScoreLineChart = React.lazy(() => import('./ScoreLineChart'));
const ConsumptionOverallLineChart = React.lazy(() => import('./ConsumptionOverallLineChart'));
const ConsumptionTimeSlotLineChart = React.lazy(() => import('./ConsumptionTimeSlotLineChart'));
const AttendanceChart = React.lazy(() => import('./AttendanceChart'));
const StuComparedChart = React.lazy(() => import('./StuComparedChart'));

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const initEmpty = <Empty description='请在左侧搜索框中搜索学生信息'/>;

@connect(({ loading, student, global }) => ({
  studentList: student.studentList,
  vsStudentList: student.vsStudentList,
  studentInfo: student.studentInfo,
  vsStudentInfo: student.vsStudentInfo,
  gradeVsData: student.gradeVsData,
  termList: student.termList,
  termMap: global.termMap,
  wordCloudMap: global.wordCloudMap,
  totalHourlyAvgCost: global.totalHourlyAvgCost,
  dailyPredictData: student.dailyPredictData,
  hourlyCost: student.hourlyCost,
  costVsData: student.costVsData,
  kaoqinVsData: student.kaoqinVsData,
  vsDailySumCost: student.vsDailySumCost,
  wordCloudData: student.wordCloudData,
  vsWordCloudData: student.vsWordCloudData,
  loading: loading.effects['student/fetchBasic'] && loading.effects['student/fetchWordCloudData'],
  kaoqinLoading: loading.effects['student/fetchKaoqinData'],
  hourlyAvgCost: student.hourlyAvgCost,
  dailySumCost: student.dailySumCost,
  dailyAvg: student.dailyAvg,
  dailyAvgRank: student.dailyAvgRank,
  studentListLoading: loading.effects['student/fetchStudentList'],
  vsStudentListLoading: loading.effects['student/fetchVsStudentList'],
  costLoading: loading.effects['student/fetchHourlyAvgCost'],
  scoreLoading: loading.effects['student/fetchTotalTrend'] && loading.effects['student/fetchSubTrends'],
  eCardLoading: loading.effects['student/fetchDailySumCost'] && loading.effects['student/fetchDailyPredictData'],
}))
class Center extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      studentId: props.match.params.studentId || props.studentInfo.id || '',
      vsStudentId: '',
      scoreType: 'score',
      dateRange: 7,
      pickedDate: '2019-01-01',
      excludePingshi: false,
    };
    this.getStudentList = _.debounce(this.getStudentList, 800);
  }

  componentDidMount() {
    const { studentInfo } = this.props;
    const { query } = this.props.location;
    if (query && query.studentId && Number(query.studentId) !== studentInfo.id) {
      this.getStudentList(query.studentId);
      this.getStudentInfo(query.studentId);
    }
  }

  onTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'Score':
        router.push(`${match.path}/Score`);
        break;
      case 'ECard':
        router.push(`${match.path}/ECard`);
        break;
      case 'Attendance':
        router.push(`${match.path}/Attendance`);
        break;
      case 'Compare':
        router.push(`${match.path}/Compare`);
        break;
      default:
        break;
    }
  };

  getCompareInfo = (vsStudentId, studentId) => {
    if (vsStudentId === studentId) {
      message.warning('同一个学生对比可没有意义哦～😅', 5);
      this.setState({
        vsStudentId: ''
      });
      return;
    }

    const { dispatch } = this.props;
    dispatch({
      type: 'student/fetchGradeCompare',
      payload: {
        studentId: studentId,
        compareId: vsStudentId,
      }
    });

    dispatch({
      type: 'student/fetchKaoqinVsData',
      payload: {
        studentId: studentId,
        compareId: vsStudentId,
      }
    });

    if (vsStudentId === this.props.vsStudentInfo.id) {
      return;
    }
    dispatch({
      type: `student/fetchVsBasic`,
      payload: {
        studentId: vsStudentId
      }
    });

    dispatch({
      type: 'student/fetchVsWordCloudData',
      payload: {
        studentId: vsStudentId,
        wordCloudMap: this.props.wordCloudMap
      }
    });

    dispatch({
      type: 'student/fetchCostCompare',
      payload: {
        studentId: vsStudentId,
      }
    });
    dispatch({
      type: 'student/fetchVsDailySumCost',
      payload: {
        studentId: vsStudentId,
      }
    });
  };

  getStudentInfo = (studentId) => {
    if (studentId === this.props.studentInfo.id) {
      return;
    }
    const { dispatch, totalHourlyAvgCost, vsStudentInfo } = this.props;
    dispatch({
      type: `student/fetchBasic`,
      payload: {
        studentId: studentId
      }
    });
    dispatch({
      type: 'student/fetchRadarData',
      payload: {
        studentId: studentId,
      }
    });
    dispatch({
      type: 'student/fetchTotalTrend',
      payload: {
        studentId: studentId,
        scoreType: this.state.scoreType
      }
    });

    dispatch({
      type: 'student/fetchSubTrends',
      payload: {
        studentId: studentId,
        scoreType: this.state.scoreType
      }
    });

    dispatch({
      type: 'student/fetchTeacher',
      payload: {
        studentId: studentId,
      }
    });

    dispatch({
      type: 'student/fetchWordCloudData',
      payload: {
        studentId: studentId,
        wordCloudMap: this.props.wordCloudMap
      }
    });

    dispatch({
      type: 'student/fetchKaoqinData',
      payload: {
        studentId: studentId,
        termMap: this.props.termMap
      }
    });

    if (!totalHourlyAvgCost.length) {
      dispatch({
        type: 'global/fetchTotalHourlyAvgCost',
      });
    }

    dispatch({
      type: 'student/fetchHourlyAvgCost',
      payload: {
        studentId: studentId,
      }
    });
    dispatch({
      type: 'student/fetchDailySumCost',
      payload: {
        studentId: studentId,
      }
    });
    dispatch({
      type: 'student/fetchDailyPredictData',
      payload: {
        studentId: studentId,
        dateRange: this.state.dateRange,
        date: this.state.pickedDate,
      }
    });
    dispatch({
      type: 'student/fetchHourlyCost',
      payload: {
        studentId: studentId,
        date: this.state.pickedDate,
        dateRange: this.state.dateRange
      }
    });

    if (vsStudentInfo.id) {
      if (vsStudentInfo.id === studentId) {
        dispatch({
          type: 'student/clearCompareData',
        });
        this.setState({
          vsStudentId: ''
        });

        return;
      }
      this.getCompareInfo(vsStudentInfo.id, studentId);
    }
  };

  getStudentList = (input, type = '') => {
    if (!input) {
      return;
    }
    const { dispatch } = this.props;
    if (type === 'compare') {
      dispatch({
        type: 'student/fetchVsStudentList',
        payload: {
          query: input
        }
      });
      return;
    }

    dispatch({
      type: 'student/fetchStudentList',
      payload: {
        query: input
      }
    });
  };

  formatKaoqinData = (kaoqinData, termList) => {
    if (!kaoqinData.length) {
      return [];
    }
    const data = new DataSet.View().source(kaoqinData).transform({
      type: "fold",
      fields: termList,
      key: "term",
      value: "count"
    }).transform({
      type: 'filter',
      callback(row) {
        return row.count;
      }
    });
    data.rows.sort((a, b) => {
      return (b.term > a.term) ? -1 : 1;
    });
    return data;
  };

  onScoreTypeChange = (scoreType) => {
    if (!scoreType) {
      return;
    }
    const { dispatch, studentInfo } = this.props;
    const studentId = studentInfo.id;
    dispatch({
      type: 'student/fetchTotalTrend',
      payload: {
        studentId: studentId,
        scoreType: scoreType
      }
    });
    dispatch({
      type: 'student/fetchSubTrends',
      payload: {
        studentId: studentId,
        scoreType: scoreType
      }
    });
    this.setState({ scoreType });
  };

  onDateChange = (pickedDate) => {
    if (!pickedDate) {
      return;
    }
    const { dispatch, studentInfo } = this.props;
    dispatch({
      type: 'student/fetchDailyPredictData',
      payload: {
        studentId: studentInfo.id,
        dateRange: this.state.dateRange,
        date: pickedDate,
      }
    });
    dispatch({
      type: 'student/fetchHourlyCost',
      payload: {
        studentId: studentInfo.id,
        dateRange: this.state.dateRange,
        date: pickedDate,
      }
    });
    this.setState({ pickedDate });
  };

  handleChangeRange = (dateRange) => {
    if (!dateRange) {
      return;
    }
    const { dispatch, studentInfo } = this.props;
    dispatch({
      type: 'student/fetchDailyPredictData',
      payload: {
        studentId: studentInfo.id,
        dateRange: dateRange,
        date: this.state.pickedDate,
      }
    });
    dispatch({
      type: 'student/fetchHourlyCost',
      payload: {
        studentId: studentInfo.id,
        dateRange: dateRange,
        date: this.state.pickedDate,
      }
    });
    this.setState({ dateRange });
  };

  formatDailyPredictData = (dailyPredictData) => {
    const { lastCycleData, thisCycleData, dateRange } = dailyPredictData;
    const mergedData = new DataSet.View().source(lastCycleData.concat(thisCycleData)).transform({
      type: 'partition',
      groupBy: ['offset'],
      orderBy: ['offset']
    }).rows;
    const formatedData = [];
    let maxCost = 0;
    for (let offset = 0; offset <= dateRange; offset++) {
      const key = `_${offset}`;
      let data = {
        offset: Number(offset),
        last: 0,
        now: 0,
        future: 0,
      };
      if (!mergedData[key]) {
        formatedData.push(data);
        continue;
      }

      for (let item of mergedData[key]) {
        data = {
          ...data,
          ...item
        };
      }
      const nowCost = Number(data.now);
      const lastCost = Number(data.last);
      data.future = Number((0.1 * (nowCost - lastCost) + (lastCost + nowCost) / 2).toFixed(2));
      maxCost = maxCost > data.future ? maxCost : data.future;
      maxCost = maxCost > data.now ? maxCost : data.now;
      maxCost = maxCost > data.last ? maxCost : data.last;
      formatedData.push(data);
    }
    return {
      formatedData,
      maxCost
    };
  };

  formatHourlyAvgCost = (hourlyAvgCost, totalHourlyAvgCost) => {
    if (!hourlyAvgCost.length && !totalHourlyAvgCost.length) {
      return {
        hourlyAvgData: [],
        maxHourlyAvg: 0
      };
    }
    let i = 0;
    let j = 0;
    const hourlyAvgData = [];
    let maxHourlyAvg = 0;
    for (let hour = 0; hour < 24; hour++) {
      const data = {
        hour,
        avg_cost: 0,
        total_avg: 0,
      };
      if (i < hourlyAvgCost.length && hourlyAvgCost[i].hour === hour) {
        data.avg_cost = Number(hourlyAvgCost[i].avg_cost.toFixed(2));
        maxHourlyAvg = data.avg_cost > maxHourlyAvg ? data.avg_cost : maxHourlyAvg;
        i++;
      }
      if (j < totalHourlyAvgCost.length && totalHourlyAvgCost[j].hour === hour) {
        data.total_avg = Number(totalHourlyAvgCost[j].total_avg.toFixed(2));
        maxHourlyAvg = data.total_avg > maxHourlyAvg ? data.total_avg : maxHourlyAvg;
        j++;
      }
      hourlyAvgData.push(data);
    }
    return {
      hourlyAvgData,
      maxHourlyAvg
    };
  };

  mergeDailyCost = (dailyCost, vsDailyCost) => {
    const mergedData = [];
    let i = 0;

    for (let data of vsDailyCost) {
      while (i < dailyCost.length && dailyCost[i].date < data.date) {
        mergedData.push({
          x: Date.parse(dailyCost[i].date),
          y1: dailyCost[i].total,
          y2: 0,
        });
        i++;
      }

      if (i < dailyCost.length && data.date === dailyCost[i].date) {
        mergedData.push({
          x: Date.parse(data.date),
          y1: dailyCost[i].total,
          y2: data.total,
        });
        i++;
        continue;
      }
      mergedData.push({
        x: Date.parse(data.date),
        y1: 0,
        y2: data.total,
      });
    }

    while (i < dailyCost.length) {
      mergedData.push({
        x: Date.parse(dailyCost[i].date),
        y1: dailyCost[i].total,
        y2: 0,
      });
      i++;
    }

    return {
      vsDailyCostData: mergedData,
    };
  };

  onTypeSwitchChanged = (checked) => {
    this.setState({
      excludePingshi: checked
    });
  };

  render() {
    const {
      studentInfo,
      vsStudentInfo,
      wordCloudData,
      vsWordCloudData,
      studentList,
      vsStudentList,
      studentListLoading,
      vsStudentListLoading,
      termList,
      gradeVsData,
      totalHourlyAvgCost,
      dailyPredictData,
      hourlyCost,
      costVsData,
      vsDailySumCost,
      hourlyAvgCost,
      dailySumCost,
      dailyAvg,
      dailyAvgRank,
      loading,
      match,
      kaoqinVsData,
      location,
      kaoqinLoading,
      eCardLoading,
      scoreLoading
    } = this.props;
    const { dateRange, date } = dailyPredictData;
    const { hourlyAvgData, maxHourlyAvg } = this.formatHourlyAvgCost(hourlyAvgCost, totalHourlyAvgCost);
    const { hourlyAvgData: vsAverageData } = this.formatHourlyAvgCost(hourlyAvgCost, costVsData);
    const { formatedData: predictData, maxCost } = this.formatDailyPredictData(dailyPredictData);
    const { vsDailyCostData } = this.mergeDailyCost(dailySumCost || [], vsDailySumCost || []);
    const teacherInfo = studentInfo.teacherInfo;
    const cols = {
      score: {
        min: 0,
        max: 100
      }
    };
    //成绩相关,linedata表示总成绩,subData表示每个学科的成绩列表
    const totalTrendData = studentInfo ? studentInfo.totalTrend : [];
    const lineSummary = studentInfo ? studentInfo.lineSummary : {};
    //考勤的相关数据
    const kaoqinData = this.formatKaoqinData(studentInfo.kaoqinData, termList);
    const kaoqinSummary = studentInfo.kaoqinSummary;
    // 一卡通对比数据1 0-23小时的平均消费
    const hourlyVsCostData = vsAverageData.length ? new DataSet.View().source(vsAverageData).transform({
      type: 'map',
      callback(row) {
        const newRow = { ...row };
        newRow[`${vsStudentInfo.id}-${vsStudentInfo.name}`] = row.total_avg;
        newRow[`${studentInfo.id}-${studentInfo.name}`] = row.avg_cost;
        return newRow;
      },
    }).transform({
      type: "fold",
      fields: [`${studentInfo.id}-${studentInfo.name}`, `${vsStudentInfo.id}-${vsStudentInfo.name}`],
      key: "student",
      value: "cost"
    }).rows : [];

    const defaultTab = _.difference(location.pathname.split('/'), match.path.split('/'))[0] || 'Score';
    return (
      <GridContent>
        <BackTop/>
        <Row gutter={16}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }} loading={loading}>
              <Affix offsetTop={10} style={{ 'zIndex': 1 }}>
                <Select
                  style={{ width: '100%', display: 'block' }}
                  showSearch
                  notFoundContent={studentListLoading ? <Spin size="small"/> :
                    <Empty description={this.state.studentId ? '未找到包含该信息学生数据' : '请输入学生姓名或学号查询'}/>
                  }
                  loading={studentListLoading}
                  size="large"
                  value={studentInfo.id || this.state.studentId}
                  filterOption={false}
                  onSearch={(value) => this.getStudentList(value)}
                  onChange={(studentId) => this.setState({ studentId })}
                >
                  {studentList.map((student) => (
                    <Option
                      onClick={(value) => this.getStudentInfo(value.key)}
                      value={student.id}
                      key={`student-${student.id}`}
                    >
                      {`${student.id}-${student.name}`}
                    </Option>
                  ))}
                </Select>
              </Affix>
              {studentInfo && studentInfo.id ? (
                <Fragment>
                  <Divider style={{ marginTop: 16 }} dashed/>
                  <div className={styles.avatarHolder}>
                    {/*词云*/}
                    <TagCloud
                      repeat={true}
                      data={wordCloudData}
                      height={120}
                      radio={2.8}
                      imgUrl={stuImg}
                    />
                    <div className={styles.name} style={{ paddingTop: 7 }}>{studentInfo.name}</div>
                    {studentInfo.is_left ? <Tag style={{ cursor: "default" }} color="#f50">已离校</Tag> :
                      <Tag style={{ cursor: "default" }} color="#2db7f5">在校生</Tag>}
                  </div>
                  <Row type="flex" align="middle">
                    {/*学生详细信息*/}
                    <Col md={12} lg={24} sm={12} xs={12} xl={24}>
                      <div className={styles.detail}>
                        <p><i className={`fa fa-group ${styles.iconStyle}`}/>
                          {studentInfo.nation}
                        </p>
                        <p><i className={`fa fa fa-archive ${styles.iconStyle}`}/>
                          {POLICY_TYPE_ALIAS[studentInfo.policy]}
                        </p>
                        <p><i className={`fa fa-birthday-cake ${styles.iconStyle}`}/>
                          {studentInfo.born_year > 0 ? studentInfo.born_year : '未知'} 年
                        </p>
                        <p><i className={`fa fa-home ${styles.iconStyle}`}/>
                          {studentInfo.native_place}
                        </p>
                        <p><i className={`fa ${studentInfo.sex === 1 ? 'fa-male' : 'fa-female'} ${styles.iconStyle}`}/>
                          {SEX_MAP[studentInfo.sex]}
                        </p>
                        <p><i className={`fa fa-bed ${styles.iconStyle}`}/>
                          {studentInfo.is_stay_school ? `住校-${studentInfo.room_num}室` : '走读'}
                        </p>
                      </div>
                    </Col>
                    {/*雷达图*/}
                    {defaultTab !== 'Score' && !!studentInfo.radarData.length &&
                    <Col md={12} lg={24} sm={12} xs={12} xl={24}><Fragment>
                      <Chart
                        height={350}
                        data={studentInfo.radarData}
                        padding={[20, 20, 95, 20]}
                        scale={cols}
                        forceFit
                        loading={loading}
                      >
                        <Coord type="polar" radius={0.8}/>
                        <Axis
                          name="item"
                          line={null}
                          tickLine={null}
                          grid={{
                            lineStyle: {
                              lineDash: null
                            },
                            hideFirstLine: false
                          }}
                        />
                        <Tooltip/>
                        <Axis
                          name="score"
                          line={null}
                          label={null}
                          tickLine={null}
                          grid={{
                            type: "polygon",
                            lineStyle: {
                              lineDash: null
                            },
                            alternateColor: "rgba(0, 0, 0, 0.04)"
                          }}
                        />
                        <Legend name="user" marker="circle" offset={30}/>
                        <Geom type="line" position="item*score" color="user" size={2}/>
                        <Geom
                          type="point"
                          position="item*score"
                          color="user"
                          shape="circle"
                          size={4}
                          style={{
                            stroke: "#fff",
                            lineWidth: 1,
                            fillOpacity: 1
                          }}
                        />
                      </Chart>
                    </Fragment></Col>}
                  </Row>
                  <Divider style={{ marginTop: 16 }} dashed/>
                  {/*老师信息*/}
                  <div className={styles.stuClass}>
                    <div className={styles.stuClassTitle}>班级信息</div>
                    <Link className={styles.stuClassInfo} to={`/class/analysis/?classId=${studentInfo.stu_class.id}`}>
                      {`${studentInfo.stu_class.start_year}年-${studentInfo.stu_class.class_name}`}
                    </Link>
                    <Row gutter={8}>
                      {teacherInfo.map(item => (
                        <Col className={styles.stuClassTeacher} key={item.id} md={6} lg={20} sm={6} xs={6} xl={10}>
                          <Avatar
                            style={{ backgroundColor: item.color }}
                            size={26}
                          >
                            <b>{item.courseName}</b>
                          </Avatar>
                          {item.name}
                        </Col>
                      ))}
                    </Row>
                  </div>
                </Fragment>
              ) : <Empty style={{ margin: '10px auto' }} description='请在👆搜索框中搜索学生信息！'/>}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
            >
              <Tabs defaultActiveKey={defaultTab} onChange={this.onTabChange}>
                <TabPane tab={<span><Icon type="line-chart"/>成绩</span>} key="Score">
                  {studentInfo && !!studentInfo.id && <Row type='flex' justify='start'>
                    <Affix offsetTop={13} style={{ 'zIndex': 2 }}>
                      <Select
                        value={studentInfo.scoreType || this.state.scoreType} style={{ width: 120 }}
                        onChange={this.onScoreTypeChange}
                      >
                        {Object.keys(SCORE_TYPE_ALIAS).map(type => <Option key={type}
                                                                           value={type}>{SCORE_TYPE_ALIAS[type]}</Option>)}
                      </Select>
                      <Divider style={{margin: '0 15px',height: '20px'}} type="vertical"/>
                      <span style={{ verticalAlign: 'middle', marginRight: '10px' }}>{'不看平时成绩'}</span>
                      <Switch
                        style={{ verticalAlign: 'middle' }}
                        defaultChecked={this.state.excludePingshi}
                        onChange={this.onTypeSwitchChanged}
                      />
                    </Affix>
                  </Row>}
                  {studentInfo && studentInfo.id ?
                    <Fragment>
                      {totalTrendData && !!totalTrendData.length ? <Suspense fallback={<PageLoading/>}>
                          <ScoreLineChart
                            lineData={totalTrendData}
                            lineSummary={lineSummary}
                            radarViewData={studentInfo.radarData}
                            subData={studentInfo.subTrends}
                            scoreType={this.state.scoreType}
                            excludePingshi={this.state.excludePingshi}
                          />
                        </Suspense> :
                        <Empty description={`暂无${SCORE_TYPE_ALIAS[studentInfo.scoreType || this.state.scoreType]}数据`}/>}
                    </Fragment> : initEmpty
                  }
                </TabPane>
                <TabPane tab={<span><Icon type="credit-card"/>一卡通</span>} key="ECard">
                  {!!studentInfo.id ? (dailySumCost && !!dailySumCost.length ? eCardLoading ?
                    <Card loading={true} bordered={false}/> :
                    <Fragment>
                      <Suspense fallback={<PageLoading/>}>
                        <ConsumptionOverallLineChart
                          hourlyAvgCost={hourlyAvgData}
                          dailySumCost={dailySumCost}
                          dailyAvg={dailyAvg}
                          dailyAvgRank={dailyAvgRank}
                          maxHourlyAvg={maxHourlyAvg}
                        />
                      </Suspense>
                      <Card
                        bodyStyle={{
                          paddingTop: '8px'
                        }}
                        title={`${date} 各时期消费情况一览`}
                        bordered={false}
                        style={{ width: '100%' }}
                      >
                        <Affix offsetTop={13} style={{ 'zIndex': 1, marginTop: 10 }}>
                          <span>选择查看的时间：</span>
                          <DatePicker
                            defaultValue={moment(moment(date || '2019-01-01'), 'YYYY-MM-DD')}
                            onChange={(_, date) => this.onDateChange(date)}
                          />
                          <span style={{ marginLeft: '20px' }}>分析周期：</span>
                          <Select
                            value={dateRange || this.state.dateRange} style={{ width: 120 }}
                            onChange={this.handleChangeRange}
                          >
                            <Option key='one-week' value={7}>1周</Option>
                            <Option key='one-month' value={30}>1个月</Option>
                            <Option key='three-month' value={90}>3个月</Option>
                            <Option key='six-month' value={180}>6个月</Option>
                            <Option key='one-year' value={365}>1年</Option>
                          </Select>
                        </Affix>
                        <Suspense fallback={<PageLoading/>}>
                          <ConsumptionTimeSlotLineChart
                            hourlyCost={hourlyCost}
                            dailyPredictData={predictData}
                            maxCost={maxCost}
                            date={dailyPredictData.date}
                            dateRange={dailyPredictData.dateRange}
                          />
                        </Suspense>
                      </Card>
                    </Fragment> : <Empty description='暂无一卡通消费数据'/>) : initEmpty}
                </TabPane>
                <TabPane tab={<span><i className={`fa fa-calendar-check-o`}/> 考勤</span>} key="Attendance">
                  {!!studentInfo.id ? <Suspense fallback={<PageLoading/>}>
                    <AttendanceChart
                      loading={kaoqinLoading}
                      kaoqinData={kaoqinData}
                      termList={termList}
                      kaoqinSummary={kaoqinSummary}
                    />
                  </Suspense> : initEmpty}
                </TabPane>
                <TabPane tab={<span><i className="fa fa-window-restore"/> 对比分析</span>} key="Compare">
                  {!!studentInfo.id && <Affix offsetTop={10} style={{ 'zIndex': 1 }}>
                    <Select
                      style={{ width: '100%', display: 'block' }}
                      showSearch
                      notFoundContent={vsStudentListLoading ? <Spin size="small"/> :
                        <Empty description={this.state.vsStudentId ? '未找到包含该信息的学生' : '请输入学生姓名或学号查询'}/>
                      }
                      size="large"
                      value={vsStudentInfo.id || this.state.vsStudentId}
                      filterOption={false}
                      onSearch={(value) => this.getStudentList(value, 'compare')}
                      onChange={(vsStudentId) => this.setState({ vsStudentId })}
                    >
                      {vsStudentList.map((student) => (
                        <Option
                          onClick={(value) => this.getCompareInfo(value.key, studentInfo.id)}
                          value={student.id}
                          key={`vsStudent-${student.id}`}
                        >
                          {`${student.id}-${student.name}`}
                        </Option>
                      ))}
                    </Select>
                  </Affix>}
                  {studentInfo.id ? (vsStudentInfo.id ?
                    <Fragment>
                      <Card
                        title="基本信息对比"
                        bordered={false}
                        style={{ width: '100%' }}
                        bodyStyle={{ paddingLeft: 0 }}
                      >
                        <Row type="flex" align="middle">
                          <Col span={10}>
                            <TagCloud
                              repeat={true}
                              data={vsWordCloudData}
                              height={380}
                              radio={0.8}
                              imgUrl={imgUrl}
                            />
                          </Col>
                          <Col span={13} offset={1}>
                            <Card
                              title={<Fragment>
                                <span
                                  style={{ fontSize: '20px', verticalAlign: 'middle' }}
                                >
                                  {vsStudentInfo.name}
                                  </span>
                                {vsStudentInfo.is_left ?
                                  <Tag style={{ marginLeft: '10px', cursor: 'default' }} color="#f50">已离校</Tag> :
                                  <Tag style={{ marginLeft: '10px', cursor: 'default' }} color="#4ac46a">在校生</Tag>}
                              </Fragment>}
                              headStyle={{ minHeight: '20px' }}
                              style={{ cursor: 'default', marginLeft: '25px' }}
                              bordered={false}
                              hoverable={true}
                              className={styles.vsDetail}
                            >
                              <p><i className={`fa fa-group ${styles.iconStyle}`}/>
                                {vsStudentInfo.nation}
                              </p>
                              <p><i className={`fa fa fa-archive ${styles.iconStyle}`}/>
                                {POLICY_TYPE_ALIAS[vsStudentInfo.policy]}
                              </p>
                              <p><i className={`fa fa-birthday-cake ${styles.iconStyle}`}/>
                                {vsStudentInfo.born_year > 0 ? vsStudentInfo.born_year : '未知'} 年
                              </p>
                              <p><i className={`fa fa-home ${styles.iconStyle}`}/>
                                {vsStudentInfo.native_place}
                              </p>
                              <p><i
                                className={`fa ${vsStudentInfo.sex === 1 ? 'fa-male' : 'fa-female'} ${styles.iconStyle}`}/>
                                {SEX_MAP[vsStudentInfo.sex]}
                              </p>
                              <p><i className={`fa fa-book ${styles.iconStyle}`}/>
                                {`${vsStudentInfo.stu_class.start_year}年-${vsStudentInfo.stu_class.class_name}`}
                              </p>
                              <p><i className={`fa fa-bed ${styles.iconStyle}`}/>
                                {vsStudentInfo.is_stay_school ? `住校-${vsStudentInfo.room_num}室` : '走读'}
                              </p>
                            </Card>
                          </Col>
                        </Row>
                      </Card>
                      <Suspense fallback={<PageLoading/>}>
                        <StuComparedChart
                          comparedScoreData={gradeVsData}
                          hourlyVsCostData={hourlyVsCostData}
                          vsDailyCostData={{
                            data: vsDailyCostData,
                            titleMap: {
                              y1: `${studentInfo.id}-${studentInfo.name}`,
                              y2: `${vsStudentInfo.id}-${vsStudentInfo.name}`,
                            }
                          }}
                          kaoqinVsData={kaoqinVsData}
                          colorMap={{
                            [`${studentInfo.id}-${studentInfo.name}`]: '#3898ff',
                            [`${vsStudentInfo.id}-${vsStudentInfo.name}`]: '#4ac46a',
                          }}
                        />
                      </Suspense>
                    </Fragment> : <Empty description={this.state.vsStudentId ? '未找到包含该信息数据' : '请输入待比对学生姓名或学号'}/>) :
                    initEmpty}
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default Center;

