/**
 * Created by 胡晓慧 on 2019/4/16.
 */
//具体科目的分析,用户可以选择学年,呈现出该学年,该学科,不同班级每次考试的成绩分布

import React, { PureComponent, Suspense } from 'react';
import { connect } from 'dva';
import { POLICY_TYPE_ALIAS, SEX_MAP } from "@/constants";
import { Avatar, Card, Col, Divider, Icon, Input, Row, Select, Tabs } from 'antd';
import { Axis, Chart, Coord, Geom, Legend, Shape, Tooltip } from "bizcharts";
import DataSet from "@antv/data-set";

class Subject extends PureComponent{
    render(){
        function handleChangeYear(value) {
            console.log(`selected ${value}`);
        }
        function handleChangeGarde(value) {
            console.log(`selected ${value}`);
        }
        function handleChangeSubject(value) {
            console.log(`selected ${value}`);
        }
        const highestScoreData = [
          {
            examName: "2014-2015考试",
            class1: 7.0,
            class2: 3.9
          },
          {
            examName: "六校联考",
            class1: 6.9,
            class2: 4.2
          },
          {
            examName: "7校联考",
            class1: 9.5,
            class2: 5.7
          },
          {
            examName: "2014-2015年期末考试",
            class1: 14.5,
            class2: 8.5
          },
          {
            examName: "模拟考试",
            class1: 18.4,
            class2: 11.9
          }
        ];
        const hScoreData = new DataSet.View().source(highestScoreData);
        hScoreData.transform({
          type: "fold",
          fields: ["class1", "class2"],
          // 展开字段集
          key: "class",
          // key字段
          value: "score" // value字段
        });

        const averageScoreData = [
      {
        examName: "2014-2015考试",
        class1: 7.0,
        class2: 3.9
      },
      {
        examName: "六校联考",
        class1: 6.9,
        class2: 4.2
      },
      {
        examName: "7校联考",
        class1: 9.5,
        class2: 5.7
      },
      {
        examName: "2014-2015年期末考试",
        class1: 14.5,
        class2: 8.5
      },
      {
        examName: "模拟考试",
        class1: 18.4,
        class2: 11.9
      }
    ];
        const aScoreData = new DataSet.View().source(averageScoreData);
        aScoreData.transform({
          type: "fold",
          fields: ["class1", "class2"],
          // 展开字段集
          key: "class",
          // key字段
          value: "score" // value字段
        });

        const lowerScoreData = [
      {
        examName: "2014-2015考试",
        class1: 7.0,
        class2: 3.9
      },
      {
        examName: "六校联考",
        class1: 6.9,
        class2: 4.2
      },
      {
        examName: "7校联考",
        class1: 9.5,
        class2: 5.7
      },
      {
        examName: "2014-2015年期末考试",
        class1: 14.5,
        class2: 8.5
      },
      {
        examName: "模拟考试",
        class1: 18.4,
        class2: 11.9
      }
    ];
        const lScoreData = new DataSet.View().source(lowerScoreData);
        lScoreData.transform({
          type: "fold",
          fields: ["class1", "class2"],
          // 展开字段集
          key: "class",
          // key字段
          value: "score" // value字段
        });

        return(
            <div>
                <Card title ="各班某年某科目成绩统计" bordered={true} style={{ width: '100%'}}>
                    <Row type="flex" justify="end" style={{padding:10}}>
                        <Col span={10}>
                            <Row type='flex' justify='space-between'>
                                <Col span={10}>
                                  <Select defaultValue="2018-2019学年" style={{ width:"100%" }} onChange={handleChangeYear}>
                                    <Option value="20134">2013-2014学年</Option>
                                    <Option value="20145">2014-2015学年</Option>
                                    <Option value="20156">2015-2016学年</Option>
                                    <Option value="20167">2016-2017学年</Option>
                                    <Option value="20178">2017-2018学年</Option>
                                    <Option value="20189">2018-2019学年</Option>
                                  </Select>
                                </Col>
                                <Col span={5}>
                                  <Select defaultValue="高三" style={{ width:"100%"}} onChange={handleChangeGarde}>
                                    <Option value="grade1">高一</Option>
                                    <Option value="grade2">高二</Option>
                                    <Option value="grade3">高三</Option>
                                  </Select>
                                </Col>
                                <Col span={5}>
                                    {/*todo 有一个问题,除了常见学科外,一些特殊学科实际上与学年有关*/}
                                  <Select defaultValue="语文" style={{ width:"100%"}} onChange={handleChangeSubject}>
                                    <Option value="chinese">语文</Option>
                                    <Option value="math">数学</Option>
                                    <Option value="english">英语</Option>
                                    <Option value="political">政治</Option>
                                    <Option value="history">历史</Option>
                                    <Option value="geography">地理</Option>
                                    <Option value="physical">物理</Option>
                                    <Option value="chemistry">化学</Option>
                                    <Option value="biological">生物</Option>
                                    <Option value="technology">技术</Option>
                                    <Option value="art">美术</Option>
                                    <Option value="PE">体育</Option>
                                    <Option value="music">音乐</Option>
                                    <Option value="infoTech">信息技术</Option>
                                    <Option value="commonTech">通用技术</Option>
                                    <Option value="1B">1B模块总分</Option>
                                  </Select>
                                </Col>
                            </Row>
                        </Col>
                    </Row>
                    <Row style={{padding:10}}>
                        <Col span={18}>
                            <Card type="inner" title ="各班某年某科目最高分统计" bordered={true} style={{ width: '100%'}} hoverable={true}>
                                <Chart height={400} data={hScoreData} forceFit>
                                  <Legend />
                                  <Axis name="examName" />
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
                                    position="examName*score"
                                    size={2}
                                    color={"class"}
                                  />
                                  <Geom
                                    type="point"
                                    position="examName*score"
                                    size={4}
                                    shape={"circle"}
                                    color={"class"}
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
                    <Row  style={{padding:10}}>
                        <Col span={5}>
                            <Card title='总结' bordered={false} hoverable={true}>
                               <p>xxxx学年xxx学科,历史最高分出现在xx考试的xx班级</p>
                               <p>男女比相近</p>
                             </Card>
                        </Col>
                        <Col span={18} offset={1}>
                            <Card type="inner" title ="各班某年某科目平均分统计" bordered={true} style={{ width: '100%'}} hoverable={true}>
                                <Chart height={400} data={aScoreData}  forceFit>
                                  <Legend />
                                  <Axis name="examName" />
                                  <Axis
                                    name="score"
                                    label={{
                                      formatter: val => `${val}°C`
                                    }}
                                  />
                                  <Tooltip
                                    crosshairs={{
                                      type: "y"
                                    }}
                                  />
                                  <Geom
                                    type="line"
                                    position="examName*score"
                                    size={2}
                                    color={"class"}
                                  />
                                  <Geom
                                    type="point"
                                    position="examName*score"
                                    size={4}
                                    shape={"circle"}
                                    color={"class"}
                                    style={{
                                      stroke: "#fff",
                                      lineWidth: 1
                                    }}
                                  />
                                </Chart>
                            </Card>
                        </Col>
                    </Row>
                    <Row  style={{padding:10}}>
                        <Col span={18}>
                            <Card type="inner" title ="各班某年某科目最低分统计" bordered={true} style={{ width: '100%'}} hoverable={true}>
                                <Chart height={400} data={lScoreData} forceFit>
                                  <Legend />
                                  <Axis name="examName" />
                                  <Axis
                                    name="score"
                                    label={{
                                      formatter: val => `${val}°C`
                                    }}
                                  />
                                  <Tooltip
                                    crosshairs={{
                                      type: "y"
                                    }}
                                  />
                                  <Geom
                                    type="line"
                                    position="examName*score"
                                    size={2}
                                    color={"class"}
                                  />
                                  <Geom
                                    type="point"
                                    position="examName*score"
                                    size={4}
                                    shape={"circle"}
                                    color={"class"}
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
        )
    }
}

export default Subject;
