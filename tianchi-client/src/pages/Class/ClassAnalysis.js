import React, { Fragment, PureComponent, Suspense } from 'react';
import { connect } from 'dva';
import { CLASS_CAMPUS_CHOICE, SCORE_LEVEL_ALIAS } from "@/constants";
import router from 'umi/router';
import _ from 'lodash';
import { Affix, Avatar, Card, Col, Divider, Empty, Icon, Row, Select, Spin, Statistic, Table, Tabs, Tag } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './ClassAnalysis.less';
import { Axis, Chart, Coord, Geom, Guide, Legend, Tooltip } from "bizcharts";
import DataSet from "@antv/data-set";
import moment from "moment";

const ScoreTrendChart = React.lazy(() => import('./ScoreTrendChart'));
const ClassAttendanceChart = React.lazy(() => import('./ClassAttendanceChart'));

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const Line = Guide.Line;

@connect(({ loading, stuClass }) => ({
  stuClass,
  loading: loading.effects['stuClass/fetchBasic'],
  classListLoading: loading.effects['stuClass/fetchClassList'],
  radarLoading: loading.effects['stuClass/fetchRadarData'],
  kaoqinLoading: loading.effects['stuClass/fetchKaoqinData'],
  termList: stuClass.termList,
  kaoqinData: stuClass.kaoqinData,
  kaoqinSummary: stuClass.kaoqinSummary,
}))
class ClassAnalysis extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      classId: props.match.params.classId,
      scoreType: 'score',
      dateRange: 7,
      pickedDate: moment().format('YYYY-MM-DD'),
    };
    this.getClassList = _.debounce(this.getClassList, 800);

  }

  componentDidMount() {
    const { classInfo } = this.props.stuClass;
    const { query } = this.props.location;
    if (query && query.classId && Number(query.classId) !== classInfo.id) {
      this.getClassInfo(query.classId);
    }
  }

  onTabChange = key => {
    const { match } = this.props;
    switch (key) {
      case 'Trend':
        router.push(`${match.path}/Trend`);
        break;
      case 'Specific':
        router.push(`${match.path}/Specific`);
        break;
      default:
        break;
    }
  };

  getClassInfo = (classId) => {
    const { dispatch } = this.props;
    dispatch({
      type: 'stuClass/fetchBasic',
      payload: {
        classId
      }
    });
    dispatch({
      type: 'stuClass/fetchDistribution',
      payload: {
        classId
      }
    });
    dispatch({
      type: 'stuClass/fetchTeacher',
      payload: {
        classId
      }
    });
    dispatch({
      type: 'stuClass/fetchRadarData',
      payload: {
        classId
      }
    });
    dispatch({
      type: 'stuClass/fetchTrendData',
      payload: {
        classId
      }
    });
    this.setState({ classId });
  };

  getClassList = (input) => {
    if (!input) {
      return;
    }
    const { dispatch } = this.props;
    dispatch({
      type: 'stuClass/fetchClassList',
      payload: {
        query: input
      }
    });
  };


  handleComparedStuChange = (value) => {
    //todo
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
    this.setState({ scoreType });
  };

  onDateChange = (pickedDate) => {
    if (!pickedDate) {
      return;
    }
    this.setState({ pickedDate });
  };

  handleChangeRange = (dateRange) => {
    this.setState({ dateRange });
  };

  onExamTypeChange = (scoreType) => {
    this.setState({ scoreType });
  };

  render() {
    const {
      stuClass, classListLoading, loading, match, radarLoading, kaoqinLoading, termList, kaoqinSummary, kaoqinData
    } = this.props;

    const {
      distributionData, classInfo, teachers,
      classList, radarData, totalTrend,
      subTrends
    } = stuClass;

    const kaoQinData = this.formatKaoqinData(kaoqinData, termList);

    const { boy, stay, total, local, policy } = distributionData;
    const isAtSchool = classInfo.start_year === 2018;
    const defaultTab = _.difference(location.pathname.split('/'), match.path.split('/'))[0] || 'Trend';

    const radarViewData = new DataSet.View().source(radarData).transform({
      type: "fold",
      fields: Object.values(SCORE_LEVEL_ALIAS),
      key: "user",
      value: "score" // value字段
    });

    const subData = subTrends ? new DataSet.View().source([subTrends]).transform({
      type: "fold",
      fields: Object.keys(subTrends),
      // 展开字段集
      key: "title",
      // key字段
      value: "lineData" // value字段
    }).rows : [];

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


    function handleChange(value) {
      console.log(`selected ${value}`);
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
            <Card bordered={false} style={{ marginBottom: 24 }} loading={loading}>
              <Affix offsetTop={10} style={{ 'zIndex': 1 }}>
                {/*todo classListLoading*/}
                <Select
                  style={{ width: '100%', display: 'block' }}
                  showSearch
                  notFoundContent={classListLoading ? <Spin size="small"/> :
                    <Empty description={this.state.classId ? '未找到包含该信息数据' : '请输入学生姓名或学号查询'}/>
                  }
                  size="large"
                  value={classInfo.id ? `${classInfo.id}-${classInfo.start_year}-${classInfo.class_name}` : this.state.classId}
                  filterOption={false}
                  onSearch={(value) => this.getClassList(value)}
                  onChange={(classId) => this.setState({ classId })}
                >
                  {classList.map((stuClass) => (
                    <Option
                      onClick={(value) => this.getClassInfo(value.key)}
                      value={stuClass.id}
                      key={`stuClass-${stuClass.id}`}
                    >
                      {`${stuClass.id}-${stuClass.start_year}-${stuClass.class_name}`}
                    </Option>
                  ))}
                </Select>
              </Affix>
              {classInfo && classInfo.id ? (
                <Fragment>
                  <Divider style={{ marginTop: 16 }} dashed/>
                  <div className={styles.avatarHolder}>
                    <div className={styles.name}>{classInfo.class_name}</div>
                    {isAtSchool ? <Tag color="#2db7f5">在校班级</Tag> :
                      <Tag color="#f50">过往班级</Tag>}
                  </div>
                  {/*班级详细信息，拟计划有校区，所处学年，共有学生人数，及分布情况*/}
                  <div className={styles.detail}>
                    <p><i className={`fa fa-group ${styles.iconStyle}`}/>
                      {CLASS_CAMPUS_CHOICE[classInfo.campus_name]}
                    </p>
                    <p><i className={`fa fa fa-archive ${styles.iconStyle}`}/>
                      {`${classInfo.start_year}-${classInfo.start_year + 1} 学年`}
                    </p>
                    <Divider style={{ marginTop: 16 }} dashed/>
                    <div className={styles.teamTitle}>学生分布</div>
                    <Row type="flex" justify="start">
                      <Col>
                        <Statistic title="共有学生" value={`${total}人`} valueStyle={{ color: '#cf1322' }}/>
                      </Col>
                    </Row>
                    {isAtSchool ?
                      <Row type="flex" justify="space-between" style={{ marginTop: 10 }}>
                        <Col span={6}><Statistic title="男生" value={boy} suffix={`/${total}`}/></Col>
                        <Col span={6}><Statistic title="女生" value={total - boy} suffix={`/${total}`}/></Col>
                        <Col span={6}><Statistic title="走读生" value={total - stay} suffix={`/${total}`}/></Col>
                        <Col span={6}><Statistic title="住校生" value={stay} suffix={`/${total}`}/></Col>
                        <Col span={6}><Statistic title="本地生源" value={local} suffix={`/${total}`}/></Col>
                        <Col span={6}><Statistic title="外地生源" value={total - local} suffix={`/${total}`}/></Col>
                        <Col span={6}><Statistic title="团员/党员" value={policy} suffix={`/${total}`}/></Col>
                        <Col span={6}><Statistic title="其他面貌" value={total - policy} suffix={`/${total}`}/></Col>
                      </Row> : <Empty description='班级学生分布数据缺失'/>
                    }
                  </div>
                  {defaultTab !== 'Trend' && <Fragment>
                    <Divider dashed/>
                    <Chart
                      height={400}
                      scale={{
                        'score': {
                          min: 0,
                          max: 100,
                          tickCount: 5
                        }
                      }}
                      data={radarViewData}
                      padding={[20, 20, 95, 20]}
                      forceFit
                      loading={radarLoading}
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
                    <div className={styles.teamTitle}>老师信息</div>
                    <Row gutter={36}>
                      {teachers.map(item => (
                        <Col key={`teacher-${item.id}`} lg={24} xl={12}>
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
              <Tabs defaultActiveKey={defaultTab} onChange={this.onTabChange}>
                <TabPane tab={<span><Icon type="line-chart"/>成绩趋势显示</span>} key="Trend">
                  {classInfo && classInfo.id ?
                    <Fragment>
                      <Card title={`${classInfo.class_name}考试得分趋势变化`} bordered={false}>
                        <Affix offsetTop={10} style={{ 'zIndex': 1 }}>
                          <Select
                            value={this.state.scoreType} style={{ width: 120 }}
                            onChange={this.onScoreTypeChange}
                          >
                            {/*todo 修改为只有绝对分和排名*/}
                            <Option key="score" value="score">绝对分</Option>
                            <Option key="z_score" value="z_score">离均值(Z分)</Option>
                            <Option key="t_score" value="t_score">标准分(T分)</Option>
                            <Option key="deng_di" value="deng_di">等第</Option>
                          </Select>
                        </Affix>
                        <Suspense fallback={<div>Loading...</div>}>
                          <ScoreTrendChart
                            lineData={totalTrend}
                            radarViewData={radarViewData}
                            subData={subData}
                          />
                        </Suspense>
                      </Card>
                      <Table
                        rowKey={record => record.index}
                        columns={columns}
                        dataSource={classData}
                        scroll={{ x: 1400 }}
                        pagination={{
                          style: { marginBottom: 0, marginTop: 24 },
                          pageSize: 5,
                        }}
                      />
                    </Fragment> : <Empty description='请在左侧搜索框中搜索班级数据'/>
                  }
                </TabPane>
                <TabPane tab={<span><Icon type="copy" />具体考试分析</span>} key="Specific">
                  <Affix offsetTop={10} style={{ 'zIndex': 1 }}>
                    <Select
                      showSearch
                      optionFilterProp="children"
                      style={{ width: 200 }}
                      onChange={handleChange}
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
                  {classInfo && classInfo.id ?
                    <div>
                      <Card title="本次考试排名一览" style={{ marginTop: 12 }}>
                        <Row>
                          <Statistic title="本次排名" value={5} suffix="/ 12" valueStyle={{ color: '#cf1322' }}/>
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
                      <Card title="本次考试该班学生成绩与排名" style={{ marginTop: 12 }}>
                        <Table
                          rowKey={record => record.index}
                          columns={columns}
                          dataSource={classData}
                          scroll={{ x: 1400 }}
                          pagination={{
                            style: { marginBottom: 0, marginTop: 24 },
                            pageSize: 5,
                          }}
                        />
                      </Card>
                      <Card title="年级其他班成绩对比分析" style={{ marginTop: 12 }}>
                        <Row type='flex' justify="end">
                          <Affix offsetTop={10}>
                            <Select
                              defaultValue="语文" style={{ width: "100%" }} onChange={handleChangeSubject}>
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
                            <Select defaultValue="绝对分" style={{ width: "100%" }} onChange={handleChangeSubject}>
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
                          <Tooltip/>
                          <Legend/>
                          <Geom type="interval" position="className*score"/>
                          {/*todo 只有选择的是绝对分和总分才显示辅助线*/}
                          <Guide>
                            <Line
                              top={true}
                              start={[-1, 588]} // 辅助线起始位置，值为原始数据值，支持 callback
                              end={['max', 588]}
                              lineStyle={{
                                stroke: '#999', // 线的颜色
                                lineDash: [0, 2, 2],
                                lineWidth: 2
                              }}
                              text={{
                                position: 'start',
                                content: "2018 一段线 588", // 文本的内容
                                style: {
                                  Rotate: 90,
                                }
                              }}
                            />
                            <Line
                              top={true}
                              start={[-1, 490]} // 辅助线起始位置，值为原始数据值，支持 callback
                              end={['max', 490]}
                              lineStyle={{
                                stroke: '#999', // 线的颜色
                                lineDash: [0, 2, 2], // 虚线的设置
                                lineWidth: 2 // 线的宽度
                              }} // 图形样式配置
                              text={{
                                position: 'start',
                                content: "2018 二段线 490", // 文本的内容
                                style: {
                                  Rotate: 90,
                                }
                              }}
                            />
                            <Line
                              top={true}
                              start={[-1, 344]} // 辅助线起始位置，值为原始数据值，支持 callback
                              end={['max', 344]}
                              lineStyle={{
                                stroke: '#999', // 线的颜色
                                lineDash: [0, 2, 2], // 虚线的设置
                                lineWidth: 2 // 线的宽度
                              }} // 图形样式配置
                              text={{
                                position: 'start',
                                content: "2018 三段线 344", // 文本的内容
                                style: {
                                  Rotate: 90,
                                }
                              }}
                            />
                            <Line
                              top={true}
                              start={[-1, 577]} // 辅助线起始位置，值为原始数据值，支持 callback
                              end={['max', 577]}
                              lineStyle={{
                                stroke: '#999', // 线的颜色
                                lineDash: [0, 2, 2], // 虚线的设置
                                lineWidth: 1 // 线的宽度
                              }} // 图形样式配置
                              text={{
                                position: 'start',
                                content: "2017 一段线 577", // 文本的内容
                                style: {
                                  Rotate: 90,
                                }
                              }}
                            />
                            <Line
                              top={true}
                              start={[-1, 480]} // 辅助线起始位置，值为原始数据值，支持 callback
                              end={['max', 480]}
                              lineStyle={{
                                stroke: '#999', // 线的颜色
                                lineDash: [0, 2, 2], // 虚线的设置
                                lineWidth: 1 // 线的宽度
                              }} // 图形样式配置
                              text={{
                                position: 'start',
                                content: "2017 二段线 480", // 文本的内容
                                style: {
                                  Rotate: 90,//todo 旋转角度，没变化
                                }
                              }}
                            />
                            <Line
                              top={true}
                              start={[-1, 359]} // 辅助线起始位置，值为原始数据值，支持 callback
                              end={['max', 359]}
                              lineStyle={{
                                stroke: '#999', // 线的颜色
                                lineDash: [0, 2, 2], // 虚线的设置
                                lineWidth: 1 // 线的宽度
                              }} // 图形样式配置
                              text={{
                                position: 'start',
                                content: "2017 三段线 359", // 文本的内容
                                style: {
                                  Rotate: 90,
                                }
                              }}
                            />
                          </Guide>
                        </Chart>
                        <Chart height={400} data={cdv} forceFit>
                          <Legend/>
                          <Coord transpose/>
                          <Axis
                            name="State"
                            label={{
                              offset: 12
                            }}
                          />
                          <Axis name="人数"/>
                          <Tooltip/>
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
                <TabPane tab={<span><i className={`fa fa-calendar-check-o`}/> 考勤情况显示</span>} key="Attendance">
                  <Suspense fallback={<Spin className='center'/>}>
                    <ClassAttendanceChart
                      loading={kaoqinLoading}
                      kaoqinData={kaoQinData}
                      termList={termList}
                      kaoqinSummary={kaoqinSummary}
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

export default ClassAnalysis;


