/**
 * Created by 胡晓慧 on 2019/4/13.
 */
import React, {memo} from "react";
import {Card, Col, Row} from 'antd';
import {Axis, Chart, Geom, Legend, Tooltip} from "bizcharts";
import DataSet from "@antv/data-set";
//单天消费总额对比数据
const data = [
  {
    time: "10:10",
    now: 4,
    last: 2,
    future: 2
  },
  {
    time: "10:15",
    now: 2,
    last: 6,
    future: 3
  },
  {
    time: "10:20",
    now: 13,
    last: 2,
    future: 5
  },
  {
    time: "10:25",
    now: 9,
    last: 9,
    future: 9
  },
  {
    time: "10:30",
    now: 5,
    last: 2,
    future: 8
  },
  {
    time: "10:35",
    now: 8,
    last: 2,
    future: 14
  },
  {
    time: "10:40",
    now: 13,
    last: 1,
    future: 2
  }
];
const scale = {
  now: {
    min: 0,max:20,
    alias: '本周',
    tickInterval: 2
  },
  last: {
    min: 0,max:20,
    alias: '上周',
    tickInterval: 2
  },
  future: {
    min: 0,max:20,
    alias: '下周预测',
    tickInterval: 2
  },
};
let chartIns = null;
//不同时间消费的对比数据
const hourlyCompConsumptionData = [
      {
        hour: '0时',
        全校同学: 0,
        该同学: 0,
      },
      {
        hour: '2时',
        全校同学: 6,
        该同学: 3,

      },
      {
        hour: '3时',
        全校同学: 7,
        该同学: 3,
      },
      {
        hour: '4时',
        全校同学: 9,
        该同学: 10,
      },
      {
        hour: '5时',
        全校同学: 20,
        该同学: 30,
      },
  {
        hour: '6时',
        全校同学: 0,
        该同学: 0,
      },
      {
        hour: '7时',
        全校同学: 6,
        该同学: 3,

      },
      {
        hour: '8时',
        全校同学: 7,
        该同学: 3,
      },
      {
        hour: '9时',
        全校同学: 9,
        该同学: 10,
      },
      {
        hour: '10时',
        全校同学: 20,
        该同学: 30,
      },
  {
        hour: '11时',
        全校同学: 0,
        该同学: 0,
      },
      {
        hour: '12时',
        全校同学: 6,
        该同学: 3,

      },
      {
        hour: '13时',
        全校同学: 7,
        该同学: 3,
      },
      {
        hour: '14时',
        全校同学: 9,
        该同学: 10,
      },
      {
        hour: '15时',
        全校同学: 20,
        该同学: 30,
      },
  {
        hour: '6时',
        全校同学: 0,
        该同学: 0,
      },
      {
        hour: '17时',
        全校同学: 6,
        该同学: 3,

      },
      {
        hour: '18时',
        全校同学: 7,
        该同学: 3,
      },
      {
        hour: '19时',
        全校同学: 9,
        该同学: 10,
      },
      {
        hour: '20时',
        全校同学: 20,
        该同学: 30,
      },
  {
        hour: '21时',
        全校同学: 0,
        该同学: 0,
      },
      {
        hour: '22时',
        全校同学: 6,
        该同学: 3,

      },
      {
        hour: '23时',
        全校同学: 7,
        该同学: 3,
      }
    ];
const hourlyCompConsumpData = new DataSet.View().source(hourlyCompConsumptionData).transform({
      type: "fold",
      fields: ["全校同学", "该同学"],
      // 展开字段集
      key: "user",
      // key字段
      value: "cost" // value字段
    });



const ConsumptionTimeSlotLineChart = memo(
  ({timelyConsumptionData, dailyConsumptionData, date}) => (
    <React.Fragment>
      <Card title="各时期消费情况一览" bordered={false} style={{width: '100%'}}>
        <Card title="单天消费总额对比" bordered={false} style={{width: '100%'}} hoverable={true}>
          <Row>
            <Col span={4}>
              {/*todo 文字分析,告警的触犯*/}
              <p>告警!!!该同学近期的消费水平与之前产生较大不同</p>
            </Col>
            <Col span={20}>
              <Chart
                height={400}
                scale={scale}
                forceFit
                data={data}
                onGetG2Instance={chart => {
                  chartIns = chart;
                }}
              >
                <Legend
                  custom={true}
                  allowAllCanceled={true}
                  items={[
                    {
                      value: "now",
                      marker: {
                        symbol: "square",
                        fill: "#F182bd",
                        radius: 5
                      }
                    },
                    {
                      value: "last",
                      marker: {
                        symbol: "hyphen",
                        stroke: "#3182bd",
                        radius: 5,
                        lineWidth: 3
                      }
                    },
                    {
                      value: "future",
                      marker: {
                        symbol: "hyphen",
                        stroke: "#ffae6b",
                        radius: 5,
                        lineWidth: 3
                      }
                    }
                  ]}
                  onClick={ev => {
                    const item = ev.item;
                    const value = item.value;
                    const checked = ev.checked;
                    const geoms = chartIns.getAllGeoms();

                    for (let i = 0; i < geoms.length; i++) {
                      const geom = geoms[i];

                      if (geom.getYScale().field === value) {
                        if (checked) {
                          geom.show();
                        } else {
                          geom.hide();
                        }
                      }
                    }
                  }}
                />
                <Axis name="now"/>
                <Tooltip />
                <Geom type="interval" position="time*now" color="#F182bd"/>
                <Geom
                  type="line"
                  position="time*last"
                  color="#3182bd"
                  size={2}
                  shape="smooth"
                />
                <Geom
                  type="point"
                  position="time*last"
                  color="#3182bd"
                  size={2}
                  shape="circle"
                />
                <Geom
                  type="line"
                  position="time*future"
                  color="#fdae6b"
                  size={2}
                  shape="smooth"
                />
                <Geom
                  type="point"
                  position="time*future"
                  color="#fdae6b"
                  size={2}
                  shape="circle"
                />
              </Chart>
            </Col>
          </Row>
        </Card>
        <Card title={`${date} 各时段的平均消费`} bordered={false} style={{width: '100%'}} hoverable={true}>
          <Row>
            <Col span={20}>
              <Chart
                height={400}
                data={hourlyCompConsumpData}
                scale={{
                  cost: {
                    min: 0
                  },
                  hour: {
                    min: 0,
                    max: 23,
                    tickCount: 24,
                  }

                }}
                forceFit>
                <Axis name="hour"/>
                <Legend/>
                <Tooltip
                  crosshairs={{
                    type: "y"
                  }}
                />
                <Geom type="line" position="hour*cost" size={2} color={"user"}/>
                <Geom
                  type="point"
                  position="hour*cost"
                  size={4}
                  shape={"circle"}
                  style={{
                    lineWidth: 1
                  }}
                  color={"user"}
                />
              </Chart>
            </Col>
            <Col span={4}>
              {/*todo 应该有一些实际总结,但我还不知道要总结什么*/}
              <p>该同学此段时刻的消费水平属于本校消费的平均水平</p>
              {/*文字分析*/}
            </Col>
          </Row>
        </Card>
      </Card>
    </React.Fragment>
  )
);

export default ConsumptionTimeSlotLineChart;
