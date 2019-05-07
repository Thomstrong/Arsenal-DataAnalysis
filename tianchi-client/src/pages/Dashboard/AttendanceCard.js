/**
 * Created by 胡晓慧 on 2019/4/19.
 */
import React, {memo} from 'react';
import {Card, Col, Row, Typography} from 'antd';
import {WEEKDAY_ALIAS,HOUR_LIST} from '@/constants';
import {Pie, TimelineChart} from '@/components/Charts';
import styles from './EcardConsumptionCard.less';
import numeral from 'numeral';
import {Axis, Chart, Geom, Legend, Tooltip} from "bizcharts";

const {Paragraph, Text} = Typography;

const cols = {
  weekday: {
    type: "cat",
    values: Object.values(WEEKDAY_ALIAS)
  },
  hour: {
    type: "cat",
    values: HOUR_LIST
  }
};
const colorMap = {
  "高三_迟到": "#2190d3",
  "高二_迟到": "#60acfc",
  "高一_迟到": "#80bcfc",
  "高一_早退": "#7bcfb2",
  "高二_早退": "#5bc49f",
  "高三_早退": "#51b08e",
  "高一_校服违纪": "#ffe168",
  "高二_校服违纪": "#feb64d",
  "高三_校服违纪": "#e58d5e",
};


const AttendanceRankingListData = [
  {
    title: "周日10时进离校人次",
    total: 293
  },
  {
    title: "周二 6 时进离校人次",
    total: 202
  },
  {
    title: "周日12时进离校人次",
    total: 201
  },
  {
    title: "周五 6 时进离校人次",
    total: 187
  }
];
const violationRankingData = [
  {
    title: "2017 - 2018 学年高三早退",
    total: 865
  },
  {
    title: "2017 - 2018 学年高三迟到",
    total: 546
  },
  {
    title: "2017 - 2018 学年高二校服违纪",
    total: 424
  },
];


const AttendanceCard = memo(({data}) => {
    const {enterSchoolData, kaoqinMixedData} = data;
    return <React.Fragment>
      <Card title="2018-2019学年进离校时间概况" bordered={false} style={{marginTop: 24}}>
        <Row>
          <Col xl={16} lg={24} md={24} sm={24} xm={24}>
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
                tooltip={['hour*weekday*count', (hour, weekday, count) => {
                  return {
                    name: `${WEEKDAY_ALIAS[weekday]} ${hour}时`,
                    value: count + "人次"
                  };
                }]}
                opacity={0.5}
              />
            </Chart>
          </Col>
          {enterSchoolData && <Col xl={8} lg={24} md={24} sm={24} xm={24}>
            <div className={styles.salesRank}>
              <h4 className={styles.rankingTitle}>
                进离校时间排名
              </h4>
              <ul className={styles.rankingList}>
                {AttendanceRankingListData.map((item, i) => (
                  <li key={item.title}>
                        <span
                          className={`${styles.rankingItemNumber} ${i < 1 ? styles.active : ''}`}
                        >
                          {i + 1}
                        </span>
                    <span className={styles.rankingItemTitle} title={item.title}>
                          {item.title}
                        </span>
                    <span>{numeral(item.total).format('0,0')}人次</span>
                  </li>
                ))}
              </ul>
              <Card size="small" title="文字分析" hoverable={true} style={{marginTop: 20,cursor:"auto"}}>
                <Paragraph>1. <Text type='danger'>数据量有限</Text>不能代表所有学生的进离校情况;</Paragraph>
                <Paragraph>2. 早上<Text type='danger'> 6 时</Text>是绝大多数学生的进校时间,7时会有部分学生姗姗来迟;</Paragraph>
                <Paragraph>3. <Text type='danger'>周五</Text>下午<Text type='danger'> 3时 - 4 时</Text>是离校高峰，
                  <Text type='danger'>周日 10 时 - 12 时</Text>住校生普遍返校</Paragraph>
              </Card>
            </div>
          </Col>}
        </Row>

      </Card>
      <Card title="考勤情况一览" bordered={false} style={{marginTop: 24}}>
        <Row>
          {kaoqinMixedData && <Col xl={8} lg={24} md={24} sm={24} xm={24}>
            <div className={styles.salesRank}>
              <h4 className={styles.rankingTitle}>
                违纪次数排名
              </h4>
              <ul className={styles.rankingList}>
                {violationRankingData.map((item, i) => (
                  <li key={item.title}>
                        <span
                          className={`${styles.rankingItemNumber} ${i < 1 ? styles.active : ''}`}
                        >
                          {i + 1}
                        </span>
                    <span className={styles.rankingItemTitle} title={item.title}>
                          {item.title}
                        </span>
                    <span>{numeral(item.total).format('0,0')}人次</span>
                  </li>
                ))}
              </ul>
              <Card size="small" title="文字分析" hoverable={true} style={{marginTop: 20,cursor:"auto"}}>
                <Paragraph>1. 违纪情况呈<Text type="danger">递增</Text>趋势，
                  <Text type="danger"> 17 - 18 学年</Text>考勤不合格人数最多( 18 - 19 学年仅有一学期数据);</Paragraph>
                <Paragraph>2. <Text type="danger">高一</Text>违纪情况在任一学年任一类型都是最<Text type="danger">少</Text>的，
                  同时，<Text type="danger">高三</Text>几乎肩负起了<Text type="danger">一半</Text>的违纪指标;</Paragraph>
                <Paragraph>3. 每一学年的高三学生都会有迟到和校服违纪的现象，但
                  <Text type="danger">早退</Text>集中在 17 学年和 18 学年。</Paragraph>
              </Card>
            </div>
          </Col>}
          <Col xl={16} lg={24} md={24} sm={24} xm={24}>
            <Chart
              height={420}
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
                      value: population + "人次"
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

