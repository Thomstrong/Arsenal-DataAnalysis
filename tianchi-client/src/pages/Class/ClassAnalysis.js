import React, { Fragment, PureComponent, Suspense } from 'react';
import { connect } from 'dva';
import {
  CLASS_CAMPUS_CHOICE,
  COURSE_FULLNAME_ALIAS,
  GAOKAO_COURSES,
  LINE_INDEX_ALIAS,
  LINE_SCORE,
  RANGE_ALIAS,
  SCORE_LEVEL_ALIAS
} from "@/constants";
import router from 'umi/router';
import _ from 'lodash';
import {
  Affix,
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Empty,
  Icon,
  Input,
  Row,
  Select,
  Spin,
  Statistic,
  Table,
  Tabs,
  Tag
} from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import styles from './ClassAnalysis.less';
import { Axis, Chart, Coord, Geom, Guide, Legend, Tooltip } from "bizcharts";
import DataSet from "@antv/data-set";
import moment from "moment";
import Highlighter from 'react-highlight-words';

const ScoreTrendChart = React.lazy(() => import('./ScoreTrendChart'));
const ClassAttendanceChart = React.lazy(() => import('./ClassAttendanceChart'));

const TabPane = Tabs.TabPane;
const Option = Select.Option;
const Line = Guide.Line;


