/**
 * Created by 胡晓慧 on 2019/4/13.
 */
import React, { memo } from "react";
import { Card, Col, Row } from 'antd';
import { Axis, Chart, Geom, Legend, Tooltip } from "bizcharts";
import { DATE_REANGE_ALIAS, INTERVAL_MAP } from "@/constants";
import moment from "moment";
//单天消费总额对比数据

let chartIns = null;

const ConsumptionTimeSlotLineChart = memo(
  ({ hourlyCost, dailyPredictData, date, dateRange, maxCost }) => (
    <React.Fragment>
      <Card title={`${date} 各时期消费情况一览`} bordered={false} style={{ width: '100%' }}>
        <Card title={`${date}起往后${DATE_REANGE_ALIAS[dateRange]}，每日消费总额、上一周期消费对比及下一周期消费预测`}
              bordered={false} style={{ width: '100%' }} hoverable={true}
        >
          <Row>
            <Col span={4}>
              {/*todo 文字分析,告警的触犯*/}
              <p>告警!!!该同学近期的消费水平与之前产生较大不同</p>
            </Col>
            <Col span={20}>
              <Chart
                height={400}
                scale={{
                  now: {
                    alias: '当前时间',
                    min: 0, max: maxCost + 10,
                    tickInterval: 10
                  },
                  last: {
                    alias: `${DATE_REANGE_ALIAS[dateRange]}前`,
                    min: 0, max: maxCost + 10,
                    tickInterval: 10
                  },
                  future: {
                    alias: `${DATE_REANGE_ALIAS[dateRange]}后预测`,
                    min: 0, max: maxCost + 10,
                    tickInterval: 10
                  },
                  offset: {
                    alias: `距离${date}天数`,
                    min: 0, max: dateRange,
                    tickInterval: INTERVAL_MAP[dateRange]
                  }
                }}
                forceFit
                data={dailyPredictData}
                onGetG2Instance={chart => {
                  chartIns = chart;
                }}
              >
                <Legend
                  custom={true}
                  allowAllCanceled={true}
                  items={[
                    {
                      value: '当前时间',
                      marker: {
                        symbol: "square",
                        fill: "#F182bd",
                        radius: 5
                      }
                    },
                    {
                      value: `${DATE_REANGE_ALIAS[dateRange]}前`,
                      marker: {
                        symbol: "hyphen",
                        stroke: "#3182bd",
                        radius: 5,
                        lineWidth: 3
                      }
                    },
                    {
                      value: `${DATE_REANGE_ALIAS[dateRange]}后预测`,
                      marker: {
                        symbol: "hyphen",
                        stroke: "#ffae6b",
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
                <Axis name="now"/>
                <Axis name="future" visible={false}/>
                <Axis name="last" visible={false}/>
                <Tooltip
                  crosshairs={{
                    type: 'y',
                  }}
                />
                <Geom
                  type="interval"
                  position="offset*now"
                  color={"#F182bd"}
                  tooltip={['offset*now', (offset, now) => {
                    return {
                      name: '当天消费金额',
                      title: moment(date).add(offset, 'days').format('YYYY-MM-DD'),
                      value: now || 0,
                      shared: true
                    };
                  }]}
                />
                <Geom
                  type="line"
                  position="offset*last"
                  color={"#3182bd"}
                  size={2}
                  shape="smooth"
                  tooltip={['offset*last', (offset, value) => {
                    return {
                      name: `${DATE_REANGE_ALIAS[dateRange]}前消费金额`,
                      title: moment(date).add(offset, 'days').format('YYYY-MM-DD'),
                      value: value || 0,
                      shared: true
                    };
                  }]}
                />
                <Geom
                  type="point"
                  position="offset*last"
                  color={"#3182bd"}
                  size={2}
                  shape="circle"
                  tooltip={['offset*last', (offset, value) => {
                    return {
                      name: `${DATE_REANGE_ALIAS[dateRange]}前消费金额`,
                      title: moment(date).add(offset, 'days').format('YYYY-MM-DD'),
                      value: value || 0,
                      shared: true
                    };
                  }]}
                />
                <Geom
                  type="line"
                  position="offset*future"
                  color={"#fdae6b"}
                  size={2}
                  shape="smooth"
                  tooltip={['offset*future', (offset, value) => {
                    return {
                      name: `预测${DATE_REANGE_ALIAS[dateRange]}后消费金额`,
                      title: moment(date).add(offset, 'days').format('YYYY-MM-DD'),
                      value: value || 0,
                      shared: true
                    };
                  }]}
                />
                <Geom
                  type="point"
                  position="offset*future"
                  color={"#fdae6b"}
                  size={2}
                  shape="circle"
                  tooltip={['offset*future', (offset, value) => {
                    return {
                      name: `预测${DATE_REANGE_ALIAS[dateRange]}后消费金额`,
                      title: moment(date).add(offset, 'days').format('YYYY-MM-DD'),
                      value: value || 0,
                      shared: true
                    };
                  }]}
                />
              </Chart>
            </Col>
          </Row>
        </Card>
        <Card title={`${date}起过去${DATE_REANGE_ALIAS[dateRange]}各时段平均消费情况`} bordered={false} style={{ width: '100%' }}
              hoverable={true}>
          <Row>
            <Col span={20}>
              <Chart
                height={400}
                data={hourlyCost}
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
                <Tooltip/>
                <Geom type="line" position="hour*cost" size={2} color={"type"}/>
                <Geom
                  type="point"
                  position="hour*cost"
                  size={4}
                  shape={"circle"}
                  style={{
                    lineWidth: 1
                  }}
                  color={"type"}
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
