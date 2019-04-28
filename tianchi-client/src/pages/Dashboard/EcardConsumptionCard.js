/**
 * Created by 胡晓慧 on 2019/4/19.
 */
import React, { memo } from 'react';
import { Card, Col, Icon, Row, Tabs } from 'antd';
import { OneTimelineChart, Pie } from '@/components/Charts';
import styles from './EcardConsumptionCard.less';
import numeral from 'numeral';
import { Axis, Chart, Geom, Legend, Tooltip, View } from "bizcharts";


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
const sexRankingData = [
  {
    title: "女生8时平均消费",
    total: 18.72
  },
  {
    title: "女生14时平均消费",
    total: 17.75
  },
  {
    title: "女生13时平均消费",
    total: 15.09
  },
  {
    title: "女生15时平均消费",
    total: 14.84
  },
  {
    title: "男生8时平均消费",
    total: 13.15
  },

];
const yearCostRankingData = [
  {
    title: "2018年11月26日",
    total: 50828.37
  },
  {
    title: "2018年11月21日",
    total: 45518.94
  },
  {
    title: "2019年1月15日",
    total: 45000.19
  },
  // {
  //   title: "2018年11月19日",
  //   total: 44391.67
  // },
  // {
  //   title: "2018年11月20日",
  //   total: 44387.74
  // },

];
const scale = {
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
  },
  cost: {
    min: 0, max: 20,
    tickCount: 11,
  },
  count: {
    min: 0, max: 60000,
    tickCount: 11,
  }
};
const getColor = (category) => {
  return {
    "整体": "#ea87e4",
  }[category];
};
const EcardConsumptionCard = memo(({ data }) => {
  const {
    sexHourlyData, sexHourlyCountData, sexHourlyLoading,
    gradeHourlyData, gradeCostCountData,
    stayHourlyData, stayCountData,
    yearCostData
  } = data;
  return <React.Fragment>
    {/*<Card title="一卡通消费情况一览" bordered={false} style={{marginTop: 32}}>*/}
    {/*两个部分，分别是每天的总消费变化趋势和某时刻平均消费情况*/}
    {/*DataMarker可以后续有图表后进行补充*/}
    {/*第一部分，每天总消费变化趋势*/}
    {/*todo 消费对比的分析，等到添加完人数分布后*/}
    <Card loading={sexHourlyLoading} className={styles.tabsCard} style={{ marginTop: 32 }}>
      <Tabs defaultActiveKey={"Sex"}>
        <TabPane tab={<span><Icon type="line-chart"/>性别对比</span>} key="Sex">
          <Row>
            <Col span={16}>
              <div className={styles.salesBar}>
                <Chart
                  height={400}
                  key='cost-summary-sex'
                  padding={["auto","auto",80,"auto"]}
                  forceFit
                  scale={scale}
                >
                  <h4 className={styles.rankingTitle}>不同性别不同时刻消费情况对比</h4>
                  <Legend/>
                  <Tooltip/>
                  <View data={sexHourlyData} scale={scale}>
                    <Axis name="hour"/>
                    <Axis
                      name="cost"
                    />
                    <Geom
                      type="line"
                      position="hour*cost"
                      size={2}
                      color={[
                        "sex",
                        function (category) {
                          return getColor(category);
                        }
                      ]}
                    />
                    <Geom
                      type="point"
                      position="hour*cost"
                      size={4}
                      shape={"circle"}
                      color={[
                        "sex",
                        function (category) {
                          return getColor(category);
                        }
                      ]}
                      style={{
                        stroke: "#fff",
                        lineWidth: 1
                      }}
                    />
                  </View>
                  <View data={sexHourlyCountData} scale={scale}>
                    <Legend hoverable={false}/>
                    <Axis name="hour" visible={false}/>
                    <Axis name="count" position="right"/>
                    <Tooltip visible={false} title={false}/>
                    <Geom
                      type="interval"
                      position="hour*count"
                      opacity={0.5}
                      color={[
                        "sex",
                        function (category) {
                          return getColor(category);
                        }
                      ]}
                      size={6}
                      tooltip={['hour*count*sex', (hour, count, sex) => {
                        return {
                          name: sex,
                          value: count + "人"
                        };
                      }]}
                    />
                  </View>
                </Chart>
              </div>
            </Col>
            <Col span={7} offset={1}>
              <div className={styles.salesRank}>
                <h4 className={styles.rankingTitle}>
                  每时段消费额排名
                </h4>
                <ul className={styles.rankingList}>
                  {sexRankingData.map((item, i) => (
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
                  <p>女生的平均消费水平比男生高，todo 男生消费主要集中在12点，女生主要集中在18点</p>
                </Card>
              </div>
            </Col>
          </Row>
        </TabPane>
        <TabPane tab={<span><Icon type="line-chart"/>年级对比</span>} key="Grade">
          <Row>
            <Col span={16}>
              <div className={styles.salesBar}>
                <Chart
                  key='cost-summary-grade'
                  height={400}
                  data={gradeHourlyData}
                  padding={["auto","auto",80,"auto"]}
                  title="不同年级不同时刻消费情况对比"
                  forceFit
                  scale={scale}
                >
                  <h4 className={styles.rankingTitle}>不同年级不同时刻消费情况对比</h4>
                  <Legend/>
                  <Axis name="hour"/>
                  <Axis name="cost"/>
                  <Tooltip
                    crosshairs={{
                      type: "y"
                    }}
                  />
                  <Geom
                    type="line"
                    position="hour*cost"
                    size={2}
                    color={[
                      "grade",
                      function (category) {
                        return getColor(category);
                      }
                    ]}
                  />
                  <Geom
                    type="point"
                    position="hour*cost"
                    size={4}
                    shape={"circle"}
                    color={[
                      "grade",
                      function (category) {
                        return getColor(category);
                      }
                    ]}
                    style={{
                      stroke: "#fff",
                      lineWidth: 1
                    }}
                  />
                  <View data={gradeCostCountData} scale={scale}>
                    <Axis name="hour" visible={false}/>
                    <Axis
                      name="count" position="right"
                    />
                    <Tooltip visible={false} title={false}/>
                    <Geom
                      type="interval"
                      position="hour*count"
                      opacity={0.5}
                      color={[
                        "grade",
                        function (category) {
                          return getColor(category);
                        }
                      ]}
                      size={6}
                      tooltip={['hour*count*grade', (hour, count, grade) => {
                        return {
                          name: grade,
                          value: count + "人"
                        };
                      }]}
                    />
                  </View>
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
                <Chart
                  key='cost-summary-staySchool'
                  height={400} scale={scale}
                  data={stayHourlyData}
                  padding={["auto","auto",80,"auto"]}
                  title="走读生/住校生不同时刻消费情况对比"
                  forceFit
                >
                  <h4 className={styles.rankingTitle}>走读生/住校生不同时刻消费情况对比</h4>
                  <Legend/>
                  <Axis name="hour"/>
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
                    position="hour*cost"
                    size={2}
                    color={[
                      "stayType",
                      function (category) {
                        return getColor(category);
                      }
                    ]}
                  />
                  <Geom
                    type="point"
                    position="hour*cost"
                    size={4}
                    shape={"circle"}
                    color={[
                      "stayType",
                      function (category) {
                        return getColor(category);
                      }
                    ]}
                    style={{
                      stroke: "#fff",
                      lineWidth: 1
                    }}
                  />
                  <View data={stayCountData} scale={scale}>
                    <Axis name="hour" visible={false}/>
                    <Axis name="count" position="right"/>
                    <Tooltip visible={false} title={false}/>
                    <Geom
                      opacity={0.5}
                      type="interval"
                      position="hour*count"
                      color={[
                        "stayType",
                        function (category) {
                          return getColor(category);
                        }
                      ]}
                      size={6}
                      tooltip={['hour*count*stayType', (hour, count, stayType) => {
                        return {
                          name: stayType,
                          value: count + "人"
                        };
                      }]}
                    />
                  </View>
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
              {yearCostRankingData.map((item, i) => (
                <li key={item.title}>
                        <span
                          className={`${styles.rankingItemNumber} ${i < 1 ? styles.active : ''}`}
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
              <p>1. 呈周期性变化符合逻辑,周一二三四水平相当，周五由于学生准备离校消费减半，周六周日几乎没有消费;</p>
              <p>2. 2018年11月中旬，由于期中考试和运动会的原因，周中的消费水平较平常呈现明显下降趋势;</p>
              <p>3. 每日消费总额基本稳定在4万元左右.</p>
            </Card>
          </div>
        </Col>
        <Col span={16} offset={1}>
          <OneTimelineChart
            height={400}
            data={yearCostData.map((data) => {
              return {
                x: Date.parse(data.x),
                y: data.y
              };
            })}
          />
        </Col>
      </Row>
    </Card>
  </React.Fragment>;
});

export default EcardConsumptionCard;

