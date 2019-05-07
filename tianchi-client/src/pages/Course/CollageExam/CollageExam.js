import React, { Fragment, PureComponent } from "react";
import { Axis, Chart, Coord, Geom, Label, Legend, Tooltip, } from "bizcharts";
import { Card, Col, Empty, Row, Typography } from "antd";
import TagCloud from '@/components/Charts/TagCloud';
import backImg from '../../../../public/tagcloud/Rectangular.jpeg';
import { connect } from "dva";
import { COURSE_FULLNAME_ALIAS } from "@/constants";

const { Paragraph, Text } = Typography;

@connect(({ course }) => ({
  subject2Major: course.subject2Major,
  majorMap: course.majorMap,
}))

class CollageExam extends PureComponent {

  componentDidMount() {
    const { dispatch, subject2Major } = this.props;

    if (!subject2Major) {
      dispatch({
        type: `course/fetchSubject2Major`,
      });
    }
  }

  render() {
    const {
      subject2Major,
      majorMap
    } = this.props;
    const collage2Subject = [
      {
        name: "化学",
        value: 6533
      },
      {
        name: "技术",
        value: 3679
      },
      {
        name: "生物",
        value: 3381
      },
      {
        name: "历史",
        value: 1145
      },
      {
        name: "地理",
        value: 1107
      },
      {
        name: "政治",
        value: 735
      },
      {
        name: "不限",
        value: 16126
      }, {
        name: "物理",
        value: 8774
      },
    ];

    return (
      <Fragment>
        <Card title="2019年高校招生指定科目情况" bordered={true} style={{ width: '100%' }}>
          {(collage2Subject && collage2Subject.length) ? <Row type="flex" align="middle">
            <Col xl={15} xs={24} md={24} lg={24}>
              <Chart
                height={400}
                data={collage2Subject}
                scale={{
                  cost: {
                    min: 0
                  }
                }}
                padding={[40, 40, 60, 40]}
                forceFit
              >
                <Coord type="polar"/>
                <Axis
                  name="value"
                  label={null}
                  tickLine={null}
                  line={{
                    stroke: "#E9E9E9",
                    lineDash: [3, 3]
                  }}
                />
                <Axis
                  name="name"
                  grid={{
                    align: "center"
                  }}
                  tickLine={null}
                  label={{
                    Offset: 10,
                    textStyle: {
                      textAlign: "center" // 设置坐标轴 label 的文本对齐方向
                    }
                  }}
                />
                <Legend name="name" itemWidth={50}/>
                <Tooltip/>
                <Geom
                  type="interval"
                  position="name*value"
                  color="name"
                  style={{
                    lineWidth: 1,
                    stroke: "#fff"
                  }}
                >
                  <Label
                    content="value"
                    offset={15}
                    textStyle={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 10
                    }}
                  />
                </Geom>
              </Chart>
            </Col>
            <Col xl={{ span: 8, offset: 1 }} xs={24} md={24} lg={24} style={{ marginTop: 10 }}>
              <Card title="总结" bordered={true} style={{ width: '100%' }} type="inner">
                <Paragraph>
                  通过搜集<Text type='danger'>1408</Text>所高校，共<Text type="danger">26650</Text>个专业的报考要求，
                  发现有大部分专业<Text type='danger'>不限制</Text>考生选课情况。</Paragraph>
                <Paragraph>对于有指定科目的专业来说，有无<Text type='danger'>物理</Text>基础是他们关注的重点。
                  对化学、技术、生物有要求的专业数量紧随其后。这也从侧面解释了传统理科选课人数居高不下的原因了</Paragraph>
              </Card>
            </Col>
          </Row> : <Empty description="暂无数据"/>}
        </Card>
        {subject2Major ? <Fragment><Row gutter={16} style={{ marginTop: 24 }}>
          {Object.keys(subject2Major).map(courseId => {
            return <Col
              key={`course-major-col-${courseId}`}
              xl={6} lg={12} sm={12} xs={12} style={{ marginBottom: 24 }}
            >
              <Card
                key={`course-major-card-${courseId}`}
                title={COURSE_FULLNAME_ALIAS[Number(courseId)]}
                bordered={false}
                bodyStyle={{ overflow: 'hidden' }}
              >
                <TagCloud
                  key={`course-major-cloud-${courseId}`}
                  repeat={false}
                  data={subject2Major[courseId].map(data => {
                    return {
                      name: majorMap[data[0]],
                      value: data[1]
                    };
                  })}
                  height={161}
                  imgUrl={backImg}
                />
              </Card>
            </Col>;
          })}
        </Row>
          <Card title="总结" bordered={true} style={{ width: '100%' }}>
            <Paragraph>
              要求物理背景的专业集中在工科和理科中。。。。。。
            </Paragraph>
          </Card></Fragment> : <Empty description="暂无数据"/>}
      </Fragment>
    );
  }
}

export default CollageExam;
