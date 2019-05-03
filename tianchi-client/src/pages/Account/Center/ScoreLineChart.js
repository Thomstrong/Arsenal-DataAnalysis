/**
 * Created by 胡晓慧 on 2019/4/13.
 */
import React, { memo } from "react";
import { Col, Empty, List, Row, Spin } from 'antd';
import { Axis, Chart, Coord, Geom, Legend, Tooltip } from "bizcharts";
import { COURSE_FULLNAME_ALIAS, getDengDi } from "@/constants";

const dengDiScale = {
  score: {
    type: 'cat',
    values: [
      'E',
      'D',
      'C',
      'B',
      'A',
    ]
  }
};
const normalScale = {
  score: {}
};
const ScoreLineChart = memo(
  ({ lineData, radarViewData, subData, scoreType, loading }) => {
    const showDengDi = scoreType === 'deng_di';
    const scale = showDengDi ? dengDiScale : normalScale;
    return (lineData && !!lineData.length) ? (loading ? <Spin/> : <React.Fragment>
      <Row>
        <Col span={8}>
          <Chart
            key={'center-radar'}
            height={300}
            data={radarViewData}
            padding={[20, 20, 95, 20]}
            scale={{
              'score': {
                min: 0,
                max: 100,
                tickCount: 5
              }
            }}
            forceFit
          >
            <Coord type="polar" radius={0.8}/>
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
            <Tooltip/>
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
            <Legend name="user" marker="circle" offset={30}/>
            <Geom type="line" position="item*score" color="user" size={2}/>
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
          <Chart
            key={'center-total-trend'}
            height={300}
            data={showDengDi ? lineData.map(data => {
              return {
                ...data,
                score: getDengDi(data.score)
              };
            }) : lineData}
            forceFit
            scale={{
              ...scale,
              exam: {
                tickCount: 8
              }
            }}
          >
            <p style={{ textAlign: 'center' }}>
              总分变化趋势
            </p>
            <Axis
              name="exam"
              label={{
                offset: 30,
                formatter(text, item, index) {
                  const pos = text.length / 3;
                  return `${text.slice(0, pos)}\n${text.slice(pos, 2 * pos)}\n${text.slice(2 * pos)}`;
                },
              }}
            />
            <Axis name="score"/>
            <Tooltip
              crosshairs={{
                type: "y"
              }}
            />
            <Geom type="line" position="exam*score" size={2}/>
            <Geom
              type="point"
              position="exam*score"
              size={4}
              shape={"circle"}
              style={{
                stroke: "#fff",
                lineWidth: 1
              }}
            />
          </Chart>
        </Col>
      </Row>
      {/*利用list进行布局*/}
      <List
        grid={{ gutter: 16, column: 2 }}
        dataSource={subData}
        renderItem={item => (
          <List.Item>
            <Chart
              key={`subject-${item.title}-trend`}
              height={300}
              data={showDengDi ? item.lineData.map(data => {
                return {
                  ...data,
                  score: getDengDi(data.score)
                };
              }) : item.lineData}
              scale={{
                ...scale,
                exam: {
                  tickCount: 6
                }
              }}
              forceFit
            >
              <p style={{ textAlign: 'center' }}>
                {`${COURSE_FULLNAME_ALIAS[item.title]} 考试趋势分析`}
              </p>
              <Axis
                name="exam"
                label={{
                  offset: 30,
                  formatter(text, item, index) {
                    const pos = text.length / 3;
                    return `${text.slice(0, pos)}\n${text.slice(pos, 2 * pos)}\n${text.slice(2 * pos)}`;
                  },
                }}
              />
              <Axis name="score"/>
              <Tooltip
                crosshairs={{
                  type: "y"
                }}
              />
              <Geom type="line" position="exam*score" size={2}/>
              <Geom
                type="point"
                position="exam*score"
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
    </React.Fragment>) : <Empty description='暂无考试数据'/>;
  }
);

export default ScoreLineChart;
