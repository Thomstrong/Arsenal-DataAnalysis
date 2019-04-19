/**
 * Created by 胡晓慧 on 2019/4/13.
 */
import React, {memo} from "react";
import {Card, Col, Row} from 'antd';
import {Axis, Chart, Geom, Legend, Tooltip} from "bizcharts";
import {OneTimelineChart} from '@/components/Charts';

const DaySumConsumptionData = [
  {
    x: Date.parse('2019-01-01'),
    y: 20
  },
  {
    x: Date.parse('2019-01-02'),
    y: 33
  },
  {
    x: Date.parse('2019-01-03'),
    y: 2
  },
  {
    x: Date.parse('2019-01-04'),
    y: 3
  },
  {
    x: Date.parse('2019-01-05'),
    y: 20
  },
  {
    x: Date.parse('2019-01-06'),
    y: 30
  },
  {
    x: Date.parse('2019-01-07'),
    y: 2
  },
  {
    x: Date.parse('2019-01-08'),
    y: 30
  },
  {
    x: Date.parse('2019-01-09'),
    y: 20
  },
  {
    x: Date.parse('2019-01-10'),
    y: 30
  },
  {
    x: Date.parse('2019-01-11'),
    y: 2
  },
  {
    x: Date.parse('2019-01-12'),
    y: 30
  }
];
const TimelyConsumptionData = [
  {
    time: '0时',
    cost: 5
  },
  {
    time: '1时',
    cost: 22
  },
  {
    time: '2时',
    cost: 23
  },
  {
    time: '3时',
    cost: 12
  },
  {
    time: '4时',
    cost: 3
  },
  {
    time: '5时',
    cost: 2
  },
  {
    time: '6时',
    cost: 23
  },
  {
    time: '7时',
    cost: 33
  },
]

const ConsumptionOverallLineChart = memo(
  ({timelyConsumptionData, dailyConsumptionData, date}) => (
    <React.Fragment>
      {/*两个有标题的card用来表示某时刻消费和对比消费*/}
      <Card title="总体消费情况一览" bordered={false} style={{width: '100%'}}>
        <Card title="总体消费趋势" bordered={false} style={{width: '100%'}} hoverable={true}>
          <OneTimelineChart
            height={300}
            data={DaySumConsumptionData}
          />
        </Card>
        <Card title="不同时间点平均消费对比" bordered={false} style={{width: '100%'}} hoverable={true}>
          <Chart
            height={400}
            data={TimelyConsumptionData}
            scale={{
              cost: {
                min: 0
              },
              year: {
                tickInterval: 5
              }
            }}
            forceFit
          >
            <Legend/>
            <Axis name="time"/>
            <Axis
              name="cost"
            />
            <Tooltip
              crosshairs={{
                type: "y"
              }}
            />
            <Geom type="interval" position="time*cost"/>
          </Chart>
        </Card>
      </Card>
    </React.Fragment>
  )
);

export default ConsumptionOverallLineChart;
