import React, { PureComponent, Fragment } from "react";
import { Axis, Chart, Coord, Geom, Label, Legend, Tooltip, } from "bizcharts";
import { Card, Col, Row, Typography,Empty } from "antd";
import TagCloud from '@/components/Charts/TagCloud';
import backImg from '../../../../public/tagcloud/Rectangular.jpeg';
import { connect } from "dva";

const { Paragraph, Text } = Typography;

@connect(({ course }) => ({
  collage2Subject: course.collage2Subject,
  subject2Major: course.subject2Major,
}))

class CollageExam extends PureComponent {

  componentDidMount() {
    const { dispatch, collage2Subject, subject2Major } = this.props;
    if (!collage2Subject.length) {
      dispatch({
        type: 'course/fetchCollage2Subject',
      });
    }

    if (!subject2Major.length) {
      dispatch({
        type: `course/fetchSubject2Major`,
      });
    }
  }

  render() {
    const {
      collage2Subject, subject2Major
    } = this.props;
    console.log(collage2Subject,subject2Major);

    return (
      <Fragment>
        <Card title="2019年高校招生指定科目情况" bordered={true} style={{ width: '100%' }}>
          {(collage2Subject&&collage2Subject.length)?<Row type="flex" align="middle">
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
                    offset={-15}
                    textStyle={{
                      textAlign: "center",
                      fontWeight: "bold",
                      fontSize: 11
                    }}
                  />
                </Geom>
              </Chart>
            </Col>
            <Col xl={{ span: 8, offset: 1 }} xs={24} md={24} lg={24} style={{ marginTop: 10 }}>
              <Card title="总结" bordered={true} style={{ width: '100%' }} type="inner">
                <Paragraph>
                  通过搜集xxx所高校，共xx个专业报考要求，发现有大部分专业要求报考学生要有物理基础
                </Paragraph>
              </Card>
            </Col>
          </Row>:<Empty description="暂无数据"/>}
        </Card>
        {(subject2Major&&subject2Major.physics)?<Fragment><Row gutter={16} style={{ marginTop: 24 }}>
          <Col xl={6} lg={12} sm={12} xs={12} style={{ marginBottom: 24 }}>
            <Card
              title="物理"
              bordered={false}
              bodyStyle={{ overflow: 'hidden' }}
            >
              <TagCloud data={subject2Major.physics} height={161} imgUrl={backImg}/>
            </Card>
          </Col>
          <Col xl={6} lg={12} sm={12} xs={12} style={{ marginBottom: 24 }}>
            <Card
              title="化学"
              bordered={false}
              bodyStyle={{ overflow: 'hidden' }}
            >
              <TagCloud data={subject2Major.chemistry||[]} height={161} imgUrl={backImg}/>
            </Card>
          </Col>
          <Col xl={6} lg={12} sm={12} xs={12} style={{ marginBottom: 24 }}>
            <Card
              title="生物"
              bordered={false}
              bodyStyle={{ overflow: 'hidden' }}
            >
              <TagCloud data={subject2Major.biology||[]} height={161} imgUrl={backImg}/>
            </Card>
          </Col>
          <Col xl={6} lg={12} sm={12} xs={12} style={{ marginBottom: 24 }}>
            <Card
              title="政治"
              bordered={false}
              bodyStyle={{ overflow: 'hidden' }}
            >
              <TagCloud data={subject2Major.politics||[]} height={161} imgUrl={backImg}/>
            </Card>
          </Col>
        </Row>
        <Row gutter={16}>
          <Col xl={6} lg={12} sm={12} xs={12} style={{ marginBottom: 24 }}>
            <Card
              title="历史"
              bordered={false}
              bodyStyle={{ overflow: 'hidden' }}
            >
              <TagCloud data={subject2Major.history||[]} height={161} imgUrl={backImg}/>
            </Card>
          </Col>
          <Col xl={6} lg={12} sm={12} xs={12} style={{ marginBottom: 24 }}>
            <Card
              title="地理"
              bordered={false}
              bodyStyle={{ overflow: 'hidden' }}
            >
              <TagCloud data={subject2Major.geography||[]} height={161} imgUrl={backImg}/>
            </Card>
          </Col>
          <Col xl={6} lg={12} sm={12} xs={12} style={{ marginBottom: 24 }}>
            <Card
              title="技术"
              bordered={false}
              bodyStyle={{ overflow: 'hidden' }}
            >
              <TagCloud data={subject2Major.technology||[]} height={161} imgUrl={backImg}/>
            </Card>
          </Col>
          <Col xl={6} lg={12} sm={12} xs={12} style={{ marginBottom: 24 }}>
            <Card
              title="不限"
              bordered={false}
              bodyStyle={{ overflow: 'hidden' }}
            >
              <TagCloud data={subject2Major.unlimited||[]} height={161} imgUrl={backImg}/>
            </Card>
          </Col>
        </Row>
        <Card title="总结" bordered={true} style={{ width: '100%' }}>
          <Paragraph>
            要求物理背景的专业集中在工科和理科中。。。。。。
          </Paragraph>
        </Card></Fragment>:<Empty description="暂无数据"/>}
      </Fragment>
    );
  }
}

export default CollageExam;
