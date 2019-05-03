/**
 * Created by 胡晓慧 on 2019/4/13.
 */
import React, { memo } from "react";
import { Col, Empty, List, Row } from 'antd';
import { Axis, Chart, Coord, Geom, Guide, Legend, Tooltip } from "bizcharts";
import { COURSE_FULLNAME_ALIAS, getDengDi } from "@/constants";

const { Line } = Guide;
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
  ({ lineData, radarViewData, subData, scoreType }) => {
    const showDengDi = scoreType === 'deng_di';
    const scale = showDengDi ? dengDiScale : normalScale;
    return (lineData && !!lineData.length) ? <React.Fragment>
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
                tickCount: 4

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
            <Geom type="line" position="exam*score" size={2} tooltip={[
              "score",
              (score) => {
                return {
                  name: "分数",
                  value: score
                };
              }
            ]}/>
            <Geom
              type="point"
              position="exam*score"
              size={4}
              shape={"circle"}
              style={{
                stroke: "#fff",
                lineWidth: 1
              }}
              tooltip={[
                "score",
                (score) => {
                  return {
                    name: "分数",
                    value: score
                  };
                }
              ]}
            />
            {scoreType === 'score' && <Guide key='student-score-lines'>
              <Line
                key='student-score-line1'
                top={true}
                start={[-1, 588]}
                end={['max', 588]}
                lineStyle={{
                  stroke: '#99203e',
                  lineDash: [0, 2, 2],
                  lineWidth: 2,
                  opacity: 0.4,
                }}
                text={{
                  position: '1%',
                  content: "2018 一段线 588",
                  style: {
                    opacity: 0.5,
                    fill: "#99203e",
                  }
                }}
              />
              <Line
                key='student-score-line2'
                top={true}
                start={[-1, 490]}
                end={['max', 490]}
                lineStyle={{
                  stroke: '#99203e',
                  lineDash: [0, 2, 2],
                  lineWidth: 2,
                  opacity: 0.4,
                }}
                text={{
                  position: '1%',
                  content: "2018 二段线 490",
                  style: {
                    opacity: 0.5,
                    fill: "#99203e",
                  }
                }}
              />
              <Line
                key='student-score-line3'
                top={true}
                start={[-1, 344]}
                end={['max', 344]}
                lineStyle={{
                  stroke: '#99203e',
                  lineDash: [0, 2, 2],
                  lineWidth: 2,
                  opacity: 0.4,
                }}
                text={{
                  position: '1%',
                  content: "2018 三段线 344",
                  style: {
                    fill: "#99203e",
                    opacity: 0.5,
                  }
                }}
              />
              <Line
                key='student-score-line4'
                top={true}
                start={[-1, 577]}
                end={['max', 577]}
                lineStyle={{
                  stroke: '#6b561e',
                  lineDash: [0, 2, -1],
                  lineWidth: 2,
                  opacity: 0.2,
                }} // 图形样式配置
                text={{
                  position: '70%',
                  content: "2017 一段线 577",
                  style: {
                    fill: "#6b561e",
                    opacity: 0.5,
                  }
                }}
              />
              <Line
                key='student-score-line5'
                top={true}
                start={[-1, 480]}
                end={['max', 480]}
                lineStyle={{
                  stroke: '#6b561e',
                  lineDash: [0, 2, -1],
                  lineWidth: 2,
                  opacity: 0.2,
                }}
                text={{
                  position: '70%',
                  content: "2017 二段线 480",
                  style: {
                    fill: "#6b561e",
                    opacity: 0.5,
                  }
                }}
              />
              <Line
                key='student-score-line6'
                top={true}
                start={[-1, 359]}
                end={['max', 359]}
                lineStyle={{
                  stroke: '#6b561e',
                  lineDash: [0, 2, -1],
                  lineWidth: 2,
                  opacity: 0.2,
                }}
                text={{
                  position: '70%',
                  content: "2017 三段线 359",
                  style: {
                    fill: "#6b561e",
                    opacity: 0.5,
                  }
                }}
              />
            </Guide>}
          </Chart>
        </Col>
      </Row>
      {/*利用list进行布局*/}
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 1, xl: 2, xxl: 2 }}
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
                  tickCount: 3
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
              <Geom type="line" position="exam*score" size={2} tooltip={[
                "score",
                (score) => {
                  return {
                    name: "分数",
                    value: score
                  };
                }
              ]}/>
              <Geom
                type="point"
                position="exam*score"
                size={4}
                shape={"circle"}
                style={{
                  stroke: "#fff",
                  lineWidth: 1
                }}
                tooltip={[
                  "score",
                  (score) => {
                    return {
                      name: "分数",
                      value: score
                    };
                  }
                ]}
              />
            </Chart>
          </List.Item>
        )}
      />
    </React.Fragment> : <Empty description='暂无考试数据'/>;
  }
);

export default ScoreLineChart;
