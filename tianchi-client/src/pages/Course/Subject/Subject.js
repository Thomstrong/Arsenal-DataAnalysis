/**
 * Created by 胡晓慧 on 2019/4/16.
 */
//具体科目的分析,用户可以选择学年,呈现出该学年,该学科,不同班级每次考试的成绩分布

import React, { PureComponent } from 'react';
import { COURSE_FULLNAME_ALIAS, GAOKAO_COURSES, POLICY_TYPE_ALIAS, SEX_MAP } from "@/constants";
import { Affix, Card, Col, Row, Select } from 'antd';
import { Axis, Chart, Geom, Legend, Tooltip } from "bizcharts";
import { connect } from "dva";

const { Option } = Select;

@connect(({ loading, course }) => ({
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

  render() {
    const { loading, course } = this.props;
    const { classExamData } = course;
    return (
      <div>
        <Card title="各班某年某科目成绩统计" bordered={true} style={{ width: '100%' }}>
          <Row type="flex" justify="end" style={{ padding: 10 }}>
            <Affix offsetTop={80} style={{ 'zIndex': 1 }}>
              <Col span={10} style={{ display: 'inline-flex' }}>
                <Select
                  loading={loading} disabled={loading} value={this.state.term}
                  style={{ width: 170 }} onChange={this.handleTermChanged}
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
                  style={{ width: "100%" }} onChange={this.handleGradeChanged}
                >
                  <Option key="grade-option-1" value={1}>高一</Option>
                  <Option key="grade-option-2" value={2}>高二</Option>
                  <Option key="grade-option-3" value={3}>高三</Option>
                </Select>
                {/*todo 有一个问题,除了常见学科外,一些特殊学科实际上与学年有关*/}
                <Select
                  loading={loading} disabled={loading} value={this.state.course}
                  style={{ width: "100%" }} onChange={this.handleCourseChanged}
                >
                  {GAOKAO_COURSES.map(course => <Option key={`course-option-${course}`} value={course}>
                    {COURSE_FULLNAME_ALIAS[course]}
                  </Option>)}
                </Select>
              </Col>
            </Affix>
          </Row>
          <Row style={{ padding: 10 }}>
            <Col span={18}>
              <Card type="inner" title="各班某年某科目最高分统计" bordered={true} style={{ width: '100%' }} hoverable={true}>
                <Chart height={400} data={classExamData.highest} forceFit>
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
                  />
                </Chart>
              </Card>
            </Col>
            <Col span={5} offset={1}>
              <Card title='总结' bordered={false} hoverable={true}>
                <p>xxxx学年xxx学科,历史最高分出现在xx考试的xx班级</p>
                <p>男女比相近</p>
              </Card>
            </Col>
          </Row>
          <Row style={{ padding: 10 }}>
            <Col span={5}>
              <Card title='总结' bordered={false} hoverable={true}>
                <p>xxxx学年xxx学科,历史最高分出现在xx考试的xx班级</p>
                <p>男女比相近</p>
              </Card>
            </Col>
            <Col span={18} offset={1}>
              <Card type="inner" title="各班某年某科目平均分统计" bordered={true} style={{ width: '100%' }} hoverable={true}>
                <Chart height={400} data={classExamData.average} forceFit>
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
                  />
                </Chart>
              </Card>
            </Col>
          </Row>
          <Row style={{ padding: 10 }}>
            <Col span={18}>
              <Card type="inner" title="各班某年某科目最低分统计" bordered={true} style={{ width: '100%' }} hoverable={true}>
                <Chart height={400} data={classExamData.lowest} forceFit>
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
                  />
                </Chart>
              </Card>
            </Col>
            <Col span={5} offset={1}>
              <Card title='总结' bordered={false} hoverable={true}>
                <p>xxxx学年xxx学科,历史最低分出现在xx考试的xx班级</p>
                <p>男女比相近</p>
              </Card>
            </Col>
          </Row>
        </Card>
      </div>
    );
  }
}

export default Subject;
