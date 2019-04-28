/**
 * Created by 胡晓慧 on 2019/4/13.
 */
import React, { memo } from "react";
import { Card, Col, Empty, Row } from 'antd';
import { Axis, Chart, Geom, Legend, Tooltip } from "bizcharts";
import { Typography } from 'antd';
const { Paragraph, Text } = Typography;

const AttendanceChart = memo(
  ({ kaoqinData, kaoqinSummary, termList, loading }) => (
    <Card loading={loading} title="考勤记录" bordered={false} style={{ width: '100%' }}>
      {termList.length ? <Row type="flex" align="middle">
        <Col span={20}>
          <Chart
            scale={{
              term: {
                min: 0,
                tickCount: termList.length,
                alias: '学期'
              },
            }}
            height={400}
            data={kaoqinData}
            forceFit
          >
            <Legend/>
            <Axis name="term"/>
            <Axis name="count"/>
            <Tooltip/>
            <Geom
              type="intervalStack"
              position="term*count"
              color={"name"}
            />
          </Chart>
        </Col>
        <Col span={4}>
          <Paragraph>在考勤记录信息中,该学生共<Text strong style={{color:"#c6464a"}}>
            {kaoqinSummary.map(data => {
              if (data.name === '进校') {
                return;
              }
              return `${data.name} ${data.count} 次, `;
            })} </Text>
          其中，最多的是<Text strong style={{color:"#c6464a"}}>
              {kaoqinSummary[0].name}</Text></Paragraph>
        </Col>
      </Row> : <Empty description='该同学暂无不良考勤数据'/>}
    </Card>
  )
);

export default AttendanceChart;

