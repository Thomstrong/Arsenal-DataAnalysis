/**
 * Created by 胡晓慧 on 2019/4/19.
 */
import React, { memo } from 'react';
import { Card, Col, Icon, Row, Tabs } from 'antd';
// import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';
import { OneTimelineChart, Pie } from '@/components/Charts';
import styles from './EcardConsumptionCard.less';
import numeral from 'numeral';
import { Axis, Chart, Geom, Legend, Tooltip } from "bizcharts";
import DataSet from "@antv/data-set";

const gradedata = [
  {
    time: '0时',
    Gone: 7.0,
    Gtwo: 3.9,
    Gthree: 20,
    all: 10
  },
  {
    time: '1时',
    Gone: 6.9,
    Gtwo: 4.2,
    Gthree: 2,
    all: 10
  },
  {
    time: '2时',
    Gone: 9.5,
    Gtwo: 5.7,
    Gthree: 12,
    all: 10
  },
  {
    time: '3时',
    Gone: 14.5,
    Gtwo: 8.5,
    Gthree: 20,
    all: 10
  },
  {
    time: '4时',
    Gone: 18.4,
    Gtwo: 11.9,
    Gthree: 20,
    all: 10
  },
  {
    time: '5时',
    Gone: 21.5,
    Gtwo: 15.2,
    Gthree: 20,
    all: 10
  },
  {
    time: '6时',
    Gone: 25.2,
    Gtwo: 17.0,
    Gthree: 20,
    all: 10
  },
  {
    time: '7时',
    Gone: 26.5,
    Gtwo: 16.6,
    Gthree: 20,
    all: 10
  },
  {
    time: '8时',
    Gone: 23.3,
    Gtwo: 14.2,
    Gthree: 20,
    all: 10
  },
  {
    time: '9时',
    Gone: 18.3,
    Gtwo: 10.3,
    Gthree: 20,
    all: 10
  },
  {
    time: '10时',
    Gone: 13.9,
    Gtwo: 6.6,
    Gthree: 20,
    all: 10
  },
  {
    month: '11时',
    Gone: 9.6,
    Gtwo: 4.8,
    Gthree: 20,
    all: 10
  }
];
const leavedata = [
  {
    time: '0时',
    leave: 7.0,
    stay: 3.9,
    all: 10
  },
  {
    time: '1时',
    leave: 6.9,
    stay: 4.2,
    all: 10
  },
  {
    time: '2时',
    leave: 9.5,
    stay: 5.7,
    all: 10
  },
  {
    time: '3时',
    leave: 14.5,
    stay: 8.5,
    all: 10
  },
  {
    time: '4时',
    leave: 18.4,
    stay: 11.9,
    all: 10
  },
  {
    time: '5时',
    leave: 21.5,
    stay: 15.2,
    all: 10
  },
  {
    time: '6时',
    leave: 25.2,
    stay: 17.0,
    all: 10
  },
  {
    time: '7时',
    leave: 26.5,
    stay: 16.6,
    all: 10
  },
  {
    time: '8时',
    leave: 23.3,
    stay: 14.2,
    all: 10
  },
  {
    time: '9时',
    leave: 18.3,
    stay: 10.3,
    all: 10
  },
  {
    time: '10时',
    leave: 13.9,
    stay: 6.6,
    all: 10
  },
  {
    month: '11时',
    leave: 9.6,
    stay: 4.8,
    all: 10
  }
];

let GradeData = new DataSet.View().source(gradedata).transform({
  type: 'fold',
  fields: ['Gone', 'Gtwo', 'Gthree', 'all'],
  // 展开字段集
  key: 'dif',
  // key字段
  value: 'cost' // value字段
});
let LeaveData = new DataSet.View().source(leavedata).transform({
  type: 'fold',
  fields: ['leave', 'stay', 'all'],
  // 展开字段集
  key: 'dif',
  // key字段
  value: 'cost' // value字段
});


