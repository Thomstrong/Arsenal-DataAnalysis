/**
 * Created by 胡晓慧 on 2019/4/13.
 */
import React, { memo } from "react";
import { Card, Col, Row } from 'antd';
import { Axis, Chart, Geom, Legend, Tooltip } from "bizcharts";


const ConsumptionLineChart = memo(
  ({ timelyConsumptionData, dailyConsumptionData, date }) => (
    <React.Fragment>
      {/*两个有标题的card用来表示某时刻消费和对比消费*/}
      <Card title={`${date} 各时段的平均消费`} bordered={false} style={{ width: '100%' }}>
        <Row>
          <Col span={20}>
            {/*todo 可以加上datamarker*/}
            <Chart
              height={400}
              data={timelyConsumptionData}
              scale={{
                total_cost: {
                  min: 0
                },
                hour: {
                  min: 0,
                  max:23,
                  tickCount: 24,
                }

              }}
              forceFit>
              <Axis name="时间"/>
              <Axis name="花费"/>
              <Tooltip
                crosshairs={{
                  type: "y"
                }}
              />
              <Geom type="line" position="hour*total_cost" size={2}/>
              <Geom
                type="point"
                position="hour*total_cost"
                size={4}
                shape={"circle"}
                style={{
                  stroke: "#fff",
                  lineWidth: 1
                }}
              />
            </Chart>
          </Col>
          <Col span={4}>
            {/*todo 应该有一些实际总结,但我还不知道要总结什么*/}
            <p>该同学情况还是很稳定的呀</p>
            {/*文字分析*/}
          </Col>
        </Row>
      </Card>
      <Card title="单天消费总额对比" bordered={false} style={{ width: '100%' }}>
        <Row>
          <Col span={4}>
            {/*todo 文字分析,告警的触犯*/}
            <p>告警!!!该同学近期的消费水平与之前产生较大不同</p>
          </Col>
          <Col span={20}>
            <Chart
              height={400}
              data={dailyConsumptionData}
              scale={{
                total_cost: {
                  min: 0
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
              <Geom
                type="line"
                position="time*cost"
                size={2}
                color={"diftime"}
              />
              <Geom
                type="point"
                position="time*cost"
                size={4}
                shape={"circle"}
                color={"diftime"}
                style={{
                  stroke: "#fff",
                  lineWidth: 1
                }}
              />
            </Chart>
          </Col>
        </Row>
      </Card>
    </React.Fragment>
  )
);

export default ConsumptionLineChart;
