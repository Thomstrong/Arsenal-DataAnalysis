/**
 * Created by 胡晓慧 on 2019/4/13.
 */
import React, { memo } from "react";
import { Col, Divider, List, Row } from 'antd';
import { Axis, Chart, Coord, Geom, Guide, Legend, Tooltip } from "bizcharts";
import { COURSE_FULLNAME_ALIAS, PING_SHI_EXAM_TYPES } from "@/constants";

const { Line } = Guide;

const ScoreTrendChart = memo(
  ({ lineData, radarViewData, subData, scoreType, maxRank, excludePingshi }) => {
    let scale = {
      score: {}
    };
    const isRank = scoreType === 'rank';
    const getFilteredData = data => data.filter(d => !excludePingshi || !PING_SHI_EXAM_TYPES.includes(d.type));
    if (isRank) {
      const values = [];
      for (let i = 0; i < maxRank; i++) {
        values.push(`${maxRank - i}`);
      }
      scale.score = {
        type: 'cat',
        values
      };
    }
    return <React.Fragment>
      <div>
        <Row>
          <Col span={8}>
            <Chart
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
                label={null}
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
              key={'class-score-total-trend'}
              height={300}
              data={isRank ? getFilteredData(lineData).map(data => {
                return {
                  ...data,
                  score: maxRank - data.score
                };
              }) : getFilteredData(lineData)}
              forceFit
              scale={{
                exam: {
                  tickCount: 5
                },
                ...scale
              }}
            >
              <p style={{ textAlign: 'center' }}>
                {`总分${isRank ? '排名' : ''}变化趋势`}
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
              <Geom
                type="line" size={2}
                position="exam*score"
                tooltip={[
                  "score",
                  (score) => {
                    return {
                      name: `${isRank ? '排名' : '分数'}`,
                      value: isRank ? (maxRank - score).toFixed(0) : score.toFixed(3)
                    };
                  }
                ]}/>
              <Geom
                type="point"
                position="exam*score"
                tooltip={[
                  "score",
                  (score) => {
                    return {
                      name: `${isRank ? '排名' : '分数'}`,
                      value: isRank ? (maxRank - score).toFixed(0) : score.toFixed(3)
                    };
                  }
                ]}
                size={4}
                shape={"circle"}
                style={{
                  stroke: "#fff",
                  lineWidth: 1
                }}
              />
              <Guide>
                <Line
                  top={true}
                  start={[-0.5, 588]}
                  end={['max', 588]}
                  lineStyle={{
                    stroke: '#99203e',
                    lineDash: [0, 2, 2],
                    lineWidth: 2,
                    opacity: 0.3,
                  }}
                  text={{
                    position: '5%',
                    content: "2018 一段线 588",
                    style: {
                      opacity: 0.3,
                      fill: "#99203e",
                    }
                  }}
                />
                <Line
                  top={true}
                  start={[-0.5, 490]}
                  end={['max', 490]}
                  lineStyle={{
                    stroke: '#99203e',
                    lineDash: [0, 2, 2],
                    lineWidth: 2,
                    opacity: 0.3,
                  }} // 图形样式配置
                  text={{
                    position: '5%',
                    content: "2018 二段线 490",
                    style: {
                      opacity: 0.3,
                      fill: "#99203e",
                    }
                  }}
                />
                <Line
                  top={true}
                  start={[-0.5, 344]}
                  end={['max', 344]}
                  lineStyle={{
                    stroke: '#99203e',
                    lineDash: [0, 2, 2],
                    lineWidth: 2,
                    opacity: 0.3,
                  }}
                  text={{
                    position: '5%',
                    content: "2018 三段线 344",
                    style: {
                      fill: "#99203e",
                      opacity: 0.3,
                    }
                  }}
                />
                <Line
                  top={true}
                  start={[-0.5, 577]}
                  end={['max', 577]}
                  lineStyle={{
                    stroke: '#6b561e',
                    lineDash: [0, 2, 2],
                    lineWidth: 2,
                    opacity: 0.3,
                  }} // 图形样式配置
                  text={{
                    position: '75%',
                    content: "2017 一段线 577",
                    style: {
                      fill: "#6b561e",
                      opacity: 0.3,
                    }
                  }}
                />
                <Line
                  top={true}
                  start={[-0.5, 480]}
                  end={['max', 480]}
                  lineStyle={{
                    stroke: '#6b561e',
                    lineDash: [0, 2, 2],
                    lineWidth: 2,
                    opacity: 0.3,
                  }}
                  text={{
                    position: '75%',
                    content: "2017 二段线 480",
                    style: {
                      fill: "#6b561e",
                      opacity: 0.3,
                    }
                  }}
                />
                <Line
                  top={true}
                  start={[-0.5, 359]}
                  end={['max', 359]}
                  lineStyle={{
                    stroke: '#6b561e',
                    lineDash: [0, 2, 2],
                    lineWidth: 2,
                    opacity: 0.3,
                  }}
                  text={{
                    position: '75%',
                    content: "2017 三段线 359",
                    style: {
                      fill: "#6b561e",
                      opacity: 0.3,
                    }
                  }}
                />
              </Guide>
            </Chart>
          </Col>
        </Row>
        <Divider style={{ marginBottom: 24, marginTop: 5 }} dashed>各科目成绩趋势</Divider>
        <List
          grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 1, xl: 2, xxl: 2 }}
          dataSource={subData}
          renderItem={item => (
            <List.Item>
              <Chart
                height={300}
                data={isRank ? getFilteredData(item.lineData).map(data => {
                  return {
                    ...data,
                    score: maxRank - data.score
                  };
                }) : getFilteredData(item.lineData)}
                scale={{
                  exam: {
                    tickCount: 3
                  },
                  ...scale
                }}
                forceFit
              >
                <p style={{ textAlign: 'center' }}>
                  {`${COURSE_FULLNAME_ALIAS[item.title]} 考试${isRank ? '排名' : '分数'}趋势分析`}
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
                      name: isRank ? '排名' : "分数",
                      value: isRank ? (maxRank - score).toFixed(0) : score.toFixed(3)
                    };
                  }
                ]}/>
                <Geom
                  type="point"
                  position="exam*score"
                  tooltip={[
                    "score",
                    (score) => {
                      return {
                        name: isRank ? '排名' : "分数",
                        value: isRank ? (maxRank - score).toFixed(0) : score.toFixed(3)
                      };
                    }
                  ]}
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
    </React.Fragment>;
  }
);

export default ScoreTrendChart;
