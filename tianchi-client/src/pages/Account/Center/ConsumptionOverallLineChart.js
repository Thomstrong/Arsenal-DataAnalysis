/**
 * Created by 胡晓慧 on 2019/4/13.
 */
import React, { Fragment, memo } from "react";
import { Button, Card, Col, Empty, Popover, Row, Table, Typography } from 'antd';
import { Axis, Chart, Geom, Legend, Tooltip } from "bizcharts";
import { OneTimelineChart } from '@/components/Charts';
import { HOUR_LIST } from '@/constants';
import styles from './ConsumptionOverallLineChart.less';

const { Paragraph, Text } = Typography;

let chartIns = null;
const columns = [
  {
    title: '消费时间',
    dataIndex: 'time',
    key: 'time',
    width: 120,
    align: 'center',
  }, {
    title: '消费金额',
    dataIndex: 'cost',
    key: 'cost',
    align: 'center',
    width: 120,
    sorter: (a, b) => a.cost - b.cost,
  },
];

const ConsumptionOverallLineChart = memo(
  ({
     hourlyAvgCost, dailySumCost, maxHourlyAvg, dailyAvgRank, dailyAvg, costDetailLoading, isStay,
     popVisible, popStyle, onPointClick, popTitle, startTime, endTime, onPopClose, dailyCostDetail
   }) => {
    if (chartIns) {
      const geoms = chartIns.getAllGeoms();
      for (let geom of geoms) {
        geom && geom.show();
      }
    }
    let timeCount = 0;
    let maxTime = 0;
    let maxMoney = 0;
    for (let i = 0; i < hourlyAvgCost.length; i++) {
      if (hourlyAvgCost[i].avg_cost !== 0) {
        timeCount = timeCount + 1;
        if (hourlyAvgCost[i].avg_cost >= maxMoney) {
          maxMoney = hourlyAvgCost[i].avg_cost;
          maxTime = i;
        }
      }
    }

    let showPredict = true;
    const dailySumData = [];
    dailySumCost.map((data) => {
      if (data.total < 0) {
        showPredict = false;
        return;
      }
      dailySumData.push({
        x: Date.parse(data.date),
        y: data.total
      });
    });

    return (
      <Card title="总体消费情况一览" bordered={false} style={{ width: '100%' }}>
        <Card title="总体消费趋势" bordered={false} style={{ width: '100%', cursor: "auto" }} hoverable={true}>
          {dailySumCost.length ? <Row type="flex" align="middle">
            <Col xl={20} xs={24}>
              <Popover
                key='cost-line-popover'
                visible={popVisible} trigger="click"
                title={<Fragment>
                  <span style={{ marginLeft: '15%' }}>{popTitle}</span>
                  <Button
                    style={{
                      position: 'absolute',
                      right: 0,
                      border: 'none',
                      verticalAlign: 'middle'
                    }}
                    size='small' icon='close'
                    onClick={() => onPopClose()}
                  />
                </Fragment>}
                content={<Table
                  size="small"
                  loading={costDetailLoading}
                  header={null}
                  footer={null}
                  pagination={false}
                  bordered={true}
                  dataSource={dailyCostDetail}
                  columns={columns}
                  rowKey={(record) => record.time}
                  scroll={dailyCostDetail.length > 5 ? { y: 180 } : {}}
                />}
                overlayClassName={styles.oneLineChartPop}
              >
                <div key='cost-line-popover-target' style={popStyle}/>
              </Popover>
              <OneTimelineChart
                key='ConsumptionOverallLineChart-slider-chart'
                enableDig={true}
                onPointClick={onPointClick}
                onBlur={onPopClose}
                showPredict={showPredict}
                height={300}
                data={dailySumData}
                startTime={startTime}
                endTime={endTime}
              />
            </Col>
            <Col xl={4} xs={24}>
              <Paragraph>该学生平均日消费为<Text strong style={{ color: "#cc4756" }}>¥{dailyAvg}</Text>元， 超过
                <Text
                  strong style={{ color: "#cc4756" }}
                >
                  {`${(dailyAvgRank * 100).toFixed(2)}%`}
                </Text>的{isStay ? '住校' : '走读'}生</Paragraph>
              {showPredict ?
                <Paragraph>点击<Text strong style={{ color: "#cc4756" }}>蓝色数据点</Text>，获取该天消费明细</Paragraph> : (
                  <Paragraph>数据量过少，无法预测</Paragraph>
                )}
            </Col>
          </Row> : <Empty/>}
        </Card>
        <Card title="不同时段平均消费对比" bordered={false} style={{ width: '100%', cursor: "auto" }} hoverable={true}>
          {dailySumCost.length ? <Row type="flex" align="middle">
            <Col xl={4} xs={24}>
              <Paragraph>共有<Text strong style={{ color: "#cc4756" }}>{timeCount}</Text>个时间段产生过消费。</Paragraph>
              <Paragraph>其中，平均消费最高出现在<Text strong style={{ color: "#cc4756" }}>{maxTime}时</Text>，为
                <Text strong style={{ color: "#cc4756" }}>¥{maxMoney}</Text></Paragraph>
            </Col>
            <Col xl={20} xs={24}>
              <Chart
                height={300}
                data={hourlyAvgCost}
                padding={[10, "auto", 80, "auto"]}
                scale={{
                  hour: {
                    type: "cat",
                    values: HOUR_LIST
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
                        fill: "#4190f7",
                        radius: 5
                      }
                    },
                    {
                      value: "全校平均消费",
                      marker: {
                        symbol: "hyphen",
                        stroke: "#61be67",
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
                <Axis name="total_avg" visible={false}/>
                <Tooltip/>
                <Geom
                  type="interval" position="hour*avg_cost"
                  tooltip={['avg_cost', (avgCost) => {
                    return {
                      name: "该同学平均消费",
                      value: avgCost + "元"
                    };
                  }]}/>
                <Geom
                  type="line" position="hour*total_avg" color="#61be67" size={2} shape="smooth"
                  tooltip={['total_avg', (totalAvg) => {
                    return {
                      name: "全校同学平均消费",
                      value: totalAvg + "元"
                    };
                  }]}/>
                <Geom
                  type="point" position="hour*total_avg" color="#61be67" size={3} shape="circle"
                  tooltip={['total_avg', (totalAvg) => {
                    return {
                      name: "全校同学平均消费",
                      value: totalAvg + "元"
                    };
                  }]}/>
              </Chart>
            </Col>
          </Row> : <Empty/>}
        </Card>
      </Card>
    );
  }
);

export default ConsumptionOverallLineChart;