const DaySumConsumptionData = [
  {
    x: Date.parse('2019-01-01'),
    y: 20
  },
  {
    x: Date.parse('2019-01-02'),
    y: 33
  },
  {
    x: Date.parse('2019-01-03'),
    y: 2
  },
  {
    x: Date.parse('2019-01-04'),
    y: 3
  },
  {
    x: Date.parse('2019-01-05'),
    y: 20
  },
  {
    x: Date.parse('2019-01-06'),
    y: 30
  },
  {
    x: Date.parse('2019-01-07'),
    y: 2
  },
  {
    x: Date.parse('2019-01-08'),
    y: 30
  },
  {
    x: Date.parse('2019-01-09'),
    y: 20
  },
  {
    x: Date.parse('2019-01-10'),
    y: 30
  },
  {
    x: Date.parse('2019-01-11'),
    y: 2
  },
  {
    x: Date.parse('2019-01-12'),
    y: 30
  }
];
const markerList = [
  {
    position: [Date.parse('2019-01-10'), 30],
    content: "变多了神奇"
  }
];
const TabPane = Tabs.TabPane;

//有图表后的分析数据，无需从后端获得
const rankingListData = [
  {
    title: "男生12时平均消费",
    total: 22220
  },
  {
    title: "全校12时平均消费",
    total: 22220
  },
  {
    title: "女生12时平均消费",
    total: 22220
  },
  {
    title: "女生16时平均消费",
    total: 22220
  },
  {
    title: "女生18时平均消费",
    total: 22220
  },

];