@connect(({ loading, stuClass, global }) => ({
  stuClass,
  loading: loading.effects['stuClass/fetchBasic'],
  classListLoading: loading.effects['stuClass/fetchClassList'],
  radarLoading: loading.effects['stuClass/fetchRadarData'],
  kaoqinLoading: loading.effects['stuClass/fetchKaoqinData'],
  termMap: global.termMap,
  termList: stuClass.termList,
  studentsList: stuClass.studentsList,
}))
class ClassAnalysis extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      classId: props.match.params.classId,
      scoreType: 'score',
      dateRange: 7,
      pickedDate: moment().format('YYYY-MM-DD'),
      searchText: '',
      courseId: -1,
      examId: '',
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
    const { dispatch, termMap } = this.props;
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
    dispatch({
      type: 'stuClass/fetchKaoqinData',
      payload: {
        classId,
        termMap
      }
    });
    dispatch({
      type: 'stuClass/fetchClassExamList',
      payload: {
        classId,
      }
    });
    this.setState({
      classId,
      examId: ''
    });
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

  // 更改考试选项后的重新rander
  onExamChanged = (examId) => {
    if (!examId) {
      return;
    }
    const { dispatch, stuClass } = this.props;
    dispatch({
      type: 'stuClass/fetchExamRank',
      payload: {
        classId: stuClass.classInfo.id,
        examId
      }
    });
    dispatch({
      type: 'stuClass/fetchExamRecords',
      payload: {
        classId: stuClass.classInfo.id,
        examId
      }
    });
    dispatch({
      type: 'stuClass/fetchScoreDistribution',
      payload: {
        classId: stuClass.classInfo.id,
        examId
      }
    });
    this.setState({ examId });
  };

  //table姓名可搜索部分相关代码
  getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters, }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={node => {
            this.searchInput = node;
          }}
          placeholder="搜索"
          value={selectedKeys[0]}
          onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => this.handleSearch(selectedKeys, confirm)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => this.handleSearch(selectedKeys, confirm)}
          icon="search"
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          搜索
        </Button>
        <Button
          onClick={() => this.handleReset(clearFilters)}
          size="small"
          style={{ width: 90 }}
        >
          重置
        </Button>
      </div>
    ),
    filterIcon: filtered => <Icon type="search" style={{ color: filtered ? '#1890ff' : undefined }}/>,
    onFilter: (value, record) => record[dataIndex].toString().includes(value),
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => this.searchInput.select());
      }
    },
    render: (text) => (
      <Highlighter
        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
        searchWords={[this.state.searchText]}
        autoEscape
        textToHighlight={text.toString()}
      />
    ),
  });

  handleSearch = (selectedKeys, confirm) => {
    confirm();
    this.setState({ searchText: selectedKeys[0] });
  };

  handleReset = (clearFilters) => {
    clearFilters();
    this.setState({ searchText: '' });
  };


  render() {
    const {
      stuClass, classListLoading, loading,
      match, radarLoading, kaoqinLoading,
      termList, studentsList
    } = this.props;

    const {
      distributionData, classInfo, teachers,
      classList, radarData, totalTrend,
      subTrends, kaoqinSummary, kaoqinData, classExamList,
      courseRankData, scoreData, classMap,
      examRecords, overLineCounter, scoreDistributionData,
    } = stuClass;
    const { courseId, examId } = this.state;
    const showedScoreData = scoreData[Number(courseId)] ? scoreData[Number(courseId)].map(data => {
      return {
        name: classMap[Number(data.classId)],
        score: Number(data.score.toFixed(3))
      };
    }) : [];
    const showedDistributeData = scoreDistributionData[Number(courseId)] ? scoreDistributionData[Number(courseId)].map(data => {
      return {
        name: classMap[Number(data.classId)],
        range: RANGE_ALIAS[data.maxScore],
        count: Number(data.count)
      };
    }) : [];
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

    //table的格式
    const tableColumns = [
      {
        title: '最新排名',
        dataIndex: 'rank',
        key: 'rank',
        sorter: (a, b) => a.rank - b.rank,
        width: 150,
        fixed: 'left',
        align: 'center',
      },
      {
        title: '学生姓名',
        dataIndex: 'name',
        key: 'name',
        width: 150,
        fixed: 'left',
        align: 'center',
        ...this.getColumnSearchProps('name'),
      },
      ...GAOKAO_COURSES.map((courseId) => {
        return {
          title: `${COURSE_FULLNAME_ALIAS[courseId]}成绩`,
          dataIndex: courseId,
          key: courseId,
          sorter: (a, b) => a[courseId] - b[courseId],
          width: 120,
          align: 'center',
        };
      }),
      {
        title: '总分',
        dataIndex: 'total',
        key: 'count',
        sorter: (a, b) => a.total - b.total,
        className: styles.alignRight,
        width: 100,
        fixed: 'right'
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
                    <Empty description={this.state.classId ? '未找到包含该信息数据' : '请输入班级名或序列号查询'}/>
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
                  <div className={styles.teacherInfo}>
                    <div className={styles.infoTitle}>教师信息</div>
                    <Row gutter={36}>
                      {teachers.map(item => (
                        <Col className={styles.infoItem} key={`teacher-${item.id}`} lg={22} xl={10}>
                          <Avatar size={32}><b>{item.courseName}</b></Avatar>
                          {item.name}
                        </Col>
                      ))}
                    </Row>
                  </div>
                </Fragment>
              ) : <Empty description='请在上面👆搜索框中搜索班级信息！'/>}
            </Card>
          </Col>
          {/*分为三个部分，分别是考试趋势显示和具体考试分析和考勤情况*/}
          <Col lg={17} md={24}>
            <Card
              className={styles.tabsCard}
              bordered={false}
            >
              <Tabs defaultActiveKey={defaultTab} onChange={this.onTabChange}>
                {/*各科成绩趋势的变化*/}
                <TabPane tab={<span><Icon type="line-chart"/>成绩趋势显示</span>} key="Trend">
                  {classInfo && classInfo.id ?
                    <Fragment>
                      <Card title={`${classInfo.class_name}考试得分趋势变化`} bordered={false}>
                        <Affix offsetTop={10} style={{ 'zIndex': 1 }}>
                          <Select
                            value={this.state.scoreType} style={{ width: 120 }}
                            onChange={this.onScoreTypeChange}
                          >
                            <Option key="score" value="score">绝对分</Option>
                            <Option key="rank" value="rank">排名(todo)</Option>
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
                    </Fragment> : <Empty description='请在左侧搜索框中搜索班级数据'/>
                  }
                </TabPane>
                {/*某次具体考试的具体情况*/}
                <TabPane tab={<span><Icon type="copy"/>具体考试分析</span>} key="Specific">
                  {classInfo && classInfo.id && <Affix offsetTop={10} style={{ 'zIndex': 1 }}>
                    <Select
                      showSearch
                      optionFilterProp="children"
                      style={{ width: 300 }}
                      value={this.state.examId}
                      onChange={this.onExamChanged}
                      filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
                      placeholder="请选择该班级参与的考试"
                    >
                      {classExamList.map((item) => (
                        <Option key={`classExam-${item.id}`} value={item.id}>{item.name}</Option>
                      ))}
                    </Select>
                  </Affix>}
                  {examId ?
                    <Fragment>
                      {courseRankData.totalRank && <Card title="本次考试排名一览" style={{ marginTop: 12 }}>
                        <Row style={{ marginBottom: 10 }}>
                          <Statistic
                            title="本次排名" value={courseRankData.classNum - courseRankData.totalRank}
                            suffix={`/${courseRankData.classNum}`}
                            valueStyle={{ color: '#cf1322' }}
                          />
                        </Row>
                        <Row gutter={16} type="flex" justify="start" style={{ marginBottom: 10 }}>
                          {overLineCounter.map((count, index) => (
                            <Col key={LINE_INDEX_ALIAS[index]}>
                              <Statistic title={`超过${LINE_INDEX_ALIAS[index]}(${LINE_SCORE[index]})人数`} value={count}/>
                            </Col>))}
                        </Row>
                        <Row type="flex" justify="space-between">
                          {courseRankData.rankData.map((data) => (
                            <Col key={`examrank-${data.course}`}>
                              <Statistic title={data.course} value={courseRankData.classNum - data.rank}/>
                            </Col>))}
                        </Row>
                      </Card>}
                      {examRecords && !!examRecords.length &&
                      <Card title="本次考试该班学生成绩与排名" style={{ marginTop: 12 }}>
                        <Table
                          bordered
                          rowKey={record => record.index}
                          columns={tableColumns}
                          dataSource={examRecords}
                          scroll={{ x: 1600, y: 300 }}
                          pagination={false}
                        />
                      </Card>}
                      {showedScoreData && <Card title="年级其他班成绩对比分析" style={{ marginTop: 12 }}>
                        <Row type='flex' justify="end">
                          <Affix offsetTop={10}>
                            <Select
                              value={String(courseId)} style={{ width: "100%" }}
                              onChange={(courseId) => this.setState({ courseId })}>
                              {Object.keys(scoreData).sort().map((id) => <Option
                                key={`course-selection-${id}`}
                                value={id}
                              >
                                {COURSE_FULLNAME_ALIAS[id] ? COURSE_FULLNAME_ALIAS[id] : '总分'}
                              </Option>)}
                            </Select>
                          </Affix>
                        </Row>
                        <Chart
                          height={400}
                          data={showedScoreData}
                          forceFit
                        >
                          <Coord transpose/>
                          <Axis
                            name="name"
                            label={{
                              offset: 12
                            }}
                          />
                          <Axis name="score"/>
                          <Tooltip/>
                          <Geom
                            type="interval"
                            position="name*score"
                            color={['name', (name) => {
                              if (name === classInfo.class_name)
                                return '#fbd436';
                              else
                                return '#39a1ff';
                            }]}
                          />
                          {courseId === -1 && <Guide>
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
                          </Guide>}
                        </Chart>
                        {this.state.courseId !== -1 && <Chart height={400} data={showedDistributeData} forceFit>
                          <Legend/>
                          <Coord transpose/>
                          <Axis
                            name="name"
                            label={{
                              offset: 12
                            }}
                          />
                          <Axis name="count"/>
                          <Tooltip/>
                          <Geom
                            type="intervalStack"
                            position="name*count"
                            color={"range"}
                          />
                        </Chart>}
                      </Card>}
                    </Fragment> : <Empty description={classInfo.id ? `请选择需要分析的考试名称` : `请在左侧搜索班级信息`}/>
                  }
                </TabPane>
                {/*考勤情况*/}
                {/*todo 文字分析部分加上该班级违纪最多的同学，及具体信息*/}
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


