import React, { PureComponent, Suspense } from 'react';
import { connect } from 'dva';
import { POLICY_TYPE_ALIAS, SEX_MAP } from "@/constants";
import router from 'umi/router';
import _ from 'lodash';
import { Avatar, Card, Col, Divider, Empty, Icon, Input, Row, Select, Spin, Tabs } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './Center.less';
import { Axis, Chart, Coord, Geom, Legend, Shape, Tooltip } from "bizcharts";
import DataSet from "@antv/data-set";

const ScoreLineChart = React.lazy(() => import('./ScoreLineChart'));
const WordCloud = React.lazy(() => import('./WordCloud'));
const ConsumptionLineChart = React.lazy(() => import('./ConsumptionLineChart'));
const AttendanceChart = React.lazy(() => import('./AttendanceChart'));
const StuComparedChart = React.lazy(() => import('./StuComparedChart'));


@connect(({ loading, student }) => ({
  studentList: student.studentList,
  studentInfo: student.studentInfo,
  wordCloudData: student.wordCloudData,
  loading: loading.effects['student/fetchBasic'] && loading.effects['student/fetchGrade'],
  studentListLoading: loading.effects['student/fetchStudentList'],
}))
class Center extends PureComponent {
  constructor() {
    super();
    this.state = {
      newTags: [],
      inputVisible: false,
      inputValue: '',
      studentId: '',
    };
    this.getStudentList = _.debounce(this.getStudentList, 800);
  }