const EcardConsumptionCard = memo(({ data }) => {
  const { sexHourlyData, sexHourlyLoading } = data;
  return <React.Fragment>
    {/*<Card title="一卡通消费情况一览" bordered={false} style={{marginTop: 32}}>*/}
    {/*两个部分，分别是每天的总消费变化趋势和某时刻平均消费情况*/}
    {/*DataMarker可以后续有图表后进行补充*/}
    {/*第一部分，每天总消费变化趋势*/}
    <Card loading={sexHourlyLoading} className={styles.tabsCard} style={{ marginTop: 32 }}>
      <Tabs defaultActiveKey={"Sex"}>
        <TabPane tab={<span><Icon type="line-chart"/>性别对比</span>} key="Sex">
          <Row>
            <Col span={16}>
              <div className={styles.salesBar}>
                <Chart
                  height={400}
                  data={sexHourlyData}
                  padding="auto"
                  forceFit
                  scale={{
                    hour: {
                      min: 0, max: 23,
                      tickInterval: 1
                    },
                    cost: {
                      min: 0,
                      tickInterval: 2,
                    }
                  }}
                >
                  <h4 className={styles.rankingTitle}>不同性别不同时刻消费情况对比</h4>
                  <Legend/>
                  <Axis name="hour"/>
                  <Axis
                    name="cost"
                  />
                  <Tooltip/>
                  <Geom
                    type="line"
                    position="hour*cost"
                    size={2}
                    color={"sex"}
                  />
                  <Geom
                    type="point"
                    position="hour*cost"
                    size={4}
                    shape={"circle"}
                    color={"sex"}
                    style={{
                      stroke: "#fff",
                      lineWidth: 1
                    }}
                  />
                </Chart>
              </div>
            </Col>
            <Col span={7} offset={1}>
              <div className={styles.salesRank}>
                <h4 className={styles.rankingTitle}>
                  每时段消费额排名
                </h4>
                <ul className={styles.rankingList}>
                  {rankingListData.map((item, i) => (
                    <li key={item.title}>
                        <span
                          className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}
                        >
                          {i + 1}
                        </span>
                      <span className={styles.rankingItemTitle} title={item.title}>
                          {item.title}
                        </span>
                      <span>{numeral(item.total).format('0,0')}</span>
                    </li>
                  ))}
                </ul>
                <Card size="small" title="文字分析" hoverable={true} style={{ marginTop: 20 }}>
                  <p>男生的整体消费水平比女生高，男生消费主要集中在12点，女生主要集中在18点</p>
                </Card>
              </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab={<span><Icon type="line-chart"/>年级对比</span>} key="Grade">
          <Row>
            <Col span={16}>
              <div className={styles.salesBar}>
                <Chart height={400} data={GradeData} padding="auto" title="不同年级不同时刻消费情况对比" forceFit>
                  <h4 className={styles.rankingTitle}>不同年级不同时刻消费情况对比</h4>
                  <Legend/>
                  <Axis name="time"/>
                  <Axis
                    name="cost"
                  />
                  <Tooltip
                    crosshairs={{
                      type: "y"
                    }}
                  />
                  <Geom
                    type="line"
                    position="time*cost"
                    size={2}
                    color={"dif"}
                  />
                  <Geom
                    type="point"
                    position="time*cost"
                    size={4}
                    shape={"circle"}
                    color={"dif"}
                    style={{
                      stroke: "#fff",
                      lineWidth: 1
                    }}
                  />
                </Chart>
              </div>
            </Col>
            <Col span={7} offset={1}>
              <div className={styles.salesRank}>
                <h4 className={styles.rankingTitle}>
                  每时段消费额排名
                </h4>
                <ul className={styles.rankingList}>
                  {rankingListData.map((item, i) => (
                    <li key={item.title}>
                        <span
                          className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}
                        >
                          {i + 1}
                        </span>
                      <span className={styles.rankingItemTitle} title={item.title}>
                          {item.title}
                        </span>
                      <span>{numeral(item.total).format('0,0')}</span>
                    </li>
                  ))}
                </ul>
                <Card size="small" title="文字分析" hoverable={true} style={{ marginTop: 20 }}>
                  <p>高一的整体消费水平比高三高，高一消费主要集中在12点，高三主要集中在18点</p>
                </Card>
              </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab={<span><Icon type="line-chart"/>走读住宿对比</span>} key="Leave">
          <Row>
            <Col span={16}>
              <div className={styles.salesBar}>
                <Chart height={400} data={LeaveData} padding="auto" title="走读生/住校生不同时刻消费情况对比" forceFit>
                  <h4 className={styles.rankingTitle}>走读生/住校生不同时刻消费情况对比</h4>
                  <Legend/>
                  <Axis name="time"/>
                  <Axis
                    name="cost"
                  />
                  <Tooltip
                    crosshairs={{
                      type: "y"
                    }}
                  />
                  <Geom
                    type="line"
                    position="time*cost"
                    size={2}
                    color={"dif"}
                  />
                  <Geom
                    type="point"
                    position="time*cost"
                    size={4}
                    shape={"circle"}
                    color={"dif"}
                    style={{
                      stroke: "#fff",
                      lineWidth: 1
                    }}
                  />
                </Chart>
              </div>
            </Col>
            <Col span={7} offset={1}>
              <div className={styles.salesRank}>
                <h4 className={styles.rankingTitle}>
                  每时段消费额排名
                </h4>
                <ul className={styles.rankingList}>
                  {rankingListData.map((item, i) => (
                    <li key={item.title}>
                        <span
                          className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}
                        >
                          {i + 1}
                        </span>
                      <span className={styles.rankingItemTitle} title={item.title}>
                          {item.title}
                        </span>
                      <span>{numeral(item.total).format('0,0')}</span>
                    </li>
                  ))}
                </ul>
                <Card size="small" title="文字分析" hoverable={true} style={{ marginTop: 20 }}>
                  <p>走读生和住校生在12点时的消费水平持平，住校生消费主要集中在12点，和6点，走读生在家吃早饭</p>
                </Card>
              </div>
            </Col>
          </Row>
        </TabPane>
      </Tabs>
    </Card>
    <Card title="总体消费趋势" bordered={true} style={{ width: '100%', marginTop: 32 }}>
      <Row>
        <Col span={7}>
          <div className={styles.salesRank}>
            <h4 className={styles.rankingTitle}>
              消费总额排名
            </h4>
            <ul className={styles.rankingList}>
              {rankingListData.map((item, i) => (
                <li key={item.title}>
                        <span
                          className={`${styles.rankingItemNumber} ${i < 3 ? styles.active : ''}`}
                        >
                          {i + 1}
                        </span>
                  <span className={styles.rankingItemTitle} title={item.title}>
                          {item.title}
                        </span>
                  <span>{numeral(item.total).format('0,0')}</span>
                </li>
              ))}
            </ul>
            <Card size="small" title="文字分析" hoverable={true} style={{ marginTop: 20 }}>
              <p>走读生和住校生在12点时的消费水平持平，住校生消费主要集中在12点，和6点，走读生在家吃早饭</p>
            </Card>
          </div>
        </Col>
        <Col span={16} offset={1}>
          <OneTimelineChart
            height={400}
            data={DaySumConsumptionData}
          />
        </Col>
      </Row>
    </Card>
  </React.Fragment>;
});

export default EcardConsumptionCard;
