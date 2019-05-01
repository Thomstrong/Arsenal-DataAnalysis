/**
 * Created by 胡晓慧 on 2019/4/16.
 */
//展示选课情况,包括各科目选课人数分布,及不同7选3的分布情况

import React, {Fragment, PureComponent} from 'react';
import {COURSE_FULLNAME_ALIAS} from "@/constants";
import {Button, Card, Col, Row, Select, Typography} from 'antd';
import DataSet from "@antv/data-set";
import {Axis, Chart, Coord, G2, Geom, Guide, Label, Legend, Tooltip, View} from "bizcharts";
import {connect} from "dva";

const {Paragraph, Text: AntdText} = Typography;
const {Option} = Select;

@connect(({loading, course}) => ({
  distributions: course.distributions,
  coursePercents: course.coursePercents,
  totalStudents: course.totalStudents,
  arcCourse: course.arcCourse,
  detailDistribution: course.detailDistribution,
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
    const {dispatch} = this.props;
    dispatch({
      type: 'course/fetchSelectionDistribution',
    });
    dispatch({
      type: `course/fetchCoursePercents`,
      payload: {
        year: 2019
      }
    });
    dispatch({
      type: 'course/fetchArcCourse',
      payload: {
        year: 2019
      }
    });
    dispatch({
      type: 'course/fetchDetailDistribution',
    });
    dispatch({
      type: 'course/fetchDetailPercent',
      payload: {
        year: 2019
      }
    });
  }

  onYearChanged = (year, type1, type2) => {
    const {dispatch} = this.props;
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

  onDetailYearChanged = (year) => {
    const {dispatch} = this.props;
    dispatch({
      type: 'course/fetchDetailPercent',
      payload: {
        year
      }
    });
  };


  render() {
    const {
      distributions, coursePercents, totalStudents,
      arcCourse, detailDistribution,
      courseSelectionPie, courseSelectionPieOther,
      pieOtherOffsetAngle, pieSum,
      courseSelectionTree
    } = this.props;

    const {Text} = Guide;

    //分组层叠图颜色
    const colorMap = {
      "2017_未知": "#36c0e1",
      "2019_男": "#0860BF",
      "2019_女": "#1581E6",
      "2018_未知": "#209BDD",
    };
    const arcColorMap = {
      "物理": "#668ed7",
      "化学": "#23c2db",
      "生物": "#63d5b2",
      "地理": "#95c87e",
      "历史": "#feb64e",
      "技术": "#fa816d",
      "政治": "#d15b7f",
    };
    const chartWidth = window.innerWidth;
    const chartHeight = window.innerHeight / 2;
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
          ["L", chartWidth * 0.4 + 150, 20],
          ["M", parsePoints[2].x, parsePoints[2].y],
          ["L", chartWidth * 0.4 + 150, chartHeight - 30]
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
    const arcCourseData = arcCourse.nodes ? new DataSet.View().source(arcCourse, {
      type: "graph",
      edges: d => d.edges
    }).transform({
      type: "diagram.arc",
      sourceWeight: e => e.sourceWeight,
      targetWeight: e => e.targetWeight,
      weight: true,
      marginRatio: 0.3
    }) : {edges: [], nodes: []};


    return (
      <Fragment>
        <Card title="高三各科目选课情况分布" bordered={true} style={{width: '100%'}}>
          {/*分组堆叠*/}
          <Chart
            key='selection-total-distribute-chart'
            height={400}
            data={distributions}
            padding={[20, 160, 80, 40]}
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
                    value: population + "人"
                  };
                }
              ]}
              adjust={[
                {
                  type: "dodge",
                  dodgeBy: "year",
                  marginRatio: 0.1
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
              style={{width: 180, float: "right", paddingRight: 60}}
              onChange={(year) => this.onYearChanged(year, 'fetchCoursePercents', 'fetchArcCourse')}
            >
              <Option key={`course-percents-2017`} value="2017">2017年</Option>
              <Option key={`course-percents-2018`} value="2018">2018年</Option>
              <Option key={`course-percents-2019`} value="2019">2019年</Option>
            </Select>
          </Row>
          <Row>
            <Col xs={24} xl={11}>
              {/*玉珏*/}
              <Chart
                key='selection-jade-chart' height={400}
                padding={{top: 60, right: 40, bottom: 25}}
                data={coursePercents}
                scale={{
                  percent: {
                    min: 0,
                    max: 1
                  },
                  count: {
                    max: totalStudents || 1000
                  }
                }}
                forceFit
              >
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
            <Col xs={24} xl={11}>
              {/*和弦图*/}
              <Chart
                data={arcCourseData}
                key='selection-arc-chart'
                forceFit={true}
                height={420}
                scale={{
                  x: {
                    sync: true
                  },
                  y: {
                    sync: true
                  }
                }}
                padding={{top: 30, right: 40, bottom: 20}}
              >
                <Tooltip showTitle={false}/>
                <View data={arcCourseData.edges} axis={false}>
                  <Coord type="polar" reflect="y"/>
                  <Geom
                    type="edge"
                    position="x*y"
                    shape="arc"
                    color={["source", function (source) {
                      return arcColorMap[COURSE_FULLNAME_ALIAS[source]];
                    }]}
                    opacity={0.5}
                    tooltip={[
                      "source*target*sourceWeight",
                      (source, target, sourceWeight) => {
                        return {
                          name: COURSE_FULLNAME_ALIAS[source] + " <-> " + COURSE_FULLNAME_ALIAS[target] + "</span>",
                          value: sourceWeight + "人"

                        };
                      }
                    ]}
                  />
                </View>
                <View data={arcCourseData.nodes} axis={false}>
                  <Coord type="polar" reflect="y"/>
                  <Geom
                    type="polygon"
                    position="x*y"
                    color={["id", function (id) {
                      return arcColorMap[COURSE_FULLNAME_ALIAS[id]];
                    }]}
                    tooltip={["id", (id) => {
                      return {
                        name: COURSE_FULLNAME_ALIAS[id],
                        value: id
                      }
                    }]}
                  >
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
          {distributions.length && coursePercents.length && arcCourseData.nodes &&
          <Card title='总结' bordered={false} hoverable={true} style={{marginLeft: 32, marginRight: 32,cursor:"auto"}}>
            <Typography>
              <Paragraph>1.
                自2017年高考改革以来选修<AntdText type="danger">物理、化学、生物</AntdText>的人数一直居<AntdText type="danger">高</AntdText>不下。传统文科中
                <AntdText type="danger">地理</AntdText>最受<AntdText type="danger">欢迎</AntdText>，
                <AntdText type="danger">历史</AntdText>在七门学科中较为<AntdText type="danger">弱势</AntdText>。
                究其原因,可能是填报志愿时不同专业对选课要求的不同，物理化学在填报志愿时较有优势，其中选考物理后的可申报专业覆盖面高达93.5%，化学为85.5%;</Paragraph>
              <Paragraph>2.
                2019年,选课人数突增，但<AntdText type="danger">男女</AntdText>生选课<AntdText type="danger">差异并不明显</AntdText>，
                <AntdText type="danger">女男比</AntdText>在理化生三个学科上依次<AntdText type="danger">增高</AntdText>，
                男女选课人数最不均衡的居然是政治接近<AntdText type="danger">1：5</AntdText>。
                其中，化学、地理的选课男女比接近<AntdText type="danger">1：1</AntdText>；
                物理、技术接近<AntdText type="danger">2：1</AntdText>；
                生物、历史接近<AntdText type="danger">1：2</AntdText>；</Paragraph>
              <Paragraph>3.
                选课的重叠情况三年来没有什么显著的变化。选修了<AntdText type="danger">物理</AntdText>的同学还是有<AntdText type="danger">近6成</AntdText>同时选修了化学或生物；
                选修了<AntdText type="danger">化学、生物</AntdText>的同学有<AntdText type="danger">一半</AntdText>也进行了生物或物理，化学或物理的组合；
                选修政治的同学其他六门课程的选修概率基本相同。</Paragraph>
            </Typography>
          </Card>}
        </Card>
        <Card title="七选三组合分布情况" bordered={true} style={{width: '100%', marginTop: 32}}>
          {/*柱状图显示35种选择人数分布情况,分组柱状图*/}
          <Chart
            key='selection-3_in_7-chart'
            height={400}
            data={detailDistribution}
            forceFit
          >
            <Axis name="selection"/>
            <Axis name="count"/>
            <Legend/>
            <Tooltip/>
            <Geom
              type="interval"
              position="selection*count"
              color={["year", "#26BFBF-#FC6170-#FFD747"]}
              adjust={[
                {
                  type: "dodge",
                  marginRatio: 1 / 32
                }
              ]}
              tooltip={[
                "year*count",
                (year,count) => {
                  return {
                    name: year,
                    value: count+"人"
                  };
                }
              ]}

            />
          </Chart>
          {/*饼图柱状图显示分布比例,仅显示比例*/}
          {/*矩形树图,与饼图柱状图结合,做成卡片翻转样式,仅显示数值*/}
          <Row>
            <Col offset={1} xs={24} xl={22}>
              <Select id='3in7-year' defaultValue="2019" style={{width: 120, float: "center"}}
                      onChange={(year) => this.onDetailYearChanged(year)}
              >
                <Option key="bing20171" value="2017">2017年</Option>
                <Option key="bing20181" value="2018">2018年</Option>
                <Option key="bing20191" value="2019">2019年</Option>
              </Select>
              <Button onClick={() => this.setState({pieFront: !this.state.pieFront})}>
                {`${this.state.pieFront ? '查看人数详情' : '查看占比详情'}`}
              </Button>
              <Card bordered={false}>
                {this.state.pieFront ? <Chart
                    key={'pie-chart'}
                    forceFit
                    height={chartHeight}
                    weight={chartWidth}
                    padding={[20, 0, 20, 120]}
                  >
                    <Tooltip showTitle={false}/>
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
                            if (type === "其他") {
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
                              value: value+"人"
                            };
                          }
                        ]}
                      >
                        <Label
                          content="value*type"
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
                        color={["otherType", "#b6e7ff-#6387c9"]}
                      >
                        <Label
                          content="value*otherType"
                          offset={-10}
                          textStyle={{
                            fill: '#717171'
                          }}
                          formatter={(val, item) => {
                            return `${item.point.otherType}: ${val}人  ${(val / pieSum * 100).toFixed(3)}%`;
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
                    '<span style="padding-left: 16px">选课人数：{count}人</span><br/>' +
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
                          textBaseline: "middle",
                          fill: '#fff'
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
          </Row>
          {detailDistribution.length && courseSelectionPie.length && courseSelectionTree.length &&
          <Row>
            <Card title='总结' bordered={false} hoverable={true} style={{marginLeft: 32, marginRight: 32,cursor:"auto"}}>
              <Paragraph>1. 无论哪一年，<AntdText type="danger">物理化学、物理生物</AntdText>再加上其他一门学科的选课方案占据了整个选课方案的<AntdText
                type="danger">近一半</AntdText>;
                从另一角度来说,与人们设想的避难就易选课方式不同,即使开放自由选课，传统<AntdText type="danger">理综科目</AntdText>
                仍是选课<AntdText type="danger">热门</AntdText>组合;</Paragraph>
              <Paragraph>2. <AntdText type="danger">物化生</AntdText>和<AntdText type="danger">物化地</AntdText>的组合方式最受欢迎的,选课比例都能达到两位数。
                2017年物化生选课人数达到32%,2018年物化地选课人数达到23%;</Paragraph>
              <Paragraph>3. <AntdText type="danger">2019年</AntdText>的选课更<AntdText type="danger">多样化</AntdText>一些。
                2019年，仅史政技<AntdText type="danger">1种</AntdText>组合方式0人选择；2018年，生政技等<AntdText type="danger">4种</AntdText>选课组合无人问津；
                2017年更是多达<AntdText type="danger">5种</AntdText>。物史政、化政技、物史技、化史技、生政技等组合方式<AntdText
                  type="danger">几乎没人</AntdText>选择;</Paragraph>
              <Paragraph>4. 2019年选课人数增加，大部分7选3组合选课人数呈上升趋势，但历史政治、历史地理、化学地理等组合方式选课人数<AntdText
                type="danger">不增反降。</AntdText></Paragraph>
            </Card>
          </Row>}
        </Card>
      </Fragment>
    );
  }
}

export default Selection;
