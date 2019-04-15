/**
 * Created by 胡晓慧 on 2019/4/14.
 */
import React,{memo} from "react";
import {Row, Col, Card}  from 'antd';
import { formatMessage, FormattedMessage } from 'umi-plugin-react/locale';
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
import DataSet from "@antv/data-set";
import {TimelineChart} from '@/components/Charts';

const cols = {
  cost: {
    min: 0
  }
};
const offlineChartData = [];
for (let i = 0; i < 20; i += 1) {
  offlineChartData.push({
    x: new Date().getTime() + 1000 * 60 * 30 * i,
    y1: Math.floor(Math.random() * 100) + 10,
    y2: Math.floor(Math.random() * 100) + 10,
  });
};
const comparedScoreData = [
  {
    label: "数学",
    series1: 80,
    series2: 60
  },
  {
    label: "语文",
    series1: 110,
    series2: 150
  },
  {
    label: "历史",
    series1: 95,
    series2: 90
  },
  {
    label: "物理",
    series1: 50,
    series2: 0
  },
  {
    label: "地理",
    series1: 70,
    series2: 0
  }
];
const compScoreData = new DataSet.View().source(comparedScoreData).transform({
  type: "fold",
  fields: ["series1", "series2"],
  // 展开字段集
  key: "type",
  // key字段
  value: "value" // value字段
});
const CCcols = {
      population: {
        tickInterval: 1000000
      }
    };
const AttendData = [
  {
      name: "李晓明",
      '迟到':3,
      '早退':6,
      '校服违纪':12,
      '作弊':2
  },
  {
      name: "黎莉莉",
      '迟到':12,
      '早退':0,
      '校服违纪':6,
      '作弊':0
  }
];
const AttData = new DataSet.View().source(AttendData);
AttData.transform({
  type: "fold",
  fields: ["迟到","早退","校服违纪","作弊"],
  // 展开字段集
  key: "考勤类型",
  // key字段
  value: "次数" // value字段
});
const timelyCompConsumptionData = [
  {
    time:'0时',
    cost1:0,
    cost2:0,
  },
    {
    time:'2时',
    cost1:6,
    cost2:3,

  },
    {
    time:'3时',
    cost1:7,
    cost2:3,
  },
    {
    time:'4时',
    cost1:9,
    cost2:10,
  },
    {
    time:'5时',
    cost1:20,
    cost2:30,
  }
];
const timelyCompConsumpData = new DataSet.View().source(timelyCompConsumptionData).transform({
type: "fold",
fields: ["cost1", "cost2"],
// 展开字段集
key: "stu",
// key字段
value: "cost" // value字段
});




const StuComparedChart = memo(
  (comparedScoreData,timelyComparedConsumptionData,dailyComparedConsumptionData,comparedAttendData) => (
      <React.Fragment>
          <div>
            {/*成绩对比*/}
            <Card title="平均成绩对比" bordered={false} style={{ width: '100%'}}>
              <Chart height={400} data={compScoreData} forceFit>
                  <Legend />
                  <Coord transpose scale={[1, -1]} />
                  <Axis
                    name="label"
                    label={{
                      offset: 12
                    }}
                  />
                  <Axis name="value" position={"right"} />
                  <Tooltip />
                  <Geom
                    type="interval"
                    position="label*value"
                    color={"type"}
                    adjust={[
                      {
                        type: "dodge",
                        marginRatio: 1 / 32
                      }
                    ]}
                  />
                </Chart>
            </Card>
            {/*一卡通分析,消费时间和金额对比*/}
            <Card title="消费对比" bordered={false} style={{ width: '100%'}}>
                {/*平均消费时间的对比,图表*/}
                <Chart
                  height={400}
                  data={timelyCompConsumpData}
                  scale={cols}
                  forceFit>
                  <Legend position="top"/>
                  <Axis name="time" />
                  <Axis name="cost" />
                  <Tooltip
                    crosshairs={{
                      type: "y"
                    }}
                  />
                  <Geom type="line" position="time*cost" size={2}  color={"stu"} />
                  <Geom
                    type="point"
                    position="time*cost"
                    size={4}
                    shape={"circle"}
                    style={{
                      stroke: "#fff",
                      lineWidth: 1
                    }}
                  />
                </Chart>
                {/*各个时期总消费金额对比*/}
                <div style={{ padding: '0 24px' }}>
                  <TimelineChart
                    height={300}
                    data={offlineChartData}
                  />
                </div>
            </Card>
            {/*考勤*/}
             <Card title="总考勤情况对比" bordered={false} style={{ width: '100%'}}>
               <Chart height={400} data={AttData} forceFit>
                  <Axis name="考勤类型" />
                  <Axis name="次数" />
                  <Legend />
                  <Tooltip
                    crosshairs={{
                      type: "y"
                    }}
                  />
                  <Geom
                    type="interval"
                    position="考勤类型*次数"
                    color={"name"}
                    adjust={[
                      {
                        type: "dodge",
                        marginRatio: 1 / 32
                      }
                    ]}
              />
            </Chart>
             </Card>
          </div>
      </React.Fragment>
    )
);

export default StuComparedChart;

