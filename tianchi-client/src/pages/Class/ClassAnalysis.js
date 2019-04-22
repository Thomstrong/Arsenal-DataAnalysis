import React, {Fragment, PureComponent, Suspense} from 'react';
import {connect} from 'dva';
import {POLICY_TYPE_ALIAS, SCORE_LEVEL_ALIAS, SEX_MAP} from "@/constants";
import router from 'umi/router';
import _ from 'lodash';
import {
  Affix,
  Avatar,
  Card,
  Col,
  DatePicker,
  Divider,
  Empty,
  Icon,
  Input,
  Row,
  Select,
  Spin,
  Tabs,
  Table,
  Statistic
} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './ClassAnalysis.less';
import {Axis, Chart, Coord, Geom, Guide,Legend, Shape, Tooltip} from "bizcharts";
import DataSet from "@antv/data-set";
import moment from "moment";

const ScoreTrendChart = React.lazy(() =>
import
('./ScoreTrendChart')
)
;

@connect(({student}) => ({
  studentInfo: student.studentInfo,
}))

class ClassAnalysis extends PureComponent {

  constructor() {
    super();
    this.state = {
      classId: '',
      studentId: '',
      scoreType: 'score',
      dateRange: 7,
      pickedDate: moment().format('YYYY-MM-DD'),
    };
    // this.getStudentList = _.debounce(this.getStudentList, 800);
  }

  onTabChange = key => {
    const {match} = this.props;
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
    const {dispatch, totalHourlyAvgCost} = this.props;
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
  };

