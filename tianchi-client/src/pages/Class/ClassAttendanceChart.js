/**
 * Created by 胡晓慧 on 2019/4/13.
 */
import React, { Fragment, memo } from "react";
import { Button, Card, Col, Empty, Icon, Row, Typography } from 'antd';
import { Axis, Chart, Geom, Legend, Tooltip } from "bizcharts";
import { EVENT_TYPE_ALIAS } from "@/constants";

const { Paragraph, Text } = Typography;


const AttendanceChart = memo(
  ({ kaoqinData, kaoqinDetail, kaoqinSummary, term, termList, loading, toggleDig, digMode }) => (
    <Card
      loading={loading} bordered={false} style={{ width: '100%' }}
      title={`${digMode ? term : ''} 考勤记录${digMode ? '' : '概览'}`}
    >
      {termList.length ? <Row>
        <Col span={20}>
          {digMode ? <Fragment>
              <Button
                ghost
                size={'small'}
                shape="round"
                type='primary'
                style={{
                  position: 'absolute',
                  zIndex: 8,
                  right: '3%',
                  top: '-1%'
                }}
                onClick={() => toggleDig('')}
              >
                <Icon type="left"/>
                返回概览
              </Button>
              <Chart
                scale={{
                  student: {
                    tickCount: kaoqinDetail.length > 30 ? termList.length / 3 : 10,
                  },
                }}
                height={400}
                data={kaoqinDetail}
                forceFit
              >
                <Legend/>
                <Axis name="student"/>
                <Axis name="count"/>
                <Tooltip/>
                <Geom
                  type="intervalStack"
                  position="student*count"
                  color={['name', (name) => {
                    if (name === EVENT_TYPE_ALIAS[99001]) {
                      return '#4190f7';
                    }

                    if (name === EVENT_TYPE_ALIAS[99002]) {
                      return '#61be67';
                    }
                    return '#f3cd49';
                  }]}
                />
              </Chart>
            </Fragment> :
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
              onIntervalClick={(ev) => {
                toggleDig(ev.data._origin.term);
              }}
            >
              <Legend/>
              <Axis name="term"/>
              <Axis name="count"/>
              <Tooltip/>
              <Geom
                type="intervalStack"
                position="term*count"
                color={['name', (name) => {
                  if (name === EVENT_TYPE_ALIAS[99001]) {
                    return '#4190f7';
                  }

                  if (name === EVENT_TYPE_ALIAS[99002]) {
                    return '#61be67';
                  }
                  return '#f3cd49';
                }]}
              />
            </Chart>}
        </Col>
        {!digMode && <Col span={4}>
          <Paragraph>在考勤记录信息中,该班级共<Text strong style={{ color: "#c6464a" }}>
            {kaoqinSummary.map(data => {
              if (data.name === '进校') {
                return;
              }
              return `${data.name} ${data.count} 次, `;
            })} </Text>
            其中，最多的是<Text strong style={{ color: "#c6464a" }}>
              {kaoqinSummary[0].name}</Text>。
          </Paragraph>
          <Paragraph>点击<Text strong style={{ color: "#c6464a" }}>柱状图彩色区域</Text>查看违纪学生详情。</Paragraph>
        </Col>}
      </Row> : <Empty description='该班级暂无不良考勤数据'/>}
    </Card>
  )
);

export default AttendanceChart;