  onTabChange = key => {
    {/* todo */
    }
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
      type: 'student/fetchGrade',
      payload: {
        studentId: studentId,
      }
    });
    dispatch({
      type: 'student/fetchTeacher',
      payload: {
        studentId: studentId,
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

  handleComparedStuChange = (value) => {
    //todo
  };

  render() {
    const { newTags, inputVisible, inputValue } = this.state;
    const {
      studentInfo,
      wordCloudData,
      studentList,
      studentListLoading,
      listLoading,
      // currentUser,
      studentLoading,
      projectLoading,
      match,
      location,
      children,
    } = this.props;
    // const {studentInfo} = student;
    //雷达图的处理
    const { DataView } = DataSet;
    const radarViewData = new DataView().source(studentInfo.grade);
    radarViewData.transform({
      type: "fold",
      fields: ["最高分", "最低分", "平均分"],
      // 展开字段集
      key: "user",
      // key字段
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

        if (random == 2) {
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
    const linedata = [
      {
        year: "1991",
        value: 3
      },
      {
        year: "1992",
        value: 4
      },
      {
        year: "1993",
        value: 3.5
      },
      {
        year: "1994",
        value: 5
      },
      {
        year: "1995",
        value: 4.9
      },
      {
        year: "1996",
        value: 6
      },
      {
        year: "1997",
        value: 7
      },
      {
        year: "1998",
        value: 9
      },
      {
        year: "1999",
        value: 13
      }
    ];
    const datascale = {
      value: {
        min: 0
      }
    };
    const subData = [
      {
        title: "数学成绩变化趋势",
        lineData: [
          {
            year: "1991",
            value: 3
          },
          {
            year: "1992",
            value: 4
          },
          {
            year: "1993",
            value: 3.5
          },
          {
            year: "1994",
            value: 5
          },
          {
            year: "1995",
            value: 4.9
          },
          {
            year: "1996",
            value: 6
          },
          {
            year: "1997",
            value: 7
          },
          {
            year: "1998",
            value: 9
          },
          {
            year: "1999",
            value: 13
          }
        ]
      },
      {
        title: "语文成绩变化趋势",
        lineData: [
          {
            year: "1991",
            value: 3
          },
          {
            year: "1992",
            value: 4
          },
          {
            year: "1993",
            value: 3.5
          },
          {
            year: "1994",
            value: 5
          },
          {
            year: "1995",
            value: 4.9
          },
          {
            year: "1996",
            value: 6
          },
          {
            year: "1997",
            value: 7
          },
          {
            year: "1998",
            value: 9
          },
          {
            year: "1999",
            value: 13
          }
        ]
      },
      {
        title: "英语成绩变化趋势",
        lineData: [
          {
            year: "1991",
            value: 3
          },
          {
            year: "1992",
            value: 4
          },
          {
            year: "1993",
            value: 3.5
          },
          {
            year: "1994",
            value: 5
          },
          {
            year: "1995",
            value: 4.9
          },
          {
            year: "1996",
            value: 6
          },
          {
            year: "1997",
            value: 7
          },
          {
            year: "1998",
            value: 9
          },
          {
            year: "1999",
            value: 13
          }
        ]
      },
      {
        title: "历史成绩变化趋势",
        lineData: [
          {
            year: "1991",
            value: 3
          },
          {
            year: "1992",
            value: 4
          },
          {
            year: "1993",
            value: 3.5
          },
          {
            year: "1994",
            value: 5
          },
          {
            year: "1995",
            value: 4.9
          },
          {
            year: "1996",
            value: 6
          },
          {
            year: "1997",
            value: 7
          },
          {
            year: "1998",
            value: 9
          },
          {
            year: "1999",
            value: 13
          }
        ]
      },
      {
        title: "地理成绩变化趋势",
        lineData: [
          {
            year: "1991",
            value: 3
          },
          {
            year: "1992",
            value: 4
          },
          {
            year: "1993",
            value: 3.5
          },
          {
            year: "1994",
            value: 5
          },
          {
            year: "1995",
            value: 4.9
          },
          {
            year: "1996",
            value: 6
          },
          {
            year: "1997",
            value: 7
          },
          {
            year: "1998",
            value: 9
          },
          {
            year: "1999",
            value: 13
          }
        ]
      }
    ];
    //呈现成绩信息的筛选
    const Option = Select.Option;

    function handleChange(value) {
      //todo 重新rander改变linedata的值
      console.log(`selected ${value}`);
    }

    //timelyconsumption数据
    const timelyConsumptionData = [
      {
        time: '0时',
        cost: 0
      },
      {
        time: '2时',
        cost: 0
      },
      {
        time: '3时',
        cost: 30
      },
      {
        time: '4时',
        cost: 50
      },
      {
        time: '5时',
        cost: 70
      }
    ];
    const dailyConsumptionData = [
      {
        time: '星期一',
        本周: 0,
        上周: 20,
        预测值: 10
      },
      {
        time: '星期二',
        本周: 70,
        上周: 30,
        预测值: 80
      },
      {
        time: '星期三',
        本周: 30,
        上周: 30,
        预测值: 30
      },
      {
        time: '星期四',
        本周: 10,
        上周: 5,
        预测值: 15
      },
      {
        time: '星期五',
        本周: 20,
        上周: 30,
        预测值: 10
      }
    ];
    const dConCost = new DataSet.View().source(dailyConsumptionData);
    dConCost.transform({
      type: "fold",
      fields: ["本周", "上周", "预测值"],
      // 展开字段集
      key: "diftime",
      // key字段
      value: "cost" // value字段
    });
    //考勤的相关数据
    const attendanceChartData = [
      {
        name: "早退",
        "2017年": 18.9,
        "2018年": 28.8,
        "2019年": 39.3,
      },
      {
        name: "迟到",
        "2017年": 1,
        "2018年": 8,
        "2019年": 3,
      },
      {
        name: "没穿校服",
        "2017年": 9,
        "2018年": 2,
        "2019年": 3,
      }
    ];
    const attendChartData = new DataSet.View().source(attendanceChartData);
    attendChartData.transform({
      type: "fold",
      fields: ["2017年", "2018年", "2019年"],
      // 展开字段集
      key: "时间",
      // key字段
      value: "违纪次数" // value字段
    });
    const attendanceSumData = {
      lateNum: 20,
      leaveNum: 5,
      uniformNum: 10,
      inTime: '7点23分',
      outTime: '12点10分'
    };
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
            <Card bordered={false} style={{ marginBottom: 24 }} loading={studentLoading}>
              {studentInfo && Object.keys(studentInfo).length ? (
                <div>
                  {/*搜索栏*/}
                  <div style={{ textAlign: 'center' }}>
                    <Select
                      style={{ width: '100%' }}
                      showSearch
                      enterButton="搜索"
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
                        >
                          {`${student.id}-${student.name}`}
                        </Option>
                      ))}
                    </Select>
                  </div>
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
                    <div>{studentInfo.className}</div>
                  </div>
                  {/*学生详细信息*/}
                  <div className={styles.detail}>
                    <p>
                      <i className={`fa fa-group ${styles.iconStyle}`}/>
                      {studentInfo.nation}
                    </p>
                    <p>
                      <i className={`fa fa fa-archive ${styles.iconStyle}`}/>
                      {POLICY_TYPE_ALIAS[studentInfo.policy]}
                    </p>
                    <p>
                      <i className={`fa fa-birthday-cake ${styles.iconStyle}`}/>
                      {studentInfo.born_year > 0 ? studentInfo.born_year : '未知'} 年
                    </p>
                    <p>
                      <i className={`fa fa-home ${styles.iconStyle}`}/>
                      {studentInfo.native_place}
                    </p>
                    <p>
                      <i className={`fa ${studentInfo.sex === 1 ? 'fa-male' : 'fa-female'} ${styles.iconStyle}`}/>
                      {SEX_MAP[studentInfo.sex]}
                    </p>
                  </div>
                  <Divider dashed/>
                  {/*todo 是否删除 雷达图*/}
                  <div>
                    <Chart
                      height={400}
                      data={radarViewData}
                      padding={[20, 20, 95, 20]}
                      scale={cols}
                      forceFit
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
                  </div>
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
                </div>
              ) : (
                'loading...'
              )}
            </Card>
          </Col>
          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
            >
              <Tabs defaultActiveKey={defaultTab} onChange={this.onTabChange}>
                <TabPane tab={<span><Icon type="apple"/>成绩</span>} key="Score">
                  <Row type='flex' justify='end'>
                    <Col span={4}>
                      <Select defaultValue="lucy" style={{ width: 120 }} onChange={handleChange}>
                        <Option value="jack">绝对分</Option>
                        <Option value="lucy">离均值(Z分)</Option>
                        <Option value="disabled">标准分(T分)</Option>
                        <Option value="Yiminghe">等第</Option>
                        <Option value="range">排名</Option>
                      </Select>
                    </Col>
                  </Row>
                  <Suspense fallback={<div>Loading...</div>}>
                    <ScoreLineChart
                      lineData={linedata}
                      scale={datascale}
                      radarViewData={radarViewData}
                      cols={cols}
                      subData={subData}
                    />
                  </Suspense>
                </TabPane>
                <TabPane tab={<span><Icon type="android"/>一卡通</span>} key="ECard">
                  <Suspense fallback={<div>Loading...</div>}>
                    <ConsumptionLineChart
                      timelyConsumptionData={timelyConsumptionData}
                      dailyConsumptionData={dConCost}
                    />
                  </Suspense>
                </TabPane>
                <TabPane tab={<span><Icon type="android"/>考勤</span>} key="Attendance">
                  <Suspense fallback={<div>Loading...</div>}>
                    <AttendanceChart
                      attendanceChartData={attendChartData}
                      attendanceSumData={attendanceSumData}
                    />
                  </Suspense>
                </TabPane>
                <TabPane tab={<span><Icon type="android"/>对比分析</span>} key="Compare">
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

