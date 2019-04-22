/**
 * Created by 胡晓慧 on 2019/4/19.
 */
import React, { memo } from 'react';
import { Card, Col, Row } from 'antd';
import { Pie, TimelineChart } from '@/components/Charts';
import styles from './EcardConsumptionCard.less';
import numeral from 'numeral';
import { Axis, Chart, Geom, Legend, Tooltip } from "bizcharts";

const cols = {
  weekday: {
    type: "cat",
    values: [
      "周一",
      "周二",
      "周三",
      "周四",
      "周五",
      "周六",
      "周日"
    ]
  },
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
};
const colorMap = {
  "高一_迟到": "#36CFC9",
  "高二_迟到": "#209BDD",
  "高三_迟到": "#1581E6",
  "高一_早退": "#36CFC9",
  "高二_早退": "#209BDD",
  "高三_早退": "#1581E6",
  "高一_校服违纪": "#36CFC9",
  "高二_校服违纪": "#209BDD",
  "高三_校服违纪": "#1581E6",
};

const rankingListData = [
  {
    title: "2016年高一迟到人数",
    total: 66
  },
  {
    title: "2017年高二迟到人数",
    total: 22220
  },
  {
    title: "2018年高一迟到人数",
    total: 22220
  },
  {
    title: "2019年高一迟到人数",
    total: 22220
  },
  {
    title: "2020年高一迟到人数",
    total: 22220
  },
];
const AttendanceRankingListData = [
  {
    title: "12点10分",
    total: 66
  },
  {
    title: "12点20",
    total: 22220
  },
  {
    title: "16点10",
    total: 22220
  },
  {
    title: "16点20",
    total: 22220
  },
  {
    title: "16点30",
    total: 22220
  },
];


const AttendanceCard = memo(({ data }) => {
    const { enterSchoolData, kaoqinMixedData } = data;
    return <React.Fragment>
      <Card title="进离校时间概况" bordered={false} style={{ marginTop: 32 }}>
        <Row>
          <Col span={16}>
            <Chart
              height={400}
              data={enterSchoolData}
              padding={[20, 60, 40, 100]}
              scale={cols}
              forceFit
            >
              <Axis
                name="weekday"
                line={null}
                tickLine={null}
                grid={null}
                label={{
                  textStyle: {
                    fontSize: 14,
                    fill: "#555"
                  }
                }}
              />
              <Axis
                name="hour"
                line={{
                  stroke: "#eee",
                  lineWidth: 1
                }}
                tickLine={{
                  length: -10
                }}
              />

              <Tooltip showTitle={false}/>
              <Geom
                type="point"
                position="hour*weekday"
                color="#bfbfbf"
                shape="circle"
                size={["count", [2, (window.innerWidth - 120) / 48]]}
                tooltip="x*y*z"
                opacity={0.5}
              />
            </Chart>
          </Col>
          <Col span={7} offset={1}>
            <div className={styles.salesRank}>
              <h4 className={styles.rankingTitle}>
                违纪次数排名
              </h4>
              <ul className={styles.rankingList}>
                {AttendanceRankingListData.map((item, i) => (
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
                <p>离校时间集中在xxxx时间，建议错开放学时间，避免发生人员踩踏</p>
              </Card>
            </div>
          </Col>
        </Row>

      </Card>
      <Card title="考勤情况一览" bordered={false} style={{ marginTop: 32 }}>
        <Row>
          <Col span={7}>
            <div className={styles.salesRank}>
              <h4 className={styles.rankingTitle}>
                违纪次数排名
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
                <p>xxx年考勤不合格人数最多，早退人数呈下降趋势？高一中校服违纪的人数最多</p>
              </Card>
            </div>
          </Col>
          <Col span={16} offset={1}>
            <Chart
              height={400}
              data={kaoqinMixedData}
              padding={[20, 160, 80, 60]}
              forceFit
            >
              <Axis
                name="count"
              />
              <Legend position="right"/>
              <Tooltip/>
              <Geom
                type="interval"
                position="term*count"
                color={[
                  "grade",
                  function (category) {
                    return colorMap[category];
                  }
                ]}
                tooltip={[
                  "grade*count",
                  (category, population) => {
                    return {
                      name: category,
                      value: population
                    };
                  }
                ]}
                adjust={[
                  {
                    type: "dodge",
                    dodgeBy: "type",
                    // 按照 type 字段进行分组
                    marginRatio: 0.1 // 分组中各个柱子之间不留空隙
                  },
                  {
                    type: "stack"
                  }
                ]}
              />
            </Chart>
          </Col>
        </Row>
      </Card>
    </React.Fragment>;
  }
);

export default AttendanceCard;

