/**
 * Created by 胡晓慧 on 2019/4/13.
 */
import React, {memo} from "react";
import {Card, Col, Empty, Row} from 'antd';
import {Axis, Chart, Geom, Legend, Tooltip} from "bizcharts";
import {OneTimelineChart} from '@/components/Charts';
import {Typography, Divider} from 'antd';

const { Paragraph, Text} = Typography;

let chartIns = null;

//todo 由后端传入
const money = 2000;
const precent = "20%";
const cishu = 7;
const time = "8时";
const timemoney = 20.6;

const ConsumptionOverallLineChart = memo(
  ({hourlyAvgCost, dailySumCost, maxHourlyAvg}) => {
    if (chartIns) {
      const geoms = chartIns.getAllGeoms();
      for (let geom of geoms) {
        geom && geom.show();
      }
    }
    let timeCount =0;
    let maxTime = 0;
    let maxMoney = 0;
    for (let i = 0; i < hourlyAvgCost.length; i++) {
       if (hourlyAvgCost[i].avg_cost !== 0){
         timeCount =timeCount+1;
         if (hourlyAvgCost[i].avg_cost>=maxMoney) {
           maxMoney = hourlyAvgCost[i].avg_cost;
           maxTime = i
         }
       }
    }


    console.log(hourlyAvgCost);
    return (
      <Card title="总体消费情况一览" bordered={false} style={{width: '100%'}}>
        <Card title="总体消费趋势" bordered={false} style={{width: '100%'}} hoverable={true}>
          {dailySumCost.length ? <Row>
            <Col span={20}>
              <OneTimelineChart
                height={300}
                data={dailySumCost.map((data) => {
                  return {
                    x: Date.parse(data.date),
                    y: data.total
                  };
                })}
              />
            </Col>
            <Col span={3} offset={1}>
              <Paragraph>该学生平均日消费为<Text strong style={{color: "#cc4756"}}>¥{money}</Text>元</Paragraph>
              <Paragraph>超过<Text strong style={{color: "#cc4756"}}>{precent}</Text>的学生</Paragraph>
            </Col>
          </Row> : <Empty/>}
        </Card>
        <Card title="不同时间点平均消费对比" bordered={false} style={{width: '100%'}} hoverable={true}>
          {dailySumCost.length ? <Row>
            <Col span={3}>
              <Paragraph>共有<Text strong style={{color: "#cc4756"}}>{timeCount}</Text>个时间段产生过消费;</Paragraph>
              <Paragraph>其中,平均消费最高的金额出现在<Text strong style={{color: "#cc4756"}}>{maxTime}时</Text>,平均消费为<Text strong
                                                                                                         style={{color: "#cc4756"}}>¥{maxMoney}</Text></Paragraph>
            </Col>
            <Col span={20} offset={1}>

              <Chart
                height={300}
                data={hourlyAvgCost}
                padding={[10, "auto", 20, "auto"]}
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
                  onClick={({item, checked}) => {
                    const {value} = item;
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
                <Axis name="total_avg" visible={false}/>
                <Tooltip/>
                <Geom type="interval" position="hour*avg_cost" color="#0099CC"/>
                <Geom type="line" position="hour*total_avg" color="#FF9900" size={2} shape="smooth"/>
                <Geom type="point" position="hour*total_avg" color="#FF9900" size={3} shape="circle"/>
              </Chart>
            </Col>
          </Row> : <Empty/>}
        </Card>
      </Card>
    );
  }
);

export default ConsumptionOverallLineChart;
