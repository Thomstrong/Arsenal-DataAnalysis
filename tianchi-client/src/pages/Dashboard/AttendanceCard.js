/**
 * Created by 胡晓慧 on 2019/4/19.
 */
import React, { memo } from 'react';
import { Card, Col, Row } from 'antd';
import { Pie, TimelineChart } from '@/components/Charts';
import styles from './EcardConsumptionCard.less';
import numeral from 'numeral';
import { Axis, Chart, Geom, Legend, Tooltip } from "bizcharts";
import DataSet from "@antv/data-set";

//punch card的data
const data = [
  [0, 0, 10],
  [0, 1, 5],
  [0, 2, 17],
  [0, 3, 0],
  [0, 4, 3],
  [0, 5, 0],
  [0, 6, 0],
  [0, 7, 0],
  [0, 8, 5],
  [0, 9, 8],
  [0, 10, 12],
  [0, 11, 14],
  [0, 12, 3],
  [0, 13, 11],
  [0, 14, 36],
  [0, 15, 40],
  [0, 16, 30],
  [0, 17, 34],
  [0, 18, 23],
  [0, 19, 10],
  [0, 20, 10],
  [0, 21, 12],
  [0, 22, 9],
  [0, 23, 7],

  [1, 0, 15],
  [1, 1, 2],
  [1, 2, 0],
  [1, 3, 0],
  [1, 4, 1],
  [1, 5, 6],
  [1, 6, 0],
  [1, 7, 2],
  [1, 8, 4],
  [1, 9, 9],
  [1, 10, 55],
  [1, 11, 113],
  [1, 12, 55],
  [1, 13, 30],
  [1, 14, 90],
  [1, 15, 107],
  [1, 16, 134],
  [1, 17, 103],
  [1, 18, 63],
  [1, 19, 60],
  [1, 20, 43],
  [1, 21, 28],
  [1, 22, 27],
  [1, 23, 9],

  [2, 0, 17],
  [2, 1, 6],
  [2, 2, 0],
  [2, 3, 1],
  [2, 4, 3],
  [2, 5, 1],
  [2, 6, 0],
  [2, 7, 0],
  [2, 8, 1],
  [2, 9, 9],
  [2, 10, 29],
  [2, 11, 77],
  [2, 12, 53],
  [2, 13, 35],
  [2, 14, 102],
  [2, 15, 105],
  [2, 16, 115],
  [2, 17, 115],
  [2, 18, 81],
  [2, 19, 46],
  [2, 20, 56],
  [2, 21, 32],
  [2, 22, 27],
  [2, 23, 25],

  [3, 0, 13],
  [3, 1, 10],
  [3, 2, 1],
  [3, 3, 0],
  [3, 4, 2],
  [3, 5, 6],
  [3, 6, 0],
  [3, 7, 0],
  [3, 8, 1],
  [3, 9, 15],
  [3, 10, 45],
  [3, 11, 105],
  [3, 12, 54],
  [3, 13, 35],
  [3, 14, 98],
  [3, 15, 113],
  [3, 16, 125],
  [3, 17, 145],
  [3, 18, 84],
  [3, 19, 74],
  [3, 20, 78],
  [3, 21, 50],
  [3, 22, 43],
  [3, 23, 21],

  [4, 0, 9],
  [4, 1, 2],
  [4, 2, 3],
  [4, 3, 0],
  [4, 4, 7],
  [4, 5, 1],
  [4, 6, 2],
  [4, 7, 1],
  [4, 8, 8],
  [4, 9, 23],
  [4, 10, 48],
  [4, 11, 97],
  [4, 12, 65],
  [4, 13, 36],
  [4, 14, 75],
  [4, 15, 129],
  [4, 16, 98],
  [4, 17, 116],
  [4, 18, 70],
  [4, 19, 47],
  [4, 20, 48],
  [4, 21, 57],
  [4, 22, 31],
  [4, 23, 26],

  [5, 0, 12],
  [5, 1, 9],
  [5, 2, 0],
  [5, 3, 14],
  [5, 4, 0],
  [5, 5, 0],
  [5, 6, 1],
  [5, 7, 0],
  [5, 8, 1],
  [5, 9, 21],
  [5, 10, 50],
  [5, 11, 82],
  [5, 12, 45],
  [5, 13, 41],
  [5, 14, 101],
  [5, 15, 135],
  [5, 16, 102],
  [5, 17, 99],
  [5, 18, 64],
  [5, 19, 19],
  [5, 20, 24],
  [5, 21, 27],
  [5, 22, 38],
  [5, 23, 27],

  [6, 0, 17],
  [6, 1, 10],
  [6, 2, 14],
  [6, 3, 0],
  [6, 4, 1],
  [6, 5, 1],
  [6, 6, 0],
  [6, 7, 1],
  [6, 8, 4],
  [6, 9, 7],
  [6, 10, 11],
  [6, 11, 10],
  [6, 12, 2],
  [6, 13, 13],
  [6, 14, 28],
  [6, 15, 47],
  [6, 16, 39],
  [6, 17, 36],
  [6, 18, 25],
  [6, 19, 7],
  [6, 20, 14],
  [6, 21, 12],
  [6, 22, 1],
  [6, 23, 3]
];
const source = [];
for (let i = 0; i < 7; i++) {
  for (let j = 0; j < 24; j++) {
    const item = {};
    item.weekday = i;
    item.hour = data[i * 24 + j][1];
    item.commits = data[i * 24 + j][2];
    source.push(item);
  }
}
const cols = {
  weekday: {
    type: "cat",
    values: [
      "Sunday",
      "Monday",
      "Tuesday",
      "Wednesday",
      "Thursday",
      "Friday",
      "Saturday"
    ]
  },
  hour: {
    type: "cat",
    values: [
      "12a",
      "1a",
      "2a",
      "3a",
      "4a",
      "5a",
      "6a",
      "7a",
      "8a",
      "9a",
      "10a",
      "11a",
      "12p",
      "1p",
      "2p",
      "3p",
      "4p",
      "5p",
      "6p",
      "7p",
      "8p",
      "9p",
      "10p",
      "11p"
    ]
  }
};
//考勤不合格人数及类别数据（分组层叠柱状图）
const electiveColData = [
  {
    State: "2014年",
    "迟到_高一": 310,
    "迟到_高二": 559,
    "迟到_高三": 259,
    "早退_高一": 450,
    "早退_高二": 123,
    "早退_高三": 121,
    "校服违纪_高一": 450,
    "校服违纪_高二": 123,
    "校服违纪_高三": 121,
  },
  {
    State: "2015年",
    "迟到_高一": 310,
    "迟到_高二": 559,
    "迟到_高三": 259,
    "早退_高一": 450,
    "早退_高二": 123,
    "早退_高三": 121,
    "校服违纪_高一": 450,
    "校服违纪_高二": 123,
    "校服违纪_高三": 121,
  },
  {
    State: "2016年",
    "迟到_高一": 310,
    "迟到_高二": 559,
    "迟到_高三": 259,
    "早退_高一": 450,
    "早退_高二": 123,
    "早退_高三": 121,
    "校服违纪_高一": 450,
    "校服违纪_高二": 123,
    "校服违纪_高三": 121,
  },
  {
    State: "2017年",
    "迟到_高一": 310,
    "迟到_高二": 559,
    "迟到_高三": 259,
    "早退_高一": 450,
    "早退_高二": 123,
    "早退_高三": 121,
    "校服违纪_高一": 450,
    "校服违纪_高二": 123,
    "校服违纪_高三": 121,
  },
  {
    State: "2018年",
    "迟到_高一": 310,
    "迟到_高二": 559,
    "迟到_高三": 259,
    "早退_高一": 450,
    "早退_高二": 123,
    "早退_高三": 121,
    "校服违纪_高一": 450,
    "校服违纪_高二": 123,
    "校服违纪_高三": 121,
  },
  {
    State: "2019年",
    "迟到_高一": 310,
    "迟到_高二": 559,
    "迟到_高三": 259,
    "早退_高一": 450,
    "早退_高二": 123,
    "早退_高三": 121,
    "校服违纪_高一": 450,
    "校服违纪_高二": 123,
    "校服违纪_高三": 121,
  }
];
const category = [
  "迟到_高一",
  "迟到_高二",
  "迟到_高三",
  "早退_高一",
  "早退_高二",
  "早退_高三",
  "校服违纪_高一",
  "校服违纪_高二",
  "校服违纪_高三",
];
const eleColData = new DataSet.View().source(electiveColData)
  .transform({
    type: "fold",
    fields: category,
    key: "category",
    value: "population",
    retains: ["State"]
  })
  .transform({
    type: "map",
    callback: obj => {
      const key = obj.category;
      let type;

      if (
        key === "迟到_高一" ||
        key === "迟到_高二" ||
        key === "迟到_高三"
      ) {
        type = "迟到";
      } else if (
        key === "早退_高一" ||
        key === "早退_高二" ||
        key === "早退_高三"
      ) {
        type = "早退";
      } else {
        type = "校服违纪";
      }
      obj.type = type;
      return obj;
    }
  });
const colorMap = {
  "迟到_高一": "#36CFC9",
  "迟到_高二": "#209BDD",
  "迟到_高三": "#1581E6",
  "早退_高一": "#36CFC9",
  "早退_高二": "#209BDD",
  "早退_高三": "#1581E6",
  "校服违纪_高一": "#36CFC9",
  "校服违纪_高二": "#209BDD",
  "校服违纪_高三": "#1581E6",
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


const AttendanceCard = memo(() => (
  <React.Fragment>
    <Card title="进离校时间概况" bordered={false} style={{ marginTop: 32 }}>
      <Row>
        <Col span={16}>
          <Chart
            height={400}
            data={source}
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
              size={["commits", [2, (window.innerWidth - 120) / 48]]}
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
            data={eleColData}
            padding={[20, 160, 80, 60]}
            forceFit
          >
            <Axis
              name="population"
            />
            <Legend position="right"/>
            <Tooltip/>
            <Geom
              type="interval"
              position="State*population"
              color={[
                "category",
                function (category) {
                  return colorMap[category];
                }
              ]}
              tooltip={[
                "category*population",
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
  </React.Fragment>
));

export default AttendanceCard;

