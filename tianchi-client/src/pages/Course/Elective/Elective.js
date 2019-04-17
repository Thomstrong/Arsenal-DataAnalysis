/**
 * Created by 胡晓慧 on 2019/4/16.
 */
//展示选课情况,包括各科目选课人数分布,及不同7选3的分布情况

import React, { PureComponent, Suspense } from 'react';
import { connect } from 'dva';
import { POLICY_TYPE_ALIAS, SEX_MAP } from "@/constants";
import { Avatar, Card, Col, Divider, Icon, Input, Row, Select, Tabs } from 'antd';
import DataSet from "@antv/data-set";
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";



class Elective extends PureComponent{
    render(){
      function handleChangeSubject(value) {
        console.log(`selected ${value}`);
      }
      function handleChangeCombin(value) {
        console.log(`selected ${value}`);
      }

      const { DataView } = DataSet;
      const { Text } = Guide;
        //分组层叠图数据
      const electiveColData = [
        {
          State: "物理",
          "2017_男生": 310,
          "2017_女生": 559,
          "2018_男生": 259,
          "2018_女生": 450,
          "2019_男生": 123,
          "2019_女生": 121,
        },
        {
          State: "化学",
          "2017_男生": 504,
          "2017_女生": 339,
          "2018_男生": 234,
          "2018_女生": 219,
          "2019_男生": 123,
          "2019_女生": 159,
        },
        {
          State: "生物",
          "2017_男生": 323,
          "2017_女生": 233,
          "2018_男生": 234,
          "2018_女生": 118,
          "2019_男生": 272,
          "2019_女生": 266,
        },
        {
          State: "历史",
          "2017_男生": 304,
          "2017_女生": 239,
          "2018_男生": 334,
          "2018_女生": 318,
          "2019_男生": 272,
          "2019_女生": 266,
        },
        {
          State: "政治",
          "2017_男生": 304,
          "2017_女生": 339,
          "2018_男生": 234,
          "2018_女生": 318,
          "2019_男生": 372,
          "2019_女生": 266,
        },
        {
          State: "地理",
          "2017_男生": 218,
          "2017_女生": 55,
          "2018_男生": 259,
          "2018_女生": 450,
          "2019_男生": 123,
          "2019_女生": 121,
        },
        {
          State: "技术",
          "2017_男生": 323,
          "2017_女生": 512,
          "2018_男生": 263,
          "2018_女生": 236,
          "2019_男生": 123,
          "2019_女生": 236,
        }
      ];
      const category = [
          "2017_男生",
          "2017_女生",
          "2018_男生",
          "2018_女生",
          "2019_男生",
          "2019_女生"
      ];
      const eleColData = new DataSet.View().source(electiveColData)
        .transform({
          type: "fold",
          fields: category,
          key: "category",
          value: "population",
          retains: ["State"]
        })
        .transform({
          type: "map",
          callback: obj => {
            const key = obj.category;
            let type;

            if (
              key === "2017_男生" ||
              key === "2017_女生"
            ) {
              type = "a";
            } else if (
              key === "2018_男生"||
                  key ==="2018_女生"
            ) {
              type = "b";
            }  else {
              type = "c";
            }
            obj.type = type;
            return obj;
          }
        });
      const colorMap = {
        "2017_男生": "#E3F4BF",
        "2017_女生": "#BEF7C8",
        "2018_男生": "#86E6C8",
        "2018_女生": "#36CFC9",
        "2019_男生": "#209BDD",
        "2019_女生": "#1581E6",
      };
      //玉珏图数据
      const radialData = [
      {
      subject: "物理",
      percent: 0.21
      },
      {
      subject: "化学",
      percent: 0.4
      },
      {
      subject: "生物",
      percent: 0.49
      },
      {
      subject: "地理",
      percent: 0.52
      },
      {
      subject: "历史",
      percent: 0.53
      },
      {
      subject: "政治",
      percent: 0.84
      },
      {
      subject: "技术",
      percent: 0.33
      }
      ];
      const radialcols = {
      percent: {
        min: 0,
        max: 1
      }
      };
      //7选3 人数数据,分组柱状图
      const sevenTothreeData = [
      {
        name: "2017",
        "理化生": 120,
        "政史地": 127,
        "理史地": 39,
        "政化生": 81,
        "理化政": 47,
        "理化史": 20,
        "理化地": 24,
        "理化技": 35,
      },
      {
        name: "2018",
        "理化生": 12,
        "政史地": 127,
        "理史地": 32,
        "政化生": 81,
        "理化政": 40,
        "理化史": 20,
        "理化地": 24,
        "理化技": 35,
      },
        {
        name: "2019",
        "理化生": 120,
        "政史地": 17,
        "理史地": 49,
        "政化生": 81,
        "理化政": 47,
        "理化史": 20,
        "理化地": 34,
        "理化技": 35,
      }
    ];
      const s2tData = new DataSet.View().source(sevenTothreeData).transform({
      type: "fold",
      fields: ["理化生","政史地","理史地","政化生","理化政","理化史","理化地","理化技"],
      // 展开字段集
      key: "科目组合",
      // key字段
      value: "选课人数" // value字段
      });
      //饼图柱状图
      const data = [
      {
        type: "分类一",
        value: 200
      },
      {
        type: "分类二",
        value: 18
      },
      {
        type: "分类三",
        value: 32
      },
      {
        type: "分类四",
        value: 15
      },
      {
        type: "Other",
        value: 10
      }
    ];
      let sum = 0;
      data.forEach(function(obj) {
        sum += obj.value;
      });
      const otherRatio = data[data.length - 1].value / sum; // Other 的占比
      const otherOffsetAngle = otherRatio * Math.PI; // other 占的角度的一半
      const chartWidth = window.innerWidth;
      const chartHeight = 400;
      const others = [
        {
          otherType: "Other1",
          value: 2
        },
        {
          otherType: "Other2",
          value: 3
        },
        {
          otherType: "Other3",
          value: 5
        },
        {
          otherType: "Other4",
          value: 2
        },
        {
          otherType: "Other5",
          value: 3
        }
      ];
      const scale2 = {
        value: {
          nice: true
        }
      };

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
          console.log(linePath); // 绘制线

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



        return(
           <div>
               <Card title ="各科目选课情况分布" bordered={true} style={{ width: '100%'}}>
                   {/*分组堆叠*/}
                    <Chart
                      height={400}
                      data={eleColData}
                      padding={[20, 160, 80, 60]}
                      forceFit
                    >
                      <Axis
                        name="population"
                      />
                      <Legend position="right" />
                      <Tooltip />
                      <Geom
                        type="interval"
                        position="State*population"
                        color={[
                          "category",
                          function(category) {
                            return colorMap[category];
                          }
                        ]}
                        tooltip={[
                          "category*population",
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
                            dodgeBy: "type",
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
                       {/*文字分析*/}
                       <Col span={12} offset={1}>
                         <Card title='总结' bordered={false} hoverable={true}>
                           <p>xxxx学年xxx学科选的人最多</p>
                           <p>男女比相近</p>
                         </Card>
                       </Col>
                       {/*玉珏图*/}
                       <Col span={9} offset={1}>
                         <Row>
                           <Select defaultValue="2019" style={{ width: 120 ,float: "right"}} onChange={handleChangeSubject}>
                            <Option value="2017">2017年</Option>
                            <Option value="2018">2018年</Option>
                            <Option value="2019">2019年</Option>
                          </Select>
                         </Row>
                         <Row>
                          <Chart height={400} data={radialData} scale={radialcols} forceFit>
                            <Coord type="polar" innerRadius={0.1} transpose />
                            <Tooltip title="subject" />
                            <Geom
                              type="interval"
                              position="subject*percent"
                              color={["percent", "#BAE7FF-#1890FF-#0050B3"]}
                              tooltip={[
                                "percent",
                                val => {
                                  return {
                                    name: "占比",
                                    value: val * 100 + "%"
                                  };
                                }
                              ]}
                              style={{
                                lineWidth: 1,
                                stroke: "#fff"
                              }}
                            >
                            <Label content="percent" offset={-5} />
                            </Geom>
                            <Guide>
                              {radialData.map(obj => {
                                return (
                                  <Text
                                    position={[obj.subject, 0]}
                                    content={obj.subject + " "}
                                    style={{
                                      textAlign: "right"
                                    }}
                                  />
                                );
                              })}
                            </Guide>
                          </Chart>
                         </Row>
                       </Col>
                   </Row>
               </Card>
               <Card title ="七选三组合分布情况" bordered={true} style={{ width: '100%'}}>
                 {/*柱状图显示35种选择人数分布情况,分组柱状图*/}
                 <Chart height={400} data={s2tData} forceFit>
                  <Axis name="科目组合" />
                  <Axis name="选课人数" />
                  <Legend />
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
                 {/*饼图柱状图显示分布比例*/}
                 <Row>
                   <Col span={16} offset={1}>
                     <Select defaultValue="2019" style={{ width: 120 ,float: "center"}} onChange={handleChangeCombin}>
                            <Option value="2017">2017年</Option>
                            <Option value="2018">2018年</Option>
                            <Option value="2019">2019年</Option>
                          </Select>
                     <Chart
                        height={chartHeight}
                        weight={chartWidth}
                        forceFit
                        padding={[20, 0, "auto", 0]}
                      >
                        {/*<Axis name="value" />*/}
                        <Tooltip showTitle={false}/>
                        <Legend />
                        <View
                          data={data}
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
                            startAngle={0 + otherOffsetAngle}
                            endAngle={Math.PI * 2 + otherOffsetAngle}
                          />
                          <Geom
                            type="intervalStack"
                            position="value"
                            color="type"
                            shape={[
                              "type",
                              function(type) {
                                if (type === "Other") {
                                  return "otherShape";
                                }

                                return "rect";
                              }
                            ]}
                            tooltip= {[
                              "type*value",
                              (type,value) => {
                                return {
                                  name: type,
                                  value: value/ sum * 100 + "%"
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
                                return item.point.type  + ": " + val;
                              }}
                            />
                          </Geom>
                        </View>
                        <View
                          data={others}
                          scale={scale2}
                          start={{
                            x: 0.6,
                            y: 0
                          }}
                          end={{
                            x: 1,
                            y: 1
                          }}
                        >
                          {/*todo 还未确定呈现形式,是堆叠还是分组,但是数据格式是相同的(将1改为otherType)*/}
                          <Geom
                            type="intervalStack"
                            position="1*value"
                            boolean = {true}
                            color={["otherType", "#FCD7DE-#F04864"]}
                            tooltip= {[
                              "1*value",
                              (a ,value) => {
                                return {
                                  name: "占比",
                                  value: value/ sum * 100 + "%"
                                };
                              }
                            ]}
                          >
                            <Label
                              content="value*otherType"
                              offset={-20}
                              textStyle={{
                                rotate: 0
                              }}
                              formatter={(val, item) => {
                                return item.point.otherType  + ": " + val;
                              }}
                            />
                          </Geom>
                        </View>
                      </Chart>
                   </Col>
                   <Col span={6} pull={0.5}>
                     <Card title='总结' bordered={false} hoverable={true}>
                           <p>选择xxx的学生最多</p>
                           <p>哪些组合基本没人考虑</p>
                         </Card>
                   </Col>
                 </Row>
               </Card>
           </div>
        )
    }
}

export default Elective;


