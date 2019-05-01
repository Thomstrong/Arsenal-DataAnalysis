/**
 * Created by 胡晓慧 on 2019/4/16.
 */
//具体科目的分析,用户可以选择学年,呈现出该学年,该学科,不同班级每次考试的成绩分布

import React, {PureComponent} from 'react';
import {COURSE_FULLNAME_ALIAS, GAOKAO_COURSES, POLICY_TYPE_ALIAS, SEX_MAP} from "@/constants";
import {Affix, Card, Col, Row, Select, Typography} from 'antd';
import {Axis, Chart, Geom, Legend, Tooltip} from "bizcharts";
import {connect} from "dva";

const {Paragraph, Text} = Typography;

const {Option} = Select;

@connect(({loading, course}) => ({
  course,
  loading: loading.effects['course/fetchClassExamData'],
}))
class Subject extends PureComponent {
  constructor() {
    super();
    this.state = {
      term: 2018,
      grade: 3,
      course: 1
    };
  }

  componentDidMount() {
    this.fetchClassExam(
      this.state.term, this.state.grade, this.state.course
    );
  }

  fetchClassExam = (term, grade, course) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'course/fetchClassExamData',
      payload: {
        startYear: term,
        grade,
        course
      }
    });
  };
  handleTermChanged = (term) => {
    this.fetchClassExam(
      term, this.state.grade, this.state.course
    );
    this.setState({term});
  };

  handleGradeChanged = (grade) => {
    this.fetchClassExam(
      this.state.term, grade, this.state.course
    );
    this.setState({grade});
  };

  handleCourseChanged = (course) => {
    this.fetchClassExam(
      this.state.term, this.state.grade, course
    );
    this.setState({course});
  };

  compare(property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value2 - value1;
    }
  }

  render() {
    const {loading, course} = this.props;
    const {classExamData} = course;

    const classExamDataCopy = classExamData;
    let highestClass = "";
    let highestExam = "";
    let highestScore = 0;
    let averageHighClass = "";
    let averageHighExam = "";
    let averageHighScore = 0;
    let averageLowClass = "";
    let averageLowExam = "";
    let averageLowScore = 0;
    let lowestClass = "";
    let lowestExam = "";
    let lowestScore = 0;

    if (classExamDataCopy.highest.length) {
      length = classExamDataCopy.highest.length;
      classExamDataCopy.highest.sort(this.compare('score'));
      highestClass = classExamDataCopy.highest[0].stuClass;
      highestExam = classExamDataCopy.highest[0].exam;
      highestScore = classExamDataCopy.highest[0].score;
      classExamDataCopy.average.sort(this.compare('score'));
      averageHighClass = classExamDataCopy.average[0].stuClass;
      averageHighExam = classExamDataCopy.average[0].exam;
      averageHighScore = classExamDataCopy.average[0].score;
      averageLowClass = classExamDataCopy.average[length - 1].stuClass;
      averageLowExam = classExamDataCopy.average[length - 1].exam;
      averageLowScore = classExamDataCopy.average[length - 1].score;
      classExamDataCopy.lowest.sort(this.compare('score'));
      lowestClass = classExamDataCopy.lowest[length - 1].stuClass;
      lowestExam = classExamDataCopy.lowest[length - 1].exam;
      lowestScore = classExamDataCopy.lowest[length - 1].score;
    }


    return (
      <div>
        <Card title="各班某年某科目成绩统计" bordered={true} style={{width: '100%'}}>
          <Row type="flex" justify="end" style={{padding: 10}}>
            <Affix offsetTop={80} style={{'zIndex': 1}}>
              <Col span={10} style={{display: 'inline-flex'}}>
                <Select
                  loading={loading} disabled={loading} value={this.state.term}
                  style={{width: 170}} onChange={this.handleTermChanged}
                >
                  <Option key="term-option-2013" value={2013}>2013-2014学年</Option>
                  <Option key="term-option-2014" value={2014}>2014-2015学年</Option>
                  <Option key="term-option-2015" value={2015}>2015-2016学年</Option>
                  <Option key="term-option-2016" value={2016}>2016-2017学年</Option>
                  <Option key="term-option-2017" value={2017}>2017-2018学年</Option>
                  <Option key="term-option-2018" value={2018}>2018-2019学年</Option>
                </Select>
                <Select
                  loading={loading} disabled={loading} value={this.state.grade}
                  style={{width: "100%"}} onChange={this.handleGradeChanged}
                >
                  <Option key="grade-option-1" value={1}>高一</Option>
                  <Option key="grade-option-2" value={2}>高二</Option>
                  <Option key="grade-option-3" value={3}>高三</Option>
                </Select>
                {/*todo 有一个问题,除了常见学科外,一些特殊学科实际上与学年有关*/}
                <Select
                  loading={loading} disabled={loading} value={this.state.course}
                  style={{width: "100%"}} onChange={this.handleCourseChanged}
                >
                  {GAOKAO_COURSES.map(course => <Option key={`course-option-${course}`} value={course}>
                    {COURSE_FULLNAME_ALIAS[course]}
                  </Option>)}
                </Select>
              </Col>
            </Affix>
          </Row>
          <Row style={{padding: 10}} type="flex" align="middle">
            <Col xl={18} xs={24}>
              <Card type="inner" title="各班某年某科目最高分统计" bordered={true} style={{width: '100%'}} hoverable={true}>
                <Chart height={400} data={classExamData.highest} padding="auto" forceFit>
                  <Legend/>
                  <Axis name="exam"/>
                  <Axis
                    name="score"
                  />
                  <Tooltip
                    crosshairs={{
                      type: "y"
                    }}
                  />
                  <Geom
                    type="line"
                    position="exam*score"
                    size={2}
                    color={"stuClass"}
                    tooltip={[
                      "stuClass*score",
                      (stuClass, score) => {
                        return {
                          name: stuClass,
                          value: score + "分"
                        };
                      }
                    ]}
                  />
                  <Geom
                    type="point"
                    position="exam*score"
                    size={4}
                    shape={"circle"}
                    color={"stuClass"}
                    style={{
                      stroke: "#fff",
                      lineWidth: 1
                    }}
                    tooltip={[
                      "stuClass*score",
                      (stuClass, score) => {
                        return {
                          name: stuClass,
                          value: score + "分"
                        };
                      }
                    ]}
                  />
                </Chart>
              </Card>
            </Col>
            <Col offset={1} xl={5} xs={23}>
              <Card bordered={false} hoverable={true}>
                <Paragraph><Text type="danger">{this.state.term}-{this.state.term + 1}</Text>学年<Text
                  type="danger">高{this.state.grade}</Text>
                  <Text type="danger">{COURSE_FULLNAME_ALIAS[this.state.course]}</Text>:</Paragraph>
                <Paragraph>最高分出现在<Text type="danger">{highestExam}</Text>的<Text type="danger">{highestClass}班</Text>,
                  为<Text type="danger">{highestScore}</Text>分</Paragraph>
              </Card>
            </Col>
          </Row>
          <Row style={{padding: 10}} type="flex" align="middle">
            <Col xl={5} xs={24}>
              <Card bordered={false} hoverable={true}>
                <Paragraph><Text type="danger">{this.state.term}-{this.state.term + 1}</Text>学年<Text
                  type="danger">高{this.state.grade}</Text>
                  <Text type="danger">{COURSE_FULLNAME_ALIAS[this.state.course]}</Text>:</Paragraph>
                <Paragraph> 平均分最<Text type="danger">高</Text>出现在<Text type="danger">{averageHighExam}</Text>的<Text
                  type="danger">{averageHighClass}班</Text>,
                  为<Text type="danger">{averageHighScore}</Text>分;</Paragraph>
                <Paragraph> 平均分最<Text type="danger">低</Text>出现在<Text type="danger">{averageLowExam}</Text>的<Text
                  type="danger">{averageLowClass}班</Text>,
                  为<Text type="danger">{averageLowScore}</Text>分</Paragraph>
              </Card>
            </Col>
            <Col xl={18} xs={23} offset={1}>
              <Card type="inner" title="各班某年某科目平均分统计" bordered={true} style={{width: '100%'}} hoverable={true}>
                <Chart height={400} data={classExamData.average} padding="auto" forceFit>
                  <Legend/>
                  <Axis name="exam"/>
                  <Axis
                    name="score"
                  />
                  <Tooltip
                    crosshairs={{
                      type: "y"
                    }}
                  />
                  <Geom
                    type="line"
                    position="exam*score"
                    size={2}
                    color={"stuClass"}
                    tooltip={[
                      "stuClass*score",
                      (stuClass, score) => {
                        return {
                          name: stuClass,
                          value: score + "分"
                        };
                      }
                    ]}
                  />
                  <Geom
                    type="point"
                    position="exam*score"
                    size={4}
                    shape={"circle"}
                    color={"stuClass"}
                    style={{
                      stroke: "#fff",
                      lineWidth: 1
                    }}
                    tooltip={[
                      "stuClass*score",
                      (stuClass, score) => {
                        return {
                          name: stuClass,
                          value: score + "分"
                        };
                      }
                    ]}
                  />
                </Chart>
              </Card>
            </Col>
          </Row>
          <Row style={{padding: 10}} type="flex" align="middle">
            <Col xl={18} xs={24}>
              <Card type="inner" title="各班某年某科目最低分统计" bordered={true} style={{width: '100%'}} hoverable={true}>
                <Chart height={400} data={classExamData.lowest} padding="auto" forceFit>
                  <Legend/>
                  <Axis name="exam"/>
                  <Axis
                    name="score"
                  />
                  <Tooltip
                    crosshairs={{
                      type: "y"
                    }}
                  />
                  <Geom
                    type="line"
                    position="exam*score"
                    size={2}
                    color={"stuClass"}
                    tooltip={[
                      "stuClass*score",
                      (stuClass, score) => {
                        return {
                          name: stuClass,
                          value: score + "分"
                        };
                      }
                    ]}
                  />
                  <Geom
                    type="point"
                    position="exam*score"
                    size={4}
                    shape={"circle"}
                    color={"stuClass"}
                    style={{
                      stroke: "#fff",
                      lineWidth: 1
                    }}
                    tooltip={[
                      "stuClass*score",
                      (stuClass, score) => {
                        return {
                          name: stuClass,
                          value: score + "分"
                        };
                      }
                    ]}
                  />
                </Chart>
              </Card>
            </Col>
            <Col xl={5} xs={23} offset={1}>
              <Card bordered={false} hoverable={true}>
                <Paragraph><Text type="danger">{this.state.term}-{this.state.term + 1}</Text>学年<Text
                  type="danger">高{this.state.grade}</Text>
                  <Text type="danger">{COURSE_FULLNAME_ALIAS[this.state.course]}</Text>:</Paragraph>
                <Paragraph>年级段最<Text type="danger">低</Text>分出现在
                  <Text type="danger">{lowestExam}</Text>的<Text type="danger">{lowestClass}班</Text>,
                  为<Text type="danger">{lowestScore}</Text>分</Paragraph>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

export default Subject;
