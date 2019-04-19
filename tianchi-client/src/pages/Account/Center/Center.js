import React, { Fragment, PureComponent, Suspense } from 'react';
import { connect } from 'dva';
import { POLICY_TYPE_ALIAS, SCORE_LEVEL_ALIAS, SEX_MAP } from "@/constants";
import router from 'umi/router';
import _ from 'lodash';
import { Affix, Avatar, Card, Col, DatePicker, Divider, Empty, Icon, Input, Row, Select, Spin, Tabs } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Center.less';
import { Axis, Chart, Coord, Geom, Legend, Shape, Tooltip } from "bizcharts";
import DataSet from "@antv/data-set";
import moment from "moment";

const ScoreLineChart = React.lazy(() => import('./ScoreLineChart'));
const WordCloud = React.lazy(() => import('./WordCloud'));
const ConsumptionOverallLineChart = React.lazy(() => import('./ConsumptionOverallLineChart'));
const ConsumptionTimeSlotLineChart = React.lazy(() => import('./ConsumptionTimeSlotLineChart'));
const AttendanceChart = React.lazy(() => import('./AttendanceChart'));
const StuComparedChart = React.lazy(() => import('./StuComparedChart'));


@connect(({ loading, student, global }) => ({
  studentList: student.studentList,
  studentInfo: student.studentInfo,
  termList: student.termList,
  termMap: global.termMap,
  wordCloudData: student.wordCloudData,
  loading: loading.effects['student/fetchBasic'] && loading.effects['student/fetchRadarData'],
  kaoqinLoading: loading.effects['student/fetchKaoqinData'],
  consumptionData: student.consumptionData,
  studentListLoading: loading.effects['student/fetchStudentList'],
  costLoading: loading.effects['student/fetchConsumptionData'],
}))
class Center extends PureComponent {
  constructor() {
    super();
    this.state = {
      studentId: '',
      scoreType: 'score',
    };
    this.getStudentList = _.debounce(this.getStudentList, 800);
  }

  onTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'Score':
        router.push(`${match.url}/Score`);
        break;
      case 'ECard':
        router.push(`${match.url}/ECard`);
        break;
      case 'Attendance':
        router.push(`${match.url}/Attendance`);
        break;
      case 'Compare':
        router.push(`${match.url}/Compare`);
        break;
      default:
        break;
    }
  };

  getStudentInfo = (studentId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'student/fetchBasic',
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
      type: 'student/fetchKaoqinData',
      payload: {
        studentId: studentId,
        termMap: this.props.termMap
      }
    });
  };

  getStudentList = (input) => {
    if (!input) {
      return;
    }
    const { dispatch } = this.props;
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

  handleComparedStuChange = (value) => {
    //todo
  };

  onDateChange = (dateString) => {
    const { dispatch, studentInfo } = this.props;
    dispatch({
      type: 'student/fetchConsumptionData',
      payload: {
        studentId: studentInfo.id,
        date: dateString
      }
    });
  };
  onScoreTypeChange = (scoreType) => {
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

  handleChangeTime = (value) => {
    console.log(`selected ${value}`);
  };

  render() {
    const {
      studentInfo,
      wordCloudData,
      studentList,
      studentListLoading,
      termList,
      consumptionData,
      loading,
      match,
      location,
      kaoqinLoading
    } = this.props;
    //雷达图的处理
    const radarViewData = new DataSet.View().source(studentInfo.radarData).transform({
      type: "fold",
      fields: Object.values(SCORE_LEVEL_ALIAS),
      key: "user",
      value: "score" // value字段
    });
    const teacherInfo = studentInfo.teacherInfo;
    const cols = {
      score: {
        min: 0,
        max: 100
      }
    };

    //词云的处理
    function getTextAttrs(cfg) {
      return _.assign(
        {},
        cfg.style,
        {
          fillOpacity: cfg.opacity,
          fontSize: cfg.origin._origin.size,
          rotate: cfg.origin._origin.rotate,
          text: cfg.origin._origin.text,
          textAlign: "center",
          fontFamily: cfg.origin._origin.font,
          fill: cfg.color,
          textBaseline: "Alphabetic"
        }
      );
    } // 给point注册一个词云的shape
    Shape.registerShape("point", "cloud", {
      drawShape(cfg, container) {
        const attrs = getTextAttrs(cfg);
        return container.addShape("text", {
          attrs: _.assign(attrs, {
            x: cfg.x,
            y: cfg.y
          })
        });
      }
    });
    const dv = new DataSet.View().source(wordCloudData);
    const range = dv.range("value");
    const min = range[0];
    const max = range[1];
    dv.transform({
      type: "tag-cloud",
      fields: ["x", "value"],
      size: [window.innerWidth, window.innerHeight],
      font: "Verdana",
      padding: 0,
      timeInterval: 5000,

      // max execute time
      rotate() {
        let random = ~~(Math.random() * 4) % 4;

        if (random === 2) {
          random = 0;
        }

        return random * 90; // 0, 90, 270
      },

      fontSize(d) {
        if (d.value) {
          const divisor = (max - min) !== 0 ? (max - min) : 1;
          return ((d.value - min) / divisor) * (20 - 6) + 6;
        }

        return 0;
      }
    });
    const scale = {
      x: {
        nice: false
      },
      y: {
        nice: false
      }
    };
    //tab相关
    const TabPane = Tabs.TabPane;
    //成绩相关,linedata表示总成绩,subData表示每个学科的成绩列表
    const linedata = studentInfo ? studentInfo.totalTrend : [];
    const subData = studentInfo ? new DataSet.View().source([studentInfo.subTrends]).transform({
      type: "fold",
      fields: Object.keys(studentInfo.subTrends),
      // 展开字段集
      key: "title",
      // key字段
      value: "lineData" // value字段
    }).rows : [];
    //呈现成绩信息的筛选
    const Option = Select.Option;

    //timelyconsumption数据
    const timelyConsumptionData = consumptionData.hourly || [];
    const dConCost = consumptionData.daily ? new DataSet.View().source(consumptionData.daily).transform({
      type: 'impute',
      field: 'cost',
      groupBy: ['time', 'diftime'],
      method: 'value',
      value: 0
    }) : [];
    //考勤的相关数据
    const kaoqinData = this.formatKaoqinData(studentInfo.kaoqinData, termList);
    const kaoqinSummary = studentInfo.kaoqinSummary;
    //成绩对比数据
    const comparedScoreData = [
      {
        label: "数学",
        series1: 80,
        series2: 60
      },
      {
        label: "语文",
        series1: 110,
        series2: 150
      },
      {
        label: "历史",
        series1: 95,
        series2: 90
      },
      {
        label: "物理",
        series1: 50,
        series2: 0
      },
      {
        label: "地理",
        series1: 70,
        series2: 0
      }
    ];
    const compScoreData = new DataSet.View().source(comparedScoreData).transform({
      type: "fold",
      fields: ["series1", "series2"],
      // 展开字段集
      key: "type",
      // key字段
      value: "value" // value字段
    });
    // 一卡通对比数据1 0-23小时的平均消费
    const timelyCompConsumptionData = [
      {
        time: '0时',
        cost1: 0,
        cost2: 0,
      },
      {
        time: '2时',
        cost1: 6,
        cost2: 3,

      },
      {
        time: '3时',
        cost1: 7,
        cost2: 3,
      },
      {
        time: '4时',
        cost1: 9,
        cost2: 10,
      },
      {
        time: '5时',
        cost1: 20,
        cost2: 30,
      }
    ];
    const timelyCompConsumpData = new DataSet.View().source(timelyCompConsumptionData).transform({
      type: "fold",
      fields: ["cost1", "cost2"],
      // 展开字段集
      key: "type",
      // key字段
      value: "value" // value字段
    });

    //  一卡通对比数据2 每天开销数据的对比
    const dailyCompConsumptionData = [
      {
        time: '星期一',
        该同学: 0,
        对比同学: 20,
      },
      {
        time: '星期二',
        该同学: 70,
        对比同学: 30,
      },
      {
        time: '星期三',
        该同学: 30,
        对比同学: 30,
      },
      {
        time: '星期四',
        该同学: 10,
        对比同学: 5,
      },
      {
        time: '星期五',
        该同学: 20,
        对比同学: 30,
      }
    ];
    const offlineChartData = [];
    for (let i = 0; i < 20; i += 1) {
      offlineChartData.push({
        x: new Date().getTime() + 1000 * 60 * 30 * i,
        A: Math.floor(Math.random() * 100) + 10,
        B: Math.floor(Math.random() * 100) + 10,
      });
    }
    ;
    //考勤对比数据
    const AttendData = [
      {
        name: "李晓明",
        '迟到': 3,
        '早退': 6,
        '校服违纪': 12,
        '作弊': 2
      },
      {
        name: "黎莉莉",
        '迟到': 12,
        '早退': 0,
        '校服违纪': 6,
        '作弊': 0
      }
    ];
    const compAdata = new DataSet.View().source(AttendData);
    compAdata.transform({
      type: "fold",
      fields: ["迟到", "早退", "校服违纪", "作弊"],
      // 展开字段集
      key: "考勤类型",
      // key字段
      value: "次数" // value字段
    });
    //待对比学生的基本信息
    const comparedStu = {
      id: 12354,
      Name: "李明明",
      Nation: "汉族",
      ClassName: "高一6班",
      BornDate: "2003-12-9",
      NativePlace: "山西省太原市"
    };

    const defaultTab = _.difference(location.pathname.split('/'), match.path.split('/'))[0] || 'Score';
    return (
      <GridContent className={styles.userCenter}>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{ marginBottom: 24 }} loading={loading}>
              <Select
                style={{ width: '100%', display: 'block' }}
                showSearch
                notFoundContent={studentListLoading ? <Spin size="small"/> :
                  <Empty description={this.state.studentId ? '未找到包含该信息数据' : '请输入学生姓名或学号查询'}/>
                }
                size="large"
                value={this.state.studentId}
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
              {studentInfo && studentInfo.name ? (
                <Fragment>
                  {/*搜索栏*/}
                  <Divider style={{ marginTop: 16 }} dashed/>
                  <div className={styles.avatarHolder}>
                    {/*词云*/}
                    <Suspense fallback={null}>
                      <WordCloud
                        wordData={dv}
                        scale={scale}
                      />
                    </Suspense>
                    <div className={styles.name}>{studentInfo.name}</div>
                  </div>
                  {/*学生详细信息*/}
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
                  </div>

                  {defaultTab !== 'Score' && <Fragment>
                    <Divider dashed/>
                    <Chart
                      height={400}
                      data={radarViewData}
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
                  </Fragment>}
                  <Divider style={{ marginTop: 16 }} dashed/>
                  {/*老师信息*/}
                  <div className={styles.team}>
                    <div className={styles.teamTitle}>班级信息</div>
                    <Row gutter={36}>
                      {teacherInfo.map(item => (
                        <Col key={item.id} lg={24} xl={12}>
                          <Avatar size={32}><b>{item.courseName}</b></Avatar>
                          {item.name}
                        </Col>
                      ))}
                    </Row>
                  </div>
                </Fragment>
              ) : <Empty description='请在上面👆搜索框中搜索学生信息！'/>}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
            >
              <Tabs defaultActiveKey={defaultTab} onChange={this.onTabChange}>
                <TabPane tab={<span><Icon type="line-chart"/>成绩</span>} key="Score">
                  {studentInfo && studentInfo.name ?
                    <Suspense fallback={<div>Loading...</div>}>
                      <Row type='flex' justify='start'>
                        <Affix offsetTop={10} style={{ 'z-index': 1 }}>
                          <Select
                            value={this.state.scoreType} style={{ width: 120 }}
                            onChange={this.onScoreTypeChange}
                          >
                            <Option key="score" value="score">绝对分</Option>
                            <Option key="z_score" value="z_score">离均值(Z分)</Option>
                            <Option key="t_score" value="t_score">标准分(T分)</Option>
                            <Option key="deng_di" value="deng_di">等第</Option>
                          </Select>
                        </Affix>
                      </Row>
                      <ScoreLineChart
                        lineData={linedata}
                        radarViewData={radarViewData}
                        subData={subData}
                      />
                    </Suspense> : <Empty description='请在左侧搜索框中搜索学生数据'/>
                  }
                </TabPane>
                <TabPane tab={<span><Icon type="credit-card"/>一卡通</span>} key="ECard">
                  <Suspense fallback={<div>Loading...</div>}>
                    <ConsumptionOverallLineChart
                      timelyConsumptionData={timelyConsumptionData}
                      dailyConsumptionData={dConCost}
                      date={consumptionData.date}
                    />

                    <span>选择查看的时间： </span>
                    <DatePicker
                      defaultValue={moment(moment(), 'YYYY-MM-DD')}
                      onChange={(_, date) => this.onDateChange(date)}
                    />
                    <Select defaultValue="week" style={{ width: 120 }} onChange={this.handleChangeTime}>
                      <Option value="week">1周</Option>
                      <Option value="1month">1个月</Option>
                      <Option value="3month">3个月</Option>
                      <Option value="6month">6个月</Option>
                      <Option value="year">1年</Option>
                    </Select>
                    <ConsumptionTimeSlotLineChart
                      timelyConsumptionData={timelyConsumptionData}
                      dailyConsumptionData={dConCost}
                      date={consumptionData.date}
                    />
                  </Suspense>
                </TabPane>
                <TabPane tab={<span><i className={`fa fa-calendar-check-o`}/> 考勤</span>} key="Attendance">
                  <Suspense fallback={<Spin className='center'/>}>
                    <AttendanceChart
                      loading={kaoqinLoading}
                      kaoqinData={kaoqinData}
                      termList={termList}
                      kaoqinSummary={kaoqinSummary}
                    />
                  </Suspense>
                </TabPane>
                <TabPane tab={<span><i className="fa fa-window-restore"/> 对比分析</span>} key="Compare">
                  <div style={{ textAlign: 'center' }}>
                    <Input.Search
                      placeholder="请输入待对比学生ID"
                      enterButton="确定"
                      size="large"
                      onSearch={this.handleComparedStuChange}
                    />
                  </div>
                  {/*基本信息对比*/}
                  <Card title="基本信息对比" bordered={false} style={{ width: '100%' }}>
                    <Row>
                      <Col span={8}>
                        <Suspense fallback={null}>
                          <WordCloud
                            wordData={dv}
                            scale={scale}
                          />
                        </Suspense>
                      </Col>
                      <Col span={16} push={2}>
                        {/*todo 待对比学生基本信息个人名片之类*/}
                        <Card title={comparedStu.Name} bordered={false} hoverable={true}>
                          <p>学生ID: {comparedStu.id}</p>
                          <p>民族: {comparedStu.Nation}</p>
                          <p>出生年月: {comparedStu.BornDate}</p>
                          <p>家庭住址: {comparedStu.NativePlace}</p>
                          <p>所在班级: {comparedStu.ClassName}</p>
                        </Card>
                      </Col>
                    </Row>
                  </Card>
                  <Suspense fallback={<div>Loading...</div>}>
                    <StuComparedChart
                      comparedScoreData={compScoreData}
                      timelyComparedConsumptionData={timelyCompConsumpData}
                      dailyComparedConsumptionData={offlineChartData}
                      comparedAttendData={compAdata}
                    />
                  </Suspense>
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

