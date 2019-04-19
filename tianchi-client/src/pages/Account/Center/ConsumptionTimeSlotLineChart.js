/**
 * Created by 胡晓慧 on 2019/4/13.
 */
import React, {memo} from "react";
import {Card, Col, Row} from 'antd';
import {Axis, Chart, Geom, Legend, Tooltip} from "bizcharts";
import DataSet from "@antv/data-set";

const data = [
  {
    time: "10:10",
    now: 4,
    last: 2,
    future: 2
  },
  {
    time: "10:15",
    now: 2,
    last: 6,
    future: 3
  },
  {
    time: "10:20",
    now: 13,
    last: 2,
    future: 5
  },
  {
    time: "10:25",
    now: 9,
    last: 9,
    future: 9
  },
  {
    time: "10:30",
    now: 5,
    last: 2,
    future: 8
  },
  {
    time: "10:35",
    now: 8,
    last: 2,
    future: 14
  },
  {
    time: "10:40",
    now: 13,
    last: 1,
    future: 2
  }
];
const ds = new DataSet();
const dv = ds.createView().source(data);
dv.transform({
  type: "fold",
  fields: ["now", "last","future"],
  // 展开字段集
  key: "difTime",
  // key字段
  value: "cost" // value字段
});


const scale = {
  now: {
    min: 0
  },
  last: {
    min: 0
  },
  future: {
    min: 0
  },
};
let chartIns = null;

const ConsumptionTimeSlotLineChart = memo(
  ({timelyConsumptionData, dailyConsumptionData, date}) => (
    <React.Fragment>
      <Card title="各时期消费情况一览" bordered={false} style={{width: '100%'}} hoverable={true}>
        <Card title="单天消费总额对比" bordered={false} style={{width: '100%'}}>
          <Row>
            <Col span={4}>
              {/*todo 文字分析,告警的触犯*/}
              <p>告警!!!该同学近期的消费水平与之前产生较大不同</p>
            </Col>
            <Col span={20}>
              <Chart
                height={400}
                scale={scale}
                forceFit
                data={data}
                onGetG2Instance={chart => {
                  chartIns = chart;
                }}
              >
                <Legend
                  custom={true}
                  allowAllCanceled={true}
                  items={[
                    {
                      value: "now",
                      marker: {
                        symbol: "square",
                        fill: "#F182bd",
                        radius: 5
                      }
                    },
                    {
                      value: "last",
                      marker: {
                        symbol: "hyphen",
                        stroke: "#3182bd",
                        radius: 5,
                        lineWidth: 3
                      }
                    },
                    {
                      value: "future",
                      marker: {
                        symbol: "hyphen",
                        stroke: "#ffae6b",
                        radius: 5,
                        lineWidth: 3
                      }
                    }
                  ]}
                  onClick={ev => {
                    const item = ev.item;
                    const value = item.value;
                    const checked = ev.checked;
                    const geoms = chartIns.getAllGeoms();

                    for (let i = 0; i < geoms.length; i++) {
                      const geom = geoms[i];

                      if (geom.getYScale().field === value) {
                        if (checked) {
                          geom.show();
                        } else {
                          geom.hide();
                        }
                      }
                    }
                  }}
                />
                <Axis name="now"/>
                <Axis name="last"  />
                <Tooltip />
                <Geom type={['difTime', (difTime)=>{
                      if(difTime == 'now'){
                        return 'interval';
                      }
                      return 'line';
                    }]}
                      position="time*cost" color={'difTime'}/>
                {/*<Geom type="interval" position="time*now" color="#F182bd"/>*/}
                {/*<Geom*/}
                  {/*type="line"*/}
                  {/*position="time*last"*/}
                  {/*color="#3182bd"*/}
                  {/*size={2}*/}
                  {/*shape="smooth"*/}
                {/*/>*/}
                {/*<Geom*/}
                  {/*type="point"*/}
                  {/*position="time*last"*/}
                  {/*color="#3182bd"*/}
                  {/*size={2}*/}
                  {/*shape="circle"*/}
                {/*/>*/}
                {/*<Geom*/}
                  {/*type="line"*/}
                  {/*position="time*future"*/}
                  {/*color="#fdae6b"*/}
                  {/*size={2}*/}
                  {/*shape="smooth"*/}
                {/*/>*/}
                {/*<Geom*/}
                  {/*type="point"*/}
                  {/*position="time*future"*/}
                  {/*color="#fdae6b"*/}
                  {/*size={2}*/}
                  {/*shape="circle"*/}
                {/*/>*/}
              </Chart>
            </Col>
          </Row>
        </Card>
        <Card title={`${date} 各时段的平均消费`} bordered={false} style={{width: '100%'}}>
          <Row>
            <Col span={20}>
              {/*todo 可以加上datamarker*/}
              <Chart
                height={400}
                data={timelyConsumptionData}
                scale={{
                  total_cost: {
                    min: 0
                  },
                  hour: {
                    min: 0,
                    max: 23,
                    tickCount: 24,
                  }

                }}
                forceFit>
                <Axis name="时间"/>
                <Axis name="花费"/>
                <Tooltip
                  crosshairs={{
                    type: "y"
                  }}
                />
                <Geom type="line" position="hour*total_cost" size={2}/>
                <Geom
                  type="point"
                  position="hour*total_cost"
                  size={4}
                  shape={"circle"}
                  style={{
                    stroke: "#fff",
                    lineWidth: 1
                  }}
                />
              </Chart>
            </Col>
            <Col span={4}>
              {/*todo 应该有一些实际总结,但我还不知道要总结什么*/}
              <p>该同学情况还是很稳定的呀</p>
              {/*文字分析*/}
            </Col>
          </Row>
        </Card>
      </Card>
    </React.Fragment>
  )
);

export default ConsumptionTimeSlotLineChart;
