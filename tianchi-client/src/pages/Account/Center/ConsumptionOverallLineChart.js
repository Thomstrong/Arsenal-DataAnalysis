/**
 * Created by 胡晓慧 on 2019/4/13.
 */
import React, { memo } from "react";
import { Card, Col, Empty, Row } from 'antd';
import { Axis, Chart, Geom, Legend, Tooltip } from "bizcharts";
import { OneTimelineChart } from '@/components/Charts';

let chartIns = null;

const ConsumptionOverallLineChart = memo(
  ({ hourlyAvgCost, dailySumCost, maxHourlyAvg }) => {
    if (chartIns) {
      const geoms = chartIns.getAllGeoms();
      for (let geom of geoms) {
        geom && geom.show();
      }
    }
    return (
      <Card title="总体消费情况一览" bordered={false} style={{ width: '100%' }}>
        <Row>
          <Col span={20}>
            <Card title="总体消费趋势" bordered={false} style={{ width: '100%' }} hoverable={true}>
              {dailySumCost.length ? <OneTimelineChart
                height={300}
                data={dailySumCost.map((data) => {
                  return {
                    x: Date.parse(data.date),
                    y: data.total
                  };
                })}
              /> : <Empty/>}
            </Card>
          </Col>
          <Col span={3} offset={1}>
            <Card title="总结" bordered={false} style={{ width: '100%' }} hoverable={true}>
              <p>该同学消费趋势比较稳定</p>
            </Card>
          </Col>
        </Row>
        <Row>
          <Col span={3}>
            <Card title="总结" bordered={false} style={{ width: '100%' }} hoverable={true}>
              <p>该同学消费水平属于本校消费的平均水平</p>
            </Card>
          </Col>
          <Col span={20} offset={1}>
            <Card title="不同时间点平均消费对比" bordered={false} style={{ width: '100%' }} hoverable={true}>
              {dailySumCost.length ? <Chart
                height={400}
                data={hourlyAvgCost}
                scale={{
                  hour: {
                    min: 0,
                    max: 23,
                    tickInterval: 1
                  },
                  avg_cost: {
                    min: 0,
                    max: maxHourlyAvg,
                    alias: '该同学',
                    tickInterval: 5
                  },
                  total_avg: {
                    min: 0,
                    max: maxHourlyAvg,
                    alias: '全校平均消费',
                    tickInterval: 5
                  }
                }}
                onGetG2Instance={chart => {
                  chartIns = chart;
                }}
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
                  onClick={({ item, checked }) => {
                    const { value } = item;
                    const geoms = chartIns.getAllGeoms();
                    for (let geom of geoms) {
                      if (geom.getYScale().alias === value) {
                        if (checked) {
                          geom.show();
                          continue;
                        }
                        geom.hide();
                      }
                    }
                  }}
                />
                <Axis name="hour"/>
                {/*<Axis name="total_avg" visible={false}/>*/}
                <Tooltip/>
                <Geom type="interval" position="hour*avg_cost" color="#0099CC"/>
                <Geom type="line" position="hour*total_avg" color="#FF9900" size={2} shape="smooth"/>
                <Geom type="point" position="hour*total_avg" color="#FF9900" size={3} shape="circle"/>
              </Chart> : <Empty/>}
            </Card>
          </Col>
        </Row>
      </Card>
    );
  }
);

export default ConsumptionOverallLineChart;
