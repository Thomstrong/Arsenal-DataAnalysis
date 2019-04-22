/**
 * Created by 胡晓慧 on 2019/4/13.
 */
import React, {memo} from "react";
import {Col, List, Row} from 'antd';
import {Axis, Chart, Coord, Geom, Legend,Guide,Tooltip} from "bizcharts";
import {COURSE_FULLNAME_ALIAS} from "@/constants";


// const SingleLineChart  =  React.lazy(()=> import ('@/components/Charts'));

const { Line } = Guide;
const ScoreLineChart = memo(
  ({lineData, radarViewData, subData}) => (
    <React.Fragment>
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
              height={300} data={lineData} forceFit
              scale={{
                exam: {
                  tickCount: 10
                }
              }}
            >
              <p style={{textAlign: 'center'}}>
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
              {/*todo 判断是不是绝对分已确定显示辅助线*/}
              <Guide>
                <Line
                  top={true}
                  start={[-1, 588]} // 辅助线起始位置，值为原始数据值，支持 callback
                  end={['max', 588]}
                  lineStyle={{
                    stroke: '#999', // 线的颜色
                    lineDash: [0, 2, 2],
                    lineWidth: 2
                  }}
                  text={{
                    position: 'start',
                    content: "2018 一段线 588", // 文本的内容
                    style: {
                      Rotate: 90,
                    }
                  }}
                />
                <Line
                  top={true}
                  start={[-1, 490]} // 辅助线起始位置，值为原始数据值，支持 callback
                  end={['max', 490]}
                  lineStyle={{
                    stroke: '#999', // 线的颜色
                    lineDash: [0, 2, 2], // 虚线的设置
                    lineWidth: 2 // 线的宽度
                  }} // 图形样式配置
                  text={{
                    position: 'start',
                    content: "2018 二段线 490", // 文本的内容
                    style: {
                      Rotate: 90,
                    }
                  }}
                />
                <Line
                  top={true}
                  start={[-1, 344]} // 辅助线起始位置，值为原始数据值，支持 callback
                  end={['max', 344]}
                  lineStyle={{
                    stroke: '#999', // 线的颜色
                    lineDash: [0, 2, 2], // 虚线的设置
                    lineWidth: 2 // 线的宽度
                  }} // 图形样式配置
                  text={{
                    position: 'start',
                    content: "2018 三段线 344", // 文本的内容
                    style: {
                      Rotate: 90,
                    }
                  }}
                />
                <Line
                  top={true}
                  start={[-1, 577]} // 辅助线起始位置，值为原始数据值，支持 callback
                  end={['max', 577]}
                  lineStyle={{
                    stroke: '#999', // 线的颜色
                    lineDash: [0, 2, 2], // 虚线的设置
                    lineWidth: 1 // 线的宽度
                  }} // 图形样式配置
                  text={{
                    position: 'start',
                    content: "2017 一段线 577", // 文本的内容
                    style: {
                      Rotate: 90,
                    }
                  }}
                />
                <Line
                  top={true}
                  start={[-1, 480]} // 辅助线起始位置，值为原始数据值，支持 callback
                  end={['max', 480]}
                  lineStyle={{
                    stroke: '#999', // 线的颜色
                    lineDash: [0, 2, 2], // 虚线的设置
                    lineWidth: 1 // 线的宽度
                  }} // 图形样式配置
                  text={{
                    position: 'start',
                    content: "2017 二段线 480", // 文本的内容
                    style: {
                      Rotate: 90,//todo 旋转角度，没变化
                    }
                  }}
                />
                <Line
                  top={true}
                  start={[-1, 359]} // 辅助线起始位置，值为原始数据值，支持 callback
                  end={['max', 359]}
                  lineStyle={{
                    stroke: '#999', // 线的颜色
                    lineDash: [0, 2, 2], // 虚线的设置
                    lineWidth: 1 // 线的宽度
                  }} // 图形样式配置
                  text={{
                    position: 'start',
                    content: "2017 三段线 359", // 文本的内容
                    style: {
                      Rotate: 90,
                    }
                  }}
                />
              </Guide>
            </Chart>
            {/*todo 企图把单折线图变成component,但是后来觉得似乎没有必要*/}
            {/*<SingleLineChart*/}
            {/*data = {lineData}*/}
            {/*/>*/}
          </Col>
        </Row>
        {/*利用list进行布局*/}
        <List
          grid={{gutter: 16, column: 2}}
          dataSource={subData}
          renderItem={item => (
            <List.Item>
              <Chart
                height={300} data={item.lineData}
                scale={{
                  exam: {
                    tickCount: 8
                  }
                }}
                forceFit
              >
                <p style={{textAlign: 'center'}}>
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
      </div>
    </React.Fragment>
  )
);

export default ScoreLineChart;
