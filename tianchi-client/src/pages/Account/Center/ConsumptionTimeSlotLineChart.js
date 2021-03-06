/**
 * Created by 胡晓慧 on 2019/4/13.
 */
import React, { Fragment, memo } from "react";
import { Card, Col, Empty, Row, Typography } from 'antd';
import { Axis, Chart, Geom, Legend, Tooltip } from "bizcharts";
import { DATE_REANGE_ALIAS, HOUR_LIST, INTERVAL_MAP } from "@/constants";
import moment from "moment";

const { Paragraph, Title, Text } = Typography;
//单天消费总额对比数据

let chartIns = null;

const ConsumptionTimeSlotLineChart = memo(
  ({ hourlyCost, dailyPredictData, date, dateRange, maxCost }) => {
    let lastAllCost = 0;
    let nowAllCost = 0;
    let futureAllCost = 0;
    let maxNowCost = 0;
    let maxNowTime = 0;
    for (let i = 0; i < dailyPredictData.length; i++) {
      lastAllCost = lastAllCost + dailyPredictData[i].last;
      nowAllCost = nowAllCost + dailyPredictData[i].now;
      futureAllCost = futureAllCost + dailyPredictData[i].future;
      if (dailyPredictData[i].now > maxNowCost) {
        maxNowCost = dailyPredictData[i].now;
        maxNowTime = i;
      }
    }
    //当本周期消费与上一周期消费相差20元时，告警
    const attention = Math.abs(nowAllCost - lastAllCost) > 30;

    //关于某周期时间点消费的文字分析
    let high = 0;
    let costTimeList = [];
    let maxHourlyTime = 0;
    let maxHourlyCost = 0;
    let timeString = '';
    let dic = { student: 0, school: 0 };
    let list = [];
    for (let i = 0; i < hourlyCost.length; i++) {
      if (hourlyCost[i].type === "该学生") {
        timeString = hourlyCost[i].hour + "时";
        costTimeList.push(timeString);
        dic.student = hourlyCost[i].cost;
        list[hourlyCost[i].hour] = dic;
        dic = { student: 0, school: 0 };
        if (hourlyCost[i].cost > maxHourlyCost) {
          maxHourlyCost = hourlyCost[i].cost;
          maxHourlyTime = hourlyCost[i].hour;
        }
      } else {
        if (list[hourlyCost[i].hour] == null) {
          dic.school = hourlyCost[i].cost;
          list[hourlyCost[i].hour] = dic;
          dic = { student: 0, school: 0 };
        } else {
          list[hourlyCost[i].hour].school = hourlyCost[i].cost;
        }
      }
    }

    for (let i = 0; i < list.length; i++) {
      if (list[i] && list[i].student) {
        if ((list[i].student - list[i].school) > 2) {
          high = high + 1;
        } else if ((list[i].school - list[i].student) > 2) {
          high = high - 1;
        }
      }
    }

    return (
      <Fragment>
        <Card title={`${date} 起往后${DATE_REANGE_ALIAS[dateRange]}，每日消费总额、上一周期消费对比及下一周期消费预测`}
              bordered={false} style={{ width: '100%', cursor: "auto" }} hoverable={true}
        >
          {hourlyCost.length ? <Row type="flex" align="middle">
            <Col xl={4} xs={24}>
              {attention ? <Title style={{ color: "#c04b4f" }} code level={4}>告警</Title> :
                <Title style={{ color: "#747474" }} code level={4}>消费稳定</Title>
              }
              <Paragraph>
                {`上${DATE_REANGE_ALIAS[dateRange]}消费总额为`}
                <Text strong style={{ color: "#cc4756" }}>¥{lastAllCost.toFixed(2)}</Text>
              </Paragraph>
              <Paragraph>
                {`这${DATE_REANGE_ALIAS[dateRange]}消费总额为`}
                <Text strong style={{ color: "#cc4756" }}>¥{nowAllCost.toFixed(2)}</Text>
              </Paragraph>
              <Paragraph>
                {`预测下${DATE_REANGE_ALIAS[dateRange]}消费总额为`}
                <Text strong style={{ color: "#cc4756" }}>¥{futureAllCost.toFixed(2)}</Text>
              </Paragraph>
              <Paragraph>
                本周期消费金额最高出现在
                <Text strong style={{ color: "#cc4756" }}>{maxNowTime ? `第${maxNowTime}天` : '当天'}</Text>,
                消费金额为<Text strong style={{ color: "#cc4756" }}>¥{maxNowCost.toFixed(2)}</Text>
              </Paragraph>
            </Col>
            <Col xl={20} xs={24}>
              <Chart
                height={400}
                scale={{
                  now: {
                    alias: '当前时间',
                    min: 0, max: maxCost,
                    tickInterval: 10,
                  },
                  last: {
                    alias: `${DATE_REANGE_ALIAS[dateRange]}前`,
                    min: 0, max: maxCost,
                    tickInterval: 10
                  },
                  future: {
                    alias: `${DATE_REANGE_ALIAS[dateRange]}后预测`,
                    min: 0, max: maxCost,
                    tickInterval: 10
                  },
                  offset: {
                    alias: `距离${date}天数`,
                    min: 0, max: dateRange,
                    tickInterval: INTERVAL_MAP[dateRange],
                    range: [1 / 30, 29 / 30]
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
                        fill: "#4190f7",
                        radius: 5
                      }
                    },
                    {
                      value: `${DATE_REANGE_ALIAS[dateRange]}前`,
                      marker: {
                        symbol: "hyphen",
                        stroke: "#61be67",
                        radius: 5,
                        lineWidth: 3
                      }
                    },
                    {
                      value: `${DATE_REANGE_ALIAS[dateRange]}后预测`,
                      marker: {
                        symbol: "hyphen",
                        stroke: "#f3cd49",
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
                  color={"#4190f7"}
                  tooltip={['offset*now', (offset, now) => {
                    return {
                      name: '当天消费金额',
                      title: moment(date).add(offset, 'days').format('YYYY-MM-DD'),
                      value: now + "元" || 0 + "元",
                      shared: true
                    };
                  }]}
                />
                <Geom
                  type="line"
                  position="offset*last"
                  color={"#61be67"}
                  size={2}
                  shape="smooth"
                  tooltip={['offset*last', (offset, value) => {
                    return {
                      name: `${DATE_REANGE_ALIAS[dateRange]}前消费金额`,
                      title: moment(date).add(offset, 'days').format('YYYY-MM-DD'),
                      value: value + "元" || 0 + "元",
                      shared: true
                    };
                  }]}
                />
                <Geom
                  type="point"
                  position="offset*last"
                  color={"#61be67"}
                  size={2}
                  shape="circle"
                  tooltip={['offset*last', (offset, value) => {
                    return {
                      name: `${DATE_REANGE_ALIAS[dateRange]}前消费金额`,
                      title: moment(date).add(offset, 'days').format('YYYY-MM-DD'),
                      value: value + "元" || 0 + "元",
                      shared: true
                    };
                  }]}
                />
                <Geom
                  type="line"
                  position="offset*future"
                  color={"#f3cd49"}
                  size={2}
                  shape="smooth"
                  tooltip={['offset*future', (offset, value) => {
                    return {
                      name: `预测${DATE_REANGE_ALIAS[dateRange]}后消费金额`,
                      title: moment(date).add(offset, 'days').format('YYYY-MM-DD'),
                      value: value + "元" || 0 + "元",
                      shared: true
                    };
                  }]}
                />
                <Geom
                  type="point"
                  position="offset*future"
                  color={"#f3cd49"}
                  size={2}
                  shape="circle"
                  tooltip={['offset*future', (offset, value) => {
                    return {
                      name: `预测${DATE_REANGE_ALIAS[dateRange]}后消费金额`,
                      title: moment(date).add(offset, 'days').format('YYYY-MM-DD'),
                      value: value + "元" || 0 + "元",
                      shared: true
                    };
                  }]}
                />
              </Chart>
            </Col>
          </Row> : <Empty/>}
        </Card>
        <Card title={`${date}起过去${DATE_REANGE_ALIAS[dateRange]}各时段平均消费情况`} bordered={false}
              style={{ width: '100%', cursor: "auto" }}
              hoverable={true}>
          {hourlyCost.length ? <Row type="flex" align="middle">
            <Col xl={20} xs={24}>
              <Chart
                height={400}
                data={hourlyCost}
                scale={{
                  cost: {
                    min: 0
                  },
                  hour: {
                    type: "cat",
                    values: HOUR_LIST
                  },

                }}
                forceFit>
                <Axis name="hour"/>
                <Legend/>
                <Tooltip/>
                <Geom type="line" position="hour*cost" size={2} color={"type"}
                      tooltip={['cost*type', (cost, type) => {
                        return {
                          name: type + '平均消费',
                          value: cost.toFixed(2) + "元"
                        };
                      }]}/>
                <Geom
                  type="point"
                  position="hour*cost"
                  size={4}
                  shape={"circle"}
                  style={{
                    lineWidth: 1
                  }}
                  color={"type"}
                  tooltip={['cost*type', (cost, type) => {
                    return {
                      name: type + '平均消费',
                      value: cost.toFixed(2) + "元"
                    };
                  }]}
                />
              </Chart>
            </Col>
            <Col xl={4} xs={24}>
              <Paragraph>
                该同学本周期的消费分布在
                <Text strong style={{ color: "#cc4756" }}>{costTimeList.join(' ')}</Text>
              </Paragraph>
              <Paragraph>
                平均消费最高是在
                <Text strong style={{ color: "#cc4756" }}>{maxHourlyTime}时</Text>，
                为
                <Text strong style={{ color: "#cc4756" }}>¥{maxHourlyCost.toFixed(2)}</Text>
              </Paragraph>
              <Paragraph>该同学在本周期消费水平较校平均消费水平{high === 0 ? <Text strong style={{ color: "#cc4756" }}>相当</Text> :
                (high > 0 ? <Text strong style={{ color: "#cc4756" }}>高</Text> :
                  <Text strong style={{ color: "#cc4756" }}>低</Text>)}</Paragraph>
            </Col>
          </Row> : <Empty/>}
        </Card>
      </Fragment>
    );
  }
);
export default ConsumptionTimeSlotLineChart;
