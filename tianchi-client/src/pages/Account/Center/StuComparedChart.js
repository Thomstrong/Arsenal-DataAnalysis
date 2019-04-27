/**
 * Created by 胡晓慧 on 2019/4/14.
 */
import React, { memo } from "react";
import { Card, Empty } from 'antd';
import { Axis, Chart, Coord, Geom, Legend, Tooltip } from "bizcharts";
import DataSet from "@antv/data-set";
import { TimelineChart } from '@/components/Charts';

const AttendData = [
  {
    name: "李晓明",
    '迟到': 3,
    '早退': 6,
    '校服违纪': 12,
    '作弊': 2
  },
  {
    name: "黎莉莉",
    '迟到': 12,
    '早退': 0,
    '校服违纪': 6,
    '作弊': 0
  }
];
const AttData = new DataSet.View().source(AttendData);
AttData.transform({
  type: "fold",
  fields: ["迟到", "早退", "校服违纪", "作弊"],
  // 展开字段集
  key: "考勤类型",
  // key字段
  value: "次数" // value字段
});

const StuComparedChart = memo(
  ({ comparedScoreData, hourlyVsCostData, vsDailyCostData, kaoqinVsData }) => {

    return <React.Fragment>
      {/*成绩对比*/}
      <Card title="平均成绩对比" bordered={false} style={{ width: '100%' }}>
        {comparedScoreData.length ? <Chart height={400} data={comparedScoreData} forceFit>
          <Legend/>
          <Coord transpose scale={[1, -1]}/>
          <Axis
            name="course"
            label={{
              offset: 12
            }}
          />
          <Axis name="average" position={"right"}/>
          <Tooltip/>
          <Geom
            type="interval"
            position="course*average"
            color={"student"}
            adjust={[
              {
                type: "dodge",
                marginRatio: 1 / 32
              }
            ]}
          />
        </Chart> : <Empty/>}
      </Card>
      {/*一卡通分析,消费时间和金额对比*/}
      <Card title="消费对比" bordered={false} style={{ width: '100%' }}>
        {/*平均消费时间的对比,图表*/}
        <Chart
          height={400}
          data={hourlyVsCostData}
          scale={{
            hour: {
              type: "cat",
              values: [
                "0时",
                "1时",
                "2时",
                "3时",
                "4时",
                "5时",
                "6时",
                "7时",
                "8时",
                "9时",
                "10时",
                "11时",
                "12时",
                "13时",
                "14时",
                "15时",
                "16时",
                "17时",
                "18时",
                "19时",
                "20时",
                "21时",
                "22时",
                "23时"
              ]
            }
          }}
          forceFit
        >
          <Legend position="bottom"/>
          <Axis name="hour"/>
          <Axis name="cost"/>
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom type="line" position="hour*cost" size={2} color={"student"}/>
          <Geom
            type="point"
            position="hour*cost"
            size={4}
            shape={"circle"}
            color={"student"}
            style={{
              stroke: "#fff",
              lineWidth: 1
            }}
          />
        </Chart>
        {/*各个时期总消费金额对比*/}
        <div style={{ padding: '0 24px' }}>
          {vsDailyCostData.data.length ? <TimelineChart
            titleMap={vsDailyCostData.titleMap}
            height={300}
            data={vsDailyCostData.data}
          /> : <Empty/>}
        </div>
      </Card>
      {/*考勤*/}
      <Card title="总考勤情况对比" bordered={false} style={{ width: '100%' }}>
        <Chart height={400} data={kaoqinVsData} forceFit>
          <Axis name="考勤类型"/>
          <Axis name="次数"/>
          <Legend position="bottom"/>
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom
            type="interval"
            position="type*count"
            color={"student"}
            adjust={[
              {
                type: "dodge",
                marginRatio: 1 / 32
              }
            ]}
          />
        </Chart>
      </Card>
    </React.Fragment>;
  });

export default StuComparedChart;

