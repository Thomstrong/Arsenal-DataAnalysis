/**
 * Created by 胡晓慧 on 2019/4/13.
 */
import React, { memo } from "react";
import { Card, Col, Empty, List, Row, Typography } from 'antd';
import { Axis, Chart, Coord, Geom, Guide, Legend, Tooltip } from "bizcharts";
import { COURSE_FULLNAME_ALIAS, getDengDi, SCORE_TYPE_ALIAS,PING_SHI_EXAM_TYPES } from "@/constants";
import Divider from "antd/es/divider";

const { Paragraph, Text } = Typography;
const { Line } = Guide;
const dengDiList = [
  'E',
  'D',
  'C',
  'B',
  'A',
];
const dengDiScale = {
  score: {
    type: 'cat',
    values: dengDiList
  }
};
const normalScale = {
  score: {}
};


const ScoreLineChart = memo(
  ({ lineData, radarViewData, lineSummary, subData, scoreType, excludePingshi }) => {
    let highScoreTime = 0;
    if (scoreType === 'score') {
      for (let data of lineData) {
        if ((!excludePingshi || !PING_SHI_EXAM_TYPES.includes(data.type)) && data.score >= 600) {
          highScoreTime++;
        }
      }
    }
    const getFilteredData = data => data.filter(d => !excludePingshi || !PING_SHI_EXAM_TYPES.includes(d.type));
    let minMaxData= getFilteredData(lineData);
    let i = 0;
    let maxScore=0;
    let minScore=1000;
    if(minMaxData.length){
      for (i=0;i<minMaxData.length;i++){
          if (maxScore < minMaxData[i].score){
              maxScore = minMaxData[i].score
            }
          if(minScore> minMaxData[i].score){
            minScore = minMaxData[i].score
          }
      }
    }
    const isRank = scoreType === 'class_rank';
    const showDengDi = scoreType === 'deng_di';
    const scale = showDengDi ? dengDiScale : isRank ? {
      score: {
        max: -1, min: -50,
        ticks: [-1, -10, -20, -30, -40, -50]
      }
    } : normalScale;
    return (lineData && !!lineData.length) ? <React.Fragment>
      <Row>
        <Col span={8}>
          <Chart
            key={'center-radar'}
            height={300}
            data={radarViewData}
            padding={[30, 20, 55, 20]}
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
            key={'center-total-trend'}
            height={300}
            data={showDengDi ? getFilteredData(lineData).map(data => {
              return {
                ...data,
                score: getDengDi(data.score)
              };
            }) : (isRank ? getFilteredData(lineData).map(data => {
              return {
                ...data,
                score: -(data.score)
              };
            }) : getFilteredData(lineData))}
            forceFit
            scale={{
              ...scale,
              exam: {
                tickCount: 5
              },
            }}
          >
            <p style={{ textAlign: 'center' }}>
              {`总分${SCORE_TYPE_ALIAS[scoreType]}变化趋势`}
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
            <Axis
              name="score"
              label={{
                formatter(text, item, index) {
                  return isRank ? -Number(text) : text;
                },
              }}
            />
            <Tooltip
              crosshairs={{
                type: "y"
              }}
            />
            <Geom type="line" position="exam*score" size={2} tooltip={[
              "score",
              (score) => {
                if (showDengDi) {
                  return {
                    name: "等第",
                    value: dengDiList[score]
                  };
                }

                if (isRank) {
                  return {
                    name: "排名",
                    value: -score
                  };
                }
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
                  if (showDengDi) {
                    return {
                      name: "等第",
                      value: dengDiList[score]
                    };
                  }
                  if (isRank) {
                    return {
                      name: "排名",
                      value: -score
                    };
                  }
                  return {
                    name: "分数",
                    value: score
                  };
                }
              ]}
            />
            {scoreType === 'score' && <Guide key='student-score-lines'>
              {maxScore>=588 && minScore<=588 && <Line
                key='student-score-line1'
                top={true}
                start={[-0.5, 588]}
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
              />}
              {maxScore>=490 && minScore<=490 && <Line
                key='student-score-line2'
                top={true}
                start={[-0.5, 490]}
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
              />}
              {maxScore>=344 && minScore<=344 && <Line
                key='student-score-line3'
                top={true}
                start={[-0.5, 344]}
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
              />}
              {maxScore>=577 && minScore<=577 && <Line
                key='student-score-line4'
                top={true}
                start={[-0.5, 577]}
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
              />}
              {maxScore>=480 && minScore<=480 && <Line
                key='student-score-line5'
                top={true}
                start={[-0.5, 480]}
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
              />}
              {maxScore>=359 && minScore<=359 && <Line
                key='student-score-line6'
                top={true}
                start={[-0.5, 359]}
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
              />}
            </Guide>}
          </Chart>
        </Col>
      </Row>
      <Divider style={{ marginTop: 0, marginBottom: 5 }} dashed/>
      {lineSummary && lineSummary.unstable &&
      <Card
        bordered={false} hoverable={true} type="inner"
        style={{
          margin: '0 12px',
          cursor: "auto"
        }}
        bodyStyle={{
          paddingBottom: 0,
          paddingTop: '20px',
        }}
      >
        <Paragraph>
          该生的优势学科是<Text type="danger" strong>{lineSummary.advantage}</Text>，
          薄弱学科为<Text type="danger">
          {lineSummary.disadvantage}</Text>，
          不稳定学科为<Text type="danger">{lineSummary.unstable}</Text></Paragraph>
        {scoreType === 'score' && <Paragraph>共统计<Text type="danger">{lineData.length}</Text>次考试，
          总分在600及以上的有<Text type="danger">{highScoreTime}</Text>次</Paragraph>}
      </Card>}
      <Divider style={{ marginBottom: 24, marginTop: 5 }} dashed>各科目成绩趋势</Divider>
      <List
        grid={{ gutter: 16, xs: 1, sm: 1, md: 2, lg: 1, xl: 2, xxl: 2 }}
        dataSource={subData}
        renderItem={item => (
          <List.Item>
            <Chart
              key={`subject-${item.title}-trend`}
              height={300}
              data={showDengDi ? getFilteredData(item.lineData).map(data => {
                return {
                  ...data,
                  score: getDengDi(data.score)
                };
              }) : isRank ? getFilteredData(item.lineData).map(data => {
                return {
                  ...data,
                  score: -data.score
                };
              }) : getFilteredData(item.lineData).map(data => {
                return {
                  ...data,
                  score: Number(data.score.toFixed(2))
                };
              })
              }
              scale={{
                ...scale,
                exam: {
                  tickCount: 3
                }
              }}
              forceFit
            >
              <p style={{ textAlign: 'center' }}>
                {`${COURSE_FULLNAME_ALIAS[item.title]}考试${SCORE_TYPE_ALIAS[scoreType]}趋势分析`}
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
              <Axis
                name="score"
                label={{
                  formatter(text, item, index) {
                    return isRank ? -Number(text) : text;
                  },
                }}
              />
              <Tooltip
                crosshairs={{
                  type: "y"
                }}
              />
              <Geom type="line" position="exam*score" size={2} tooltip={[
                "score",
                (score) => {
                  if (showDengDi) {
                    return {
                      name: "等第",
                      value: dengDiList[score]
                    };
                  }

                  if (isRank) {
                    return {
                      name: "排名",
                      value: -score
                    };
                  }
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

              {scoreType === 'z_score' && <Guide key='student-score-lines'>
                <Line
                  key='student-z-score-line'
                  top={true}
                  start={(xScale, yScale) => {
                    if (yScale.score.min > 0) {
                      return [-0.5, -100];
                    }
                    return [-0.5, 0];

                  }}
                  end={(xScale, yScale) => {
                    if (yScale.score.min > 0) {
                      return ['max', -100];
                    }
                    return ['max', 0];

                  }}
                  lineStyle={{
                    stroke: '#67686e',
                    lineDash: [0, 2, 2],
                    lineWidth: 2,
                    opacity: 0.4,
                  }}
                />
              </Guide>}
            </Chart>
          </List.Item>
        )}
      />
    </React.Fragment> : <Empty description='暂无考试数据'/>;
  }
);

export default ScoreLineChart;
