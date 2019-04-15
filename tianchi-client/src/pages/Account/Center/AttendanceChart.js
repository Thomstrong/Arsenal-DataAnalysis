/**
 * Created by 胡晓慧 on 2019/4/13.
 */
import React,{memo} from "react";
import {Row, Col, Card}  from 'antd';
import {
  Chart,
  Geom,
  Axis,
  Tooltip,
  Coord,
  Label,
  Legend,
  View,
  Guide,
  Shape,
  Facet,
  Util
} from "bizcharts";


const AttendanceChart = memo(
  ({ attendanceChartData,attendanceSumData }) => (
      <React.Fragment>
            <Card title="考勤记录" bordered={false} style={{ width: '100%'}}>
                <Row>
                    <Col span={20}>
                        <Chart height={400} data={attendanceChartData} forceFit>
                          <Legend />
                          <Axis name="时间" />
                          <Axis name="违纪次数" />
                          <Tooltip />
                          <Geom
                            type="intervalStack"
                            position="时间*违纪次数"
                            color={"name"}
                            style={{
                              stroke: "#fff",
                              lineWidth: 1
                            }}
                          />
                        </Chart>
                    </Col>
                    <Col span={4}>
                        <p>在考勤记录信息中,该学生共迟到{attendanceSumData.lateNum}次,早退{attendanceSumData.leaveNum}次,{attendanceSumData.uniformNum}次没穿校服,进校时间集中在{attendanceSumData.inTime},出校时间集中在{attendanceSumData.outTime}</p>
                    </Col>
                </Row>
            </Card>
      </React.Fragment>
    )
);

export default AttendanceChart;

