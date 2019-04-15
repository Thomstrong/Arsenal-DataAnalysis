/**
 * Created by 胡晓慧 on 2019/4/13.
 */
import React,{memo,Suspense } from "react";
import {Row, Col,List}  from 'antd';
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


// const SingleLineChart  =  React.lazy(()=> import ('@/components/Charts'));


const ScoreLineChart = memo(
  ({ lineData,scale,radarViewData,cols,subData }) => (
      <React.Fragment>
          <div>
              <Row>
                  <Col span={8}>
                      <Chart
                      height={300}
                      data={radarViewData}
                      padding={[20, 20, 95, 20]}
                      scale={cols}
                      forceFit
                    >
                      <Coord type="polar" radius={0.8} />
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
                      <Tooltip />
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
                      <Legend name="user" marker="circle" offset={30} />
                      <Geom type="line" position="item*score" color="user" size={2} />
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
                  </Col>
                  <Col span={16}>
                    <Chart height={300} data={lineData} scale={scale} forceFit>
                          <p style={{textAlign:'center'}}>
                            总分变化趋势
                          </p>
                          <Axis name="year" />
                          <Axis name="value" />
                          <Tooltip
                            crosshairs={{
                              type: "y"
                            }}
                          />
                          <Geom type="line" position="year*value" size={2} />
                          <Geom
                            type="point"
                            position="year*value"
                            size={4}
                            shape={"circle"}
                            style={{
                              stroke: "#fff",
                              lineWidth: 1
                            }}
                          />
                      </Chart>
                    {/*todo 企图把单折线图变成component,但是后来觉得似乎没有必要*/}
                    {/*<SingleLineChart*/}
                        {/*data = {lineData}*/}
                    {/*/>*/}
                  </Col>
              </Row>
              {/*利用list进行布局*/}
                <List
                    grid={{ gutter: 16, column: 2 }}
                    dataSource={subData}
                    renderItem={item => (
                      <List.Item>
                        <Chart height={300} data={item.lineData} scale={scale} forceFit>
                          <p style={{textAlign:'center'}}>
                              {item.title}
                          </p>
                          <Axis name="year" />
                          <Axis name="value" />
                          <Tooltip
                            crosshairs={{
                              type: "y"
                            }}
                          />
                          <Geom type="line" position="year*value" size={2} />
                          <Geom
                            type="point"
                            position="year*value"
                            size={4}
                            shape={"circle"}
                            style={{
                              stroke: "#fff",
                              lineWidth: 1
                            }}
                          />
                        </Chart>
                      </List.Item>
                    )}
                  />
          </div>
      </React.Fragment>
    )
);

export default ScoreLineChart;
