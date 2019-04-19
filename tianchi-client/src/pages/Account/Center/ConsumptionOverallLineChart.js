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
    one: 5,
    all:10
  },
  {
    time: '1时',
    one: 22,
    all:10
  },
  {
    time: '2时',
    one: 23,
    all:10
  },
  {
    time: '3时',
    one: 12,
    all:10
  },
  {
    time: '4时',
    one: 3,
    all: 3
  },
  {
    time: '5时',
    one: 2,
    all: 2
  },
  {
    time: '6时',
    one: 23,
    all: 23
  },
  {
    time: '7时',
    one: 33,
    all: 33
  },
]
const scale = {
  one: {
    min: 0,
    alias: '该同学',
    tickInterval: 2
  },
  all: {
    min: 0,
    alias: '全校平均消费',
    tickInterval: 2
  }
};

const ConsumptionOverallLineChart = memo(
  ({timelyConsumptionData, dailyConsumptionData, date}) => (
    <React.Fragment>
      {/*两个有标题的card用来表示某时刻消费和对比消费*/}
      <Card title="总体消费情况一览" bordered={false} style={{width: '100%'}}>
        <Row>
          <Col span={20}>
            <Card title="总体消费趋势" bordered={false} style={{width: '100%'}} hoverable={true}>
          <OneTimelineChart
            height={300}
            data={DaySumConsumptionData}
          />
        </Card>
          </Col>
          <Col span={3} offset={1}>
            <Card title="总结" bordered={false} style={{width: '100%'}} hoverable={true}>
              <p>该同学消费趋势比较稳定</p>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={3}>
            <Card title="总结" bordered={false} style={{width: '100%'}} hoverable={true}>
              <p>该同学消费水平属于本校消费的平均水平</p>
            </Card>
          </Col>
          <Col span={20} offset={1}>
            <Card title="不同时间点平均消费对比" bordered={false} style={{width: '100%'}} hoverable={true}>
          <Chart
            height={400}
            data={TimelyConsumptionData}
            scale={scale}
            forceFit
          >
             <Legend
                  custom={true}
                  allowAllCanceled={true}
                  items={[
                    {
                      value: "该同学",
                      marker: {
                        symbol: "square",
                        fill: "#0099CC",
                        radius: 5
                      }
                    },
                    {
                      value: "全校平均消费",
                      marker: {
                        symbol: "hyphen",
                        stroke: "#FF9900",
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
            <Axis name="time"/>
            <Tooltip/>
            <Geom type="interval" position="time*one" color="#0099CC"/>
            <Geom type="line" position="time*all" color="#FF9900" size={2} shape="smooth"/>
            <Geom type="point" position="time*all" color="#FF9900" size={3} shape="circle"/>
          </Chart>
        </Card>
          </Col>
        </Row>
      </Card>
    </React.Fragment>
  )
);

export default ConsumptionOverallLineChart;
