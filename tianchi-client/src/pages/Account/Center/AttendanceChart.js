import React, { Fragment, memo } from "react";
import { Card, Col, Divider, Empty, Row, Switch, Typography } from 'antd';
import { Axis, Chart, Geom, Legend, Tooltip } from "bizcharts";
import { EVENT_TYPE_ALIAS } from "@/constants";
import styles from './AttendanceChart.less';

const { Paragraph, Text } = Typography;

const AttendanceChart = memo(
  ({ kaoqinData, kaoqinSummary, termList, loading, breakOnly, onKaoqinSwitchChanged }) => {
    const recordFilter = (r) => !breakOnly || (r.name !== EVENT_TYPE_ALIAS[99004] && r.name !== EVENT_TYPE_ALIAS[99005]);
    const summaryData = [];
    let totalKaoqinCount = 0;
    kaoqinSummary.map(data => {
      if (recordFilter(data)) {
        totalKaoqinCount += data.count;
        summaryData.push(data);
      }
    });

    return <Card
      loading={loading}
      title={<Fragment>
        <span
          style={{
            verticalAlign: 'middle',
          }}
        >
          {'考勤记录'}
        </span>
        <Divider
          style={{
            verticalAlign: 'middle',
            margin: '0 15px',
            height: '20px'
          }}
          type="vertical"
        />
        <span
          style={{
            fontSize: '.9em',
            verticalAlign: 'middle',
            marginRight: '10px',
            fontWeight: 'normal'
          }}
        >
          {'仅统计违纪记录'}</span>
        <Switch
          style={{
            verticalAlign: 'middle',
          }}
          size={'small'}
          defaultChecked={breakOnly}
          onChange={onKaoqinSwitchChanged}
        />
      </Fragment>
      }
      bordered={false}
      className={styles.AttendanceTitle}
    >
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
            data={kaoqinData.filter(recordFilter)}
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
          <Paragraph>在{breakOnly ? '违纪' : '考勤'}记录中,该学生共<Text strong style={{ color: "#c6464a" }}>
            {summaryData.map(data => {
              return `${data.name} ${data.count} 次`;
            }).join(', ')} </Text>
            其中，最多的是<Text strong style={{ color: "#c6464a" }}>
              {summaryData[0].name}</Text>，共{summaryData[0].count}次，占
            <Text
              strong
              style={{ color: "#c6464a" }}
            >
              {(summaryData[0].count / totalKaoqinCount * 100).toFixed(2)}%
            </Text>
          </Paragraph>
        </Col>
      </Row> : <Empty description='该同学暂无不良考勤数据'/>}
    </Card>;
  }
);

export default AttendanceChart;

