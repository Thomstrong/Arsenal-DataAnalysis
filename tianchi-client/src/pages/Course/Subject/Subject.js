/**
 * Created by 胡晓慧 on 2019/4/16.
 */
//具体科目的分析,用户可以选择学年,呈现出该学年,该学科,不同班级每次考试的成绩分布

import React, { PureComponent } from 'react';
import { COURSE_FULLNAME_ALIAS, GAOKAO_COURSES, GRADE_ALIAS, POLICY_TYPE_ALIAS, SEX_MAP } from "@/constants";
import { Affix, BackTop, Card, Col, Row, Select, Typography } from 'antd';
import { Axis, Chart, Geom, Legend, Tooltip } from "bizcharts";
import { connect } from "dva";

const { Paragraph, Text } = Typography;

const { Option } = Select;

@connect(({ loading, course }) => ({
  course,
  loading: loading.effects['course/fetchClassExamData'],
}))
class Subject extends PureComponent {
  constructor(props, context) {
    super(props, context);
    this.state = {
      term: props.course.subjectYear || 2018,
      grade: props.course.subjectGrade || 3,
      course: props.course.subjectCourse || 3
    };
  }

  componentDidMount() {
    if (this.props.course.classExamData.highest.length) {
      return;
    }
    this.fetchClassExam(
      this.state.term, this.state.grade, this.state.course
    );
  }

  fetchClassExam = (term, grade, course) => {
    const { dispatch } = this.props;
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
    this.setState({ term });
  };

  handleGradeChanged = (grade) => {
    this.fetchClassExam(
      this.state.term, grade, this.state.course
    );
    this.setState({ grade });
  };

  handleCourseChanged = (course) => {
    this.fetchClassExam(
      this.state.term, this.state.grade, course
    );
    this.setState({ course });
  };

  compare(property) {
    return function (a, b) {
      var value1 = a[property];
      var value2 = b[property];
      return value2 - value1;
    };
  }

  render() {
    const { loading, course } = this.props;
    const { classExamData, classExamSummary } = course;

    return (
      <Card title="各班某年某科目成绩统计" bordered={true} style={{ width: '100%' }}>
        <BackTop/>
        <Row type="flex" justify="end" style={{ padding: 10 }}>
          <Affix offsetTop={16} style={{ 'zIndex': 2 }}>
            <Col span={10} style={{ display: 'inline-flex' }}>
              <div style={{ backgroundColor: 'white', display: 'inline-flex' }}>
                <Select
                  loading={loading} disabled={loading} value={this.state.term}
                  style={{ width: 170, marginRight: '20px' }} onChange={this.handleTermChanged}
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
                  style={{ width: "100%", marginRight: '20px' }} onChange={this.handleGradeChanged}
                >
                  <Option key="grade-option-1" value={1}>高一</Option>
                  <Option key="grade-option-2" value={2}>高二</Option>
                  <Option key="grade-option-3" value={3}>高三</Option>
                </Select>
                <Select
                  loading={loading} disabled={loading} value={this.state.course}
                  style={{ width: "100%" }} onChange={this.handleCourseChanged}
                >
                  {GAOKAO_COURSES.map(course => <Option key={`course-option-${course}`} value={course}>
                    {COURSE_FULLNAME_ALIAS[course]}
                  </Option>)}
                </Select>
              </div>
            </Col>
          </Affix>
        </Row>
        <Row style={{ padding: 10 }} type="flex" align="middle">
          <Col xl={18} xs={24}>
            <Card type="inner" title="各班某年某科目最高分统计" bordered={true} style={{ width: '100%' }} hoverable={true}>
              <Chart height={400} data={classExamData.highest} padding='auto' forceFit>
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
          <Col xl={{ span: 5, offset: 1 }} xs={24}>
            <Card bordered={false} hoverable={true} style={{ cursor: "auto" }}>
              <Paragraph><Text type="danger">{this.state.term}-{this.state.term + 1}</Text>学年<Text
                type="danger">{GRADE_ALIAS[this.state.grade]}</Text>
                <Text type="danger">{COURSE_FULLNAME_ALIAS[this.state.course]}</Text>:</Paragraph>
              <Paragraph>最高分出现在<Text type="danger">{classExamSummary.highestExam}</Text>的<Text
                type="danger">{classExamSummary.highestClass}班</Text>,
                为<Text type="danger">{classExamSummary.highestScore}</Text>分</Paragraph>
            </Card>
          </Col>
        </Row>
        <Row style={{ padding: 10 }} type="flex" align="middle">
          <Col xl={5} xs={24}>
            <Card bordered={false} hoverable={true} style={{ cursor: "auto" }}>
              <Paragraph><Text type="danger">{this.state.term}-{this.state.term + 1}</Text>学年<Text
                type="danger">{GRADE_ALIAS[this.state.grade]}</Text>
                <Text type="danger">{COURSE_FULLNAME_ALIAS[this.state.course]}</Text>:</Paragraph>
              <Paragraph> 平均分最<Text type="danger">高</Text>出现在<Text
                type="danger">{classExamSummary.averageHighExam}</Text>的<Text
                type="danger">{classExamSummary.averageHighClass}班</Text>,
                为<Text type="danger">{classExamSummary.averageHighScore}</Text>分;</Paragraph>
              <Paragraph> 平均分最<Text type="danger">低</Text>出现在<Text
                type="danger">{classExamSummary.averageLowExam}</Text>的<Text
                type="danger">{classExamSummary.averageLowClass}班</Text>,
                为<Text type="danger">{classExamSummary.averageLowScore}</Text>分</Paragraph>
            </Card>
          </Col>
          <Col xl={{ span: 18, offset: 1 }} xs={24}>
            <Card type="inner" title="各班某年某科目平均分统计" bordered={true} style={{ width: '100%' }} hoverable={true}>
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
        <Row style={{ padding: 10 }} type="flex" align="middle">
          <Col xl={18} xs={24}>
            <Card type="inner" title="各班某年某科目最低分统计" bordered={true} style={{ width: '100%' }} hoverable={true}>
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
          <Col xl={{ span: 5, offset: 1 }} xs={24}>
            <Card bordered={false} hoverable={true} style={{ cursor: "auto" }}>
              <Paragraph><Text type="danger">{this.state.term}-{this.state.term + 1}</Text>学年<Text
                type="danger">{GRADE_ALIAS[this.state.grade]}</Text>
                <Text type="danger">{COURSE_FULLNAME_ALIAS[this.state.course]}</Text>:</Paragraph>
              <Paragraph>年级段最<Text type="danger">低</Text>分出现在
                <Text type="danger">{classExamSummary.lowestExam}</Text>的<Text
                  type="danger">{classExamSummary.lowestClass}班</Text>,
                为<Text type="danger">{classExamSummary.lowestScore}</Text>分</Paragraph>
            </Card>
          </Col>
        </Row>
      </Card>
    );
  }
}

export default Subject;
