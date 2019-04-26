/**
 * Created by 胡晓慧 on 2019/4/16.
 */
//展示选课情况,包括各科目选课人数分布,及不同7选3的分布情况

import React, { Fragment, PureComponent } from 'react';
import { POLICY_TYPE_ALIAS, SEX_MAP } from "@/constants";
import { Button, Card, Col, Row, Select } from 'antd';
import DataSet from "@antv/data-set";
import { Axis, Chart, Coord, Geom, Guide, Label, Legend, Tooltip, View } from "bizcharts";
import { connect } from "dva";

const { Option } = Select;

@connect(({ loading, course }) => ({
  distributions: course.distributions,
  coursePercents: course.coursePercents,
  totalStudents: course.totalStudents,
  arcCourse: course.arcCourse,
  seven2threeDistribution: course.seven2threeDistribution,
  courseSelectionPie: course.courseSelectionPie,
  courseSelectionPieOther: course.courseSelectionPieOther,
  pieOtherOffsetAngle: course.pieOtherOffsetAngle,
  pieSum: course.pieSum,
  courseSelectionTree: course.courseSelectionTree,
  loading: loading.models.rule,
}))
class Selection extends PureComponent {
  constructor() {
    super();
    this.state = {
      pieFront: false
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'course/fetchSelectionDistribution',
    });
    dispatch({
      type: `course/fetchCoursePercents`,
      payload: {
        year: 2019
      }
    });
    //todo
    dispatch({
      type: 'course/fetchArcCourse',
      payload: {
        year: 2019
      }
    });
    dispatch({
      type: 'course/fetchSeven2ThreeDistribution',
    });
    dispatch({
      type: 'course/fetchCourseSelectionPie',
      payload: {
        year: 2019
      }
    });
    dispatch({
      type: 'course/fetchCourseSelectionTree',
      payload: {
        year: 2019
      }
    });
  }

  onYearChanged = (year, type1, type2) => {
    const { dispatch } = this.props;
    dispatch({
      type: `course/${type1}`,
      payload: {
        year
      }
    });
    dispatch({
      type: `course/${type2}`,
      payload: {
        year
      }
    });
  };

  seven2threeYearChanged = (year, type1, type2) => {
    const { dispatch } = this.props;
    dispatch({
      type: `course/${type1}`,
      payload: {
        year
      }
    });
    dispatch({
      type: `course/${type2}`,
      payload: {
        year
      }
    });
  };


  render() {
    //todo saveSeven2ThreeDistribution有时候有数据有时候是undefined
    const {
      distributions, coursePercents, totalStudents,
      arcCourse, seven2threeDistribution, courseSelectionPie,
      courseSelectionPieOther, pieOtherOffsetAngle, pieSum,
      courseSelectionTree
    } = this.props;

    const { Text } = Guide;
    //分组层叠图数据
    const colorMap = {
      "2017_未知": "#E3F4BF",
      "2017_女": "#BEF7C8",
      "2018_未知": "#86E6C8",
      "2018_女": "#36CFC9",
      "2019_男": "#60ccf9",
      "2019_女": "#f5aeae",
    };
    const chartWidth = window.innerWidth;
    const chartHeight = 400;
    // 定义 other 的图形，增加两条辅助线
    G2.Shape.registerShape("interval", "otherShape", {
      draw(cfg, container) {
        const points = cfg.points;
        let path = [];
        path.push(["M", points[0].x, points[0].y]);
        path.push(["L", points[1].x, points[1].y]);
        path.push(["L", points[2].x, points[2].y]);
        path.push(["L", points[3].x, points[3].y]);
        path.push("Z");
        path = this.parsePath(path); // 将点转换成画布上的点

        const parsePoints = this.parsePoints(points);
        const linePath = [
          ["M", parsePoints[3].x, parsePoints[3].y],
          ["L", chartWidth * 0.4, 20],
          ["M", parsePoints[2].x, parsePoints[2].y],
          ["L", chartWidth * 0.4, chartHeight - 70]
        ];

        container.addShape("path", {
          attrs: {
            path: linePath,
            stroke: cfg.color,
            lineWidth: 1
          }
        });
        return container.addShape("path", {
          attrs: {
            fill: cfg.color,
            path: path
          }
        });
      }
    });
    //矩形树图
    const scale = {
      value: {
        nice: false
      }
    };
    //玉珏图
    const radialcols = {
      percent: {
        min: 0,
        max: 1
      },
      count: {
        max: totalStudents || 1000
      }
    };
    //和弦图
    const arcScale = {
      x: {
        sync: true
      },
      y: {
        sync: true
      }
    };

    const arcCourseData = arcCourse.nodes ? new DataSet.View().source(arcCourse, {
      type: "graph",
      edges: d => d.links

    }).transform({
      type: "diagram.arc",
      sourceWeight: e => e.sourceWeight,
      targetWeight: e => e.targetWeight,
      weight: true,
      marginRatio: 0.3
    }) : { edges: [], nodes: [] };

    return (
      <Fragment>
        <Card title="各科目选课情况分布" bordered={true} style={{ width: '100%' }}>
          {/*分组堆叠*/}
          <Chart
            key='selection-total-distribute-chart'
            height={400}
            data={distributions}
            padding={[20, 160, 80, 60]}
            forceFit
          >
            <Axis
              name="count"
            />
            <Legend position="right"/>
            <Tooltip/>
            <Geom
              type="interval"
              position="course*count"
              color={[
                "sex",
                function (sex) {
                  return colorMap[sex];
                }
              ]}
              tooltip={[
                "sex*count",
                (category, population) => {
                  return {
                    name: category,
                    value: population
                  };
                }
              ]}
              adjust={[
                {
                  type: "dodge",
                  dodgeBy: "year",
                  // 按照 type 字段进行分组
                  marginRatio: 0.1 // 分组中各个柱子之间不留空隙
                },
                {
                  type: "stack"
                }
              ]}
            />
          </Chart>
          <Row>
            <Select
              id='yujue-year'
              defaultValue="2019"
              style={{ width: 120, float: "right" }}
              onChange={(year) => this.onYearChanged(year, 'fetchCoursePercents', 'fetchArcCourse')}
            >
              <Option key={`course-percents-2017`} value="2017">2017年</Option>
              <Option key={`course-percents-2018`} value="2018">2018年</Option>
              <Option key={`course-percents-2019`} value="2019">2019年</Option>
            </Select>
          </Row>
          <Row>
            <Col span={12}>
              {/*玉珏*/}
              <Chart key='selection-jade-chart' height={400} data={coursePercents} scale={radialcols} forceFit>
                <Coord type="polar" innerRadius={0.1} transpose/>
                <Tooltip title="course"/>
                <Geom
                  type="interval"
                  position="course*count"
                  color={["percent", "#BAE7FF-#1890FF-#0050B3"]}
                  tooltip={[
                    "percent",
                    val => {
                      return {
                        name: "占比",
                        value: `${val}%`
                      };
                    }
                  ]}
                  style={{
                    lineWidth: 1,
                    stroke: "#fff"
                  }}
                >
                  <Label content="count" offset={-5}/>
                </Geom>
                <Guide>
                  {coursePercents && coursePercents.map(obj => {
                    return (
                      <Text
                        key={`jade-${obj.course}`}
                        position={[obj.course, 0]}
                        content={obj.course + " "}
                        style={{
                          textAlign: "right"
                        }}
                      />
                    );
                  })}
                </Guide>
              </Chart>
            </Col>
            <Col span={12}>
              {/*和弦图*/}
              <Chart
                data={arcCourseData}
                key='selection-arc-chart'
                forceFit={true}
                height={500}
                scale={arcScale}
              >
                <Tooltip showTitle={false}/>
                <View data={arcCourseData.edges} axis={false}>
                  <Coord type="polar" reflect="y"/>
                  <Geom
                    type="edge"
                    position="x*y"
                    shape="arc"
                    color="source"
                    opacity={0.5}
                    tooltip={[
                      "source*target*sourceWeight",
                      (source, target, sourceWeight) => {
                        return {
                          name: arcCourseData.nodes[source].name + " <-> " + arcCourseData.nodes[target].name + "</span>",
                          value: sourceWeight

                        };
                      }
                    ]}
                  />
                </View>
                <View data={arcCourseData.nodes} axis={false}>
                  <Coord type="polar" reflect="y"/>
                  <Geom type="polygon" position="x*y" color="id">
                    <Label
                      content="name"
                      labelEmit={true}
                      textStyle={{
                        fill: "black"
                      }}
                    />
                  </Geom>
                </View>
              </Chart>
            </Col>
          </Row>
          <Card title='总结' bordered={false} hoverable={true} style={{ marginLeft: 32, marginRight: 32 }}>
            <p>xxxx学年xxx学科选的人最多</p>
            <p>男女比相近</p>
          </Card>
        </Card>
        <Card title="七选三组合分布情况" bordered={true} style={{ width: '100%', marginTop: 32 }}>
          {/*柱状图显示35种选择人数分布情况,分组柱状图*/}
          <Chart
            key='selection-3_in_7-chart'
            height={400}
            data={seven2threeDistribution}
            forceFit
          >
            <Axis name="科目组合"/>
            <Axis name="选课人数"/>
            <Legend/>
            <Tooltip
              crosshairs={{
                type: "y"
              }}
            />
            <Geom
              type="interval"
              position="科目组合*选课人数"
              color={"name"}
              adjust={[
                {
                  type: "dodge",
                  marginRatio: 1 / 32
                }
              ]}
            />
          </Chart>
          {/*饼图柱状图显示分布比例,仅显示比例*/}
          {/*矩形树图,与饼图柱状图结合,做成卡片翻转样式,仅显示数值*/}
          <Row>
            <Col span={16} offset={1}>
              <Select id='3in7-year' defaultValue="2019" style={{ width: 120, float: "center" }}
                      onChange={(year) => this.seven2threeYearChanged(year, 'fetchCourseSelectionPie', 'fetchCourseSelectionTree')}
              >
                <Option key="bing20171" value="2017">2017年</Option>
                <Option key="bing20181" value="2018">2018年</Option>
                <Option key="bing20191" value="2019">2019年</Option>
              </Select>
              <Button onClick={() => this.setState({ pieFront: !this.state.pieFront })}> 切换视图</Button>
              <Card bordered={false}>
                {this.state.pieFront ? <Chart
                    key={'pie-chart'}
                    height={chartHeight}
                    forceFit
                    padding={[20, 0, "auto", 0]}
                  >
                    <Axis name="value"/>
                    <Tooltip showTitle={false}/>
                    <Legend/>
                    <View
                      data={courseSelectionPie}
                      start={{
                        x: 0,
                        y: 0
                      }}
                      end={{
                        x: 0.5,
                        y: 1
                      }}
                    >
                      <Coord
                        type="theta"
                        startAngle={0 + pieOtherOffsetAngle}
                        endAngle={Math.PI * 2 + pieOtherOffsetAngle}
                      />
                      <Geom
                        type="intervalStack"
                        position="value"
                        color="type"
                        shape={[
                          "type",
                          function (type) {
                            if (type === "Other") {
                              return "otherShape";
                            }

                            return "rect";
                          }
                        ]}
                        tooltip={[
                          "type*value",
                          (type, value) => {
                            return {
                              name: type,
                              value: value
                            };
                          }
                        ]}
                      >
                        <Label
                          content="value*type"
                          offset={-20}
                          textStyle={{
                            rotate: 0
                          }}
                          formatter={(val, item) => {
                            return item.point.type + ": " + (val / pieSum * 100).toFixed(3) + "%";
                          }}
                        />
                      </Geom>
                    </View>
                    <View
                      data={courseSelectionPieOther}
                      scale={scale}
                      start={{
                        x: 0.6,
                        y: 0
                      }}
                      end={{
                        x: 1,
                        y: 1
                      }}
                    >
                      <Geom
                        type="intervalStack"
                        position="1*value"
                        boolean={true}
                        color={["otherType", "#FCD7DE-#F04864"]}
                      >
                        <Label
                          content="value*otherType"
                          offset={-20}
                          textStyle={{
                            rotate: 0
                          }}
                          formatter={(val, item) => {
                            return item.point.otherType + ": " + (val / pieSum * 100).toFixed(3) + "%";
                          }}
                        />
                      </Geom>
                    </View>
                  </Chart> :
                  <Chart
                    key={'polygon-chart'}
                    height={chartHeight}
                    data={courseSelectionTree}
                    forceFit
                    scale={scale}
                    padding={[20, 0, "auto", 0]}
                  >
                    <Tooltip showTitle={false} itemTpl={"<li data-index={index}>" +
                    '<span style="background-color:{color};" class="g2-tooltip-marker"></span>' +
                    "{name}<br/>" +
                    '<span style="padding-left: 16px">选课人数：{count}</span><br/>' +
                    "</li>"}/>
                    <Geom
                      type="polygon"
                      position="x*y"
                      color="name"
                      tooltip={[
                        "name*value",
                        (name, count) => {
                          return {
                            name,
                            count
                          };
                        }
                      ]}
                      style={{
                        lineWidth: 1,
                        stroke: "#fff"
                      }}
                    >
                      <Label
                        content="name"
                        offset={0}
                        textStyle={{
                          textBaseline: "middle"
                        }}
                        formatter={val => {
                          if (val !== "root") {
                            return val;
                          }
                        }}
                      />
                    </Geom>
                  </Chart>}

              </Card>
            </Col>
            <Col span={6} pull={0.5}>
              <Card title='总结' bordered={false} hoverable={true}>
                <p>选择xxx的学生最多</p>
                <p>哪些组合基本没人考虑</p>
              </Card>
            </Col>
          </Row>
        </Card>
      </Fragment>
    );
  }
}

export default Selection;