  //todo 搜索栏请求匹配的班级list
  getClassList = (input) => {
    if (!input) {
      return;
    }
    const {dispatch} = this.props;
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


  onScoreTypeChange = (scoreType) => {
    const {dispatch, studentInfo} = this.props;
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
    this.setState({scoreType});
  };

  onDateChange = (pickedDate) => {
    if (!pickedDate) {
      return;
    }
    const {dispatch, studentInfo} = this.props;
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
    this.setState({pickedDate});
  };

  handleChangeRange = (dateRange) => {
    const {dispatch, studentInfo} = this.props;
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
    this.setState({dateRange});
  };

  onExamTypeChange = (scoreType) => {
    const {dispatch, studentInfo} = this.props;
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
    this.setState({scoreType});
  };

  render() {
    const {
      studentInfo,
      wordCloudData,
      studentList,
      studentListLoading,
      termList,
      totalHourlyAvgCost,
      dailyPredictData,
      hourlyCost,
      hourlyAvgCost,
      dailySumCost,
      loading,
      match,
      location,
      kaoqinLoading
    } = this.props;

    // const {hourlyAvgData,maxHourlyAvg} = this.formatHourlyAvgCost(hourlyAvgCost, totalHourlyAvgCost);
    // const { formatedData: predictData, maxCost } = this.formatDailyPredictData(dailyPredictData);
     const { Line } = Guide;

    const radarViewData = new DataSet.View().source(studentInfo.radarData).transform({
      type: "fold",
      fields: Object.values(SCORE_LEVEL_ALIAS),
      key: "user",
      value: "score" // value字段
    });
    // const cols = {
    //   score: {
    //     min: 0,
    //     max: 100
    //   }
    // };
    const linedata = studentInfo ? studentInfo.totalTrend : [];
    const subData = studentInfo ? new DataSet.View().source([studentInfo.subTrends]).transform({
      type: "fold",
      fields: Object.keys(studentInfo.subTrends),
      // 展开字段集
      key: "title",
      // key字段
      value: "lineData" // value字段
    }).rows : [];

    const TabPane = Tabs.TabPane;
    const classInfo = {
      name: '高一（3）班',
      location: '东部校区',
      year: '2018-2019学年',
      students: 30,
      boys: 20,
      girls: 10,
      leave: 23,
      stay: 7,
      local: 21,
      field: 9,
      member: 26,
      teacherInfo: [
        {
          courseName: '政治',
          name: '李老师'
        },
        {
          courseName: '英语',
          name: '李老师'
        },
        {
          courseName: '数学',
          name: '李老师'
        },
        {
          courseName: '历史',
          name: '李老师'
        },
      ]
    };
    const teacherInfo = classInfo.teacherInfo;
    const columns = [
      {
        title: '最新排名',
        dataIndex: 'index',
        key: 'index',
        sorter: (a, b) => a.index - b.index,
        width: 120,
        fixed: 'left'
      },
      {
        title: '学生姓名',
        dataIndex: 'keyword',
        key: 'keyword',
        width: 100,
        fixed: 'left'
        // render: text => <a href="/">{text}</a>,
      },
      {
        title: '语文成绩',
        dataIndex: 'chinese',
        key: 'chinese',
        sorter: (a, b) => a.chinese - b.chinese,
        align: 'center',
      },
      {
        title: '数学成绩',
        dataIndex: 'math',
        key: 'math',
        sorter: (a, b) => a.math - b.math,
        align: 'center',
      },
      {
        title: '英语成绩',
        dataIndex: 'english',
        key: 'english',
        sorter: (a, b) => a.english - b.english,
        align: 'center',
      },
      {
        title: '物理成绩',
        dataIndex: 'physical',
        key: 'physical',
        sorter: (a, b) => a.physical - b.physical,
        align: 'center',
      },
      {
        title: '化学成绩',
        dataIndex: 'chemistry',
        key: 'chemistry',
        sorter: (a, b) => a.chemistry - b.chemistry,
        align: 'center',
      },
      {
        title: '生物成绩',
        dataIndex: 'biological',
        key: 'biological',
        sorter: (a, b) => a.biological - b.biological,
        align: 'center',
      }, {
        title: '政治成绩',
        dataIndex: 'political',
        key: 'political',
        sorter: (a, b) => a.political - b.political,
        align: 'center',
      },
      {
        title: '历史成绩',
        dataIndex: 'history',
        key: 'history',
        sorter: (a, b) => a.history - b.history,
        align: 'center',
      },
      {
        title: '地理成绩',
        dataIndex: 'geography',
        key: 'geography',
        sorter: (a, b) => a.geography - b.geography,
        align: 'center',
      },
      {
        title: '技术成绩',
        dataIndex: 'technology',
        key: 'technology',
        sorter: (a, b) => a.technology - b.technology,
        align: 'center',
      },
      {
        title: '总分',
        dataIndex: 'count',
        key: 'count',
        sorter: (a, b) => a.count - b.count,
        className: styles.alignRight,
        width: 100,
        fixed: 'right'
      },
    ];

    const classData = [];
    for (let i = 0; i < 50; i += 1) {
      classData.push({
        index: i + 1,
        keyword: `李-${i}`,
        count: Math.floor(Math.random() * 1000),
        chinese: Math.floor(Math.random() * 100),
        math: Math.floor(Math.random() * 100),
        english: Math.floor(Math.random() * 100),
        physical: Math.floor(Math.random() * 100),
        chemistry: Math.floor(Math.random() * 100),
        biological: Math.floor(Math.random() * 100),
        political: Math.floor(Math.random() * 100),
        history: Math.floor(Math.random() * 100),
        geography: Math.floor(Math.random() * 100),
        technology: Math.floor(Math.random() * 100),
      });
    }

    const Option = Select.Option;

    function handleChange(value) {
      console.log(`selected ${value}`);
    }

    function handleBlur() {
      console.log('blur');
    }

    function handleFocus() {
      console.log('focus');
    }

    function handleChangeSubject(value) {
      console.log(`selected ${value}`);
    }

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


    //基本条状data，展示该班在对应年级平均分的排名情况
    //因为bizchart的高亮是针对于整个图表而言的，所以计划把选中的这个班级的成绩放在第一位，剩下的班级从大到小排列
    //todo 注意传入数据的顺序,最后一个数据显示在第一位
    const data = [

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


    return (
      <GridContent className={styles.userCenter}>
        <Row gutter={24}>
          <Col lg={7} md={24}>
            <Card bordered={false} style={{marginBottom: 24}} loading={loading}>
              <Affix offsetTop={10} style={{'zIndex': 1}}>
                {/*todo classListLoading*/}
                <Select
                  style={{width: '100%', display: 'block'}}
                  showSearch
                  notFoundContent={studentListLoading ? <Spin size="small"/> :
                    <Empty description={this.state.classId ? '未找到包含该信息数据' : '请输入学生姓名或学号查询'}/>
                  }
                  size="large"
                  value={classInfo.id || this.state.classId}
                  filterOption={false}
                  onSearch={(value) => this.getClassList(value)}
                  onChange={(classId) => this.setState({classId})}
                >
                  {/*todo 注释部分关于classList的处理*/}
                  {/*{classList.map((student) => (*/}
                  {/*<Option*/}
                  {/*onClick={(value) => this.getStudentInfo(value.key)}*/}
                  {/*value={student.id}*/}
                  {/*key={`student-${student.id}`}*/}
                  {/*>*/}
                  {/*{`${student.id}-${student.name}`}*/}
                  {/*</Option>*/}
                  {/*))}*/}
                </Select>
              </Affix>
              {classInfo && classInfo.name ? (
                <Fragment>
                  <Divider style={{marginTop: 16}} dashed/>
                  <div className={styles.avatarHolder}>
                    <div className={styles.name}>{classInfo.name}</div>
                  </div>
                  {/*班级详细信息，拟计划有校区，所处学年，共有学生人数，及分布情况*/}
                  <div className={styles.detail}>
                    <p><i className={`fa fa-group ${styles.iconStyle}`}/>
                      {classInfo.location}
                    </p>
                    <p><i className={`fa fa fa-archive ${styles.iconStyle}`}/>
                      {classInfo.year}
                    </p>
                    <Divider style={{marginTop: 16}} dashed/>
                    <div className={styles.teamTitle}>学生分布</div>
                    <Row type="flex" justify="start" style={{marginLeft: 10}}>
                      <Col>
                        <Statistic title="共有学生" value={`${classInfo.students}人`} valueStyle={{color: '#cf1322'}}/>
                      </Col>
                    </Row>
                    <Row type="flex" justify="space-between" style={{marginTop: 10}}>
                      <Col span={6}><Statistic title="男生" value={classInfo.boys}
                                               suffix={`/${classInfo.students}`}/></Col>
                      <Col span={6}><Statistic title="女生" value={classInfo.girls}
                                               suffix={`/${classInfo.students}`}/></Col>
                      <Col span={6}><Statistic title="走读生" value={classInfo.leave}
                                               suffix={`/${classInfo.students}`}/></Col>
                      <Col span={6}><Statistic title="住校生" value={classInfo.stay}
                                               suffix={`/${classInfo.students}`}/></Col>
                      <Col span={6}><Statistic title="本地生源" value={classInfo.local} suffix={`/${classInfo.students}`}/></Col>
                      <Col span={6}><Statistic title="外地生源" value={classInfo.field} suffix={`/${classInfo.students}`}/></Col>
                      <Col span={6}><Statistic title="团员" value={classInfo.member}
                                               suffix={`/${classInfo.students}`}/></Col>
                      <Col span={6}><Statistic title="其他面貌" value={classInfo.member} suffix={`/${classInfo.students}`}/></Col>
                    </Row>
                  </div>

                  <Divider style={{marginTop: 16}} dashed/>
                  {/*老师信息*/}
                  <div className={styles.team}>
                    <div className={styles.teamTitle}>老师信息</div>
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
          {/*分为两个部分，分别是考试趋势显示和具体考试分析*/}
          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
            >
              <Tabs defaultActiveKey={'Trend'} onChange={this.onTabChange}>
                <TabPane tab={<span><Icon type="line-chart"/>成绩趋势显示</span>} key="Trend">
                  {classInfo && classInfo.name ?
                    <div>
                      <Card title="该班级考试得分趋势变化" bordered={false}>
                        <Affix offsetTop={10} style={{'zIndex': 1}}>
                          <Select
                            value={this.state.scoreType} style={{width: 120}}
                            onChange={this.onScoreTypeChange}
                          >
                            <Option key="score" value="score">绝对分</Option>
                            <Option key="z_score" value="z_score">离均值(Z分)</Option>
                            <Option key="t_score" value="t_score">标准分(T分)</Option>
                            <Option key="deng_di" value="deng_di">等第</Option>
                          </Select>
                        </Affix>
                        <Suspense fallback={<div>Loading...</div>}>
                          <ScoreTrendChart
                            lineData={linedata}
                            radarViewData={radarViewData}
                            subData={subData}
                          />
                        </Suspense>
                      </Card>
                      <Table
                        rowKey={record => record.index}
                        columns={columns}
                        dataSource={classData}
                        scroll={{x: 1400}}
                        pagination={{
                          style: {marginBottom: 0, marginTop: 24},
                          pageSize: 5,
                        }}
                      />
                    </div> : <Empty description='请在左侧搜索框中搜索班级数据'/>
                  }
                </TabPane>
                <TabPane tab={<span><Icon type="credit-card"/>具体考试分析</span>} key="Specific">
                  <Affix offsetTop={10} style={{'zIndex': 1}}>
                    <Select
                      showSearch
                      optionFilterProp="children"
                      style={{width: 200}}
                      onChange={handleChange}
                      onFocus={handleFocus}
                      onBlur={handleBlur}
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      placeholder="请选择该班级参与的考试"
                    >
                      <Option key="score" value="score">考试1</Option>
                      <Option key="z_score" value="z_score">考试2</Option>
                      <Option key="t_score" value="t_score">考试3</Option>
                      <Option key="deng_di" value="deng_di">考试4</Option>
                    </Select>
                  </Affix>
                  {/*todo 修改为exam*/}
                  {classInfo && classInfo.name ?
                    <div>
                      <Card title="本次考试排名一览" style={{marginTop: 12}}>
                        <Row>
                          <Statistic title="本次排名" value={5} suffix="/ 12" valueStyle={{color: '#cf1322'}}/>
                        </Row>
                        <Row type="flex" justify="space-between">
                          <Col>
                            <Statistic title="语文排名" value={1}/>
                          </Col>
                          <Col>
                            <Statistic title="数学排名" value={1}/>
                          </Col>
                          <Col>
                            <Statistic title="英语排名" value={1}/>
                          </Col>
                          <Col>
                            <Statistic title="历史排名" value={1}/>
                          </Col>
                          <Col>
                            <Statistic title="政治排名" value={1}/>
                          </Col>
                          <Col>
                            <Statistic title="地理排名" value={1}/>
                          </Col>
                          <Col>
                            <Statistic title="物理排名" value={1}/>
                          </Col>
                          <Col>
                            <Statistic title="化学排名" value={1}/>
                          </Col>
                          <Col>
                            <Statistic title="生物排名" value={1}/>
                          </Col>
                          <Col>
                            <Statistic title="技术排名" value={1}/>
                          </Col>
                        </Row>
                      </Card>
                      <Card title="本次考试该班学生成绩与排名" style={{marginTop: 12}}>
                        <Table
                          rowKey={record => record.index}
                          columns={columns}
                          dataSource={classData}
                          scroll={{x: 1400}}
                          pagination={{
                            style: {marginBottom: 0, marginTop: 24},
                            pageSize: 5,
                          }}
                        />
                      </Card>
                      <Card title="年级其他班成绩对比分析" style={{marginTop: 12}}>
                        <Row type='flex' justify="end">
                          <Affix offsetTop={10}>
                            <Select
                              defaultValue="语文" style={{width: "100%"}} onChange={handleChangeSubject}>
                              <Option key="count" value="count">总分</Option>
                              <Option key="chinese" value="chinese">语文</Option>
                              <Option key="math" value="math">数学</Option>
                              <Option key="english" value="english">英语</Option>
                              <Option key="political" value="political">政治</Option>
                              <Option key="history" value="history">历史</Option>
                              <Option key="geography" value="geography">地理</Option>
                              <Option key="physical" value="physical">物理</Option>
                              <Option key="chemistry" value="chemistry">化学</Option>
                              <Option key="biological" value="biological">生物</Option>
                              <Option key="technology" value="technology">技术</Option>
                            </Select>
                          </Affix>
                          <Affix offsetTop={10}>
                            <Select defaultValue="绝对分" style={{width: "100%"}} onChange={handleChangeSubject}>
                              <Option key="score" value="score">绝对分</Option>
                              <Option key="z_score" value="z_score">离均值(Z分)</Option>
                              <Option key="t_score" value="t_score">标准分(T分)</Option>
                              <Option key="deng_di" value="deng_di">等第</Option>
                            </Select>
                          </Affix>
                        </Row>
                        <Chart height={400} data={data} forceFit>
                          <Coord transpose/>
                          <Axis
                            name="className"
                            label={{
                              offset: 12
                            }}
                          />
                          <Axis name="score"/>
                          <Tooltip />
                          <Legend/>
                          <Geom type="interval" position="className*score"/>
                          {/*todo 只有选择的是绝对分和总分才显示辅助线*/}
                          <Guide>
                            <Line
                              top={true}
                              start={[-1,588]} // 辅助线起始位置，值为原始数据值，支持 callback
                              end = {['max',588]}
                              lineStyle={{
                                stroke: '#999', // 线的颜色
                                lineDash: [0, 2, 2],
                                lineWidth: 2
                              }}
                              text={{
                                position:'start',
                                content: "2018 一段线 588", // 文本的内容
                                style:{
                                Rotate:90,
                              }
                              }}
                            />
                            <Line
                              top={true}
                              start={[-1,490]} // 辅助线起始位置，值为原始数据值，支持 callback
                              end = {['max' ,490]}
                              lineStyle={{
                                stroke: '#999', // 线的颜色
                                lineDash: [0, 2, 2], // 虚线的设置
                                lineWidth: 2 // 线的宽度
                              }} // 图形样式配置
                              text={{
                                position:'start',
                                content: "2018 二段线 490", // 文本的内容
                                style:{
                                Rotate:90,
                              }
                              }}
                            />
                            <Line
                              top={true}
                              start={[-1,344]} // 辅助线起始位置，值为原始数据值，支持 callback
                              end = {['max' ,344]}
                              lineStyle={{
                                stroke: '#999', // 线的颜色
                                lineDash: [0, 2, 2], // 虚线的设置
                                lineWidth: 2 // 线的宽度
                              }} // 图形样式配置
                              text={{
                                position:'start',
                                content: "2018 三段线 344", // 文本的内容
                                style:{
                                Rotate:90,
                              }
                              }}
                            />
                            <Line
                              top={true}
                              start={[-1,577]} // 辅助线起始位置，值为原始数据值，支持 callback
                              end = {['max' ,577]}
                              lineStyle={{
                                stroke: '#999', // 线的颜色
                                lineDash: [0, 2, 2], // 虚线的设置
                                lineWidth: 1 // 线的宽度
                              }} // 图形样式配置
                              text={{
                                position:'start',
                                content: "2017 一段线 577", // 文本的内容
                                style:{
                                Rotate:90,
                              }
                              }}
                            />
                            <Line
                              top={true}
                              start={[-1,480]} // 辅助线起始位置，值为原始数据值，支持 callback
                              end = {['max' ,480]}
                              lineStyle={{
                                stroke: '#999', // 线的颜色
                                lineDash: [0, 2, 2], // 虚线的设置
                                lineWidth: 1 // 线的宽度
                              }} // 图形样式配置
                              text={{
                                position:'start',
                                content: "2017 二段线 480", // 文本的内容
                                style:{
                                Rotate:90,//todo 旋转角度，没变化
                              }
                              }}
                            />
                            <Line
                              top={true}
                              start={[-1,359]} // 辅助线起始位置，值为原始数据值，支持 callback
                              end = {['max' ,359]}
                              lineStyle={{
                                stroke: '#999', // 线的颜色
                                lineDash: [0, 2, 2], // 虚线的设置
                                lineWidth: 1 // 线的宽度
                              }} // 图形样式配置
                              text={{
                                position:'start',
                                content: "2017 三段线 359", // 文本的内容
                                style:{
                                Rotate:90,
                              }
                              }}
                            />
                          </Guide>
                        </Chart>
                        <Chart height={400} data={cdv} forceFit>
                          <Legend />
                          <Coord transpose/>
                          <Axis
                            name="State"
                            label={{
                              offset: 12
                            }}
                          />
                          <Axis name="人数"/>
                          <Tooltip />
                          <Geom
                            type="intervalStack"
                            position="State*人数"
                            color={"分数段"}
                          />
                        </Chart>
                      </Card>
                    </div> : <Empty description='请在左侧搜索框中搜索班级数据或选定考试'/>
                  }
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </GridContent>
    );
  }
}

export default ClassAnalysis;


