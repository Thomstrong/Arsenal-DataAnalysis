/**
 * Created by 胡晓慧 on 2019/4/19.
 */
import React, {memo} from 'react';
import {Card, Col, Icon, Row, Tabs, Typography} from 'antd';
import {OneTimelineChart, Pie} from '@/components/Charts';
import styles from './EcardConsumptionCard.less';
import numeral from 'numeral';
import {Axis, Chart, Geom, Legend, Tooltip, View} from "bizcharts";

const {Paragraph, Text} = Typography;
const TabPane = Tabs.TabPane;

//有图表后的分析数据，无需从后端获得
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
];
const gradeRankingData = [
  {
    title: "高三8时平均消费",
    total: 16.64
  },
  {
    title: "高三14时平均消费",
    total: 16.31
  },
  {
    title: "高三15时平均消费",
    total: 15.12
  },
];
const leaveRankingData = [
  {
    title: "走读生8时平均消费",
    total: 15.87
  },
  {
    title: "走读生14时平均消费",
    total: 15.08
  },
  {
    title: "走读生15时平均消费",
    total: 14.09
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
    alias: "就餐人数"
  }
};



const getColor = (category) => {
  return {
    "整体": "#ea87e4",
  }[category];
};
const EcardConsumptionCard = memo(({data}) => {
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
    <Card loading={sexHourlyLoading} className={styles.tabsCard} style={{marginTop: 32}}>
      <Tabs defaultActiveKey={"Sex"}>
        <TabPane tab={<span><Icon type="line-chart"/>性别对比</span>} key="Sex">
          <Row>
            <Col span={16}>
              <div className={styles.salesBar}>
                <Chart
                  height={400}
                  key='cost-summary-sex'
                  padding={["auto", "auto", 80, "auto"]}
                  forceFit
                  scale={scale}
                >
                  <h4 className={styles.rankingTitle}>不同性别不同时刻平均消费情况对比</h4>
                  <Legend/>
                  <Tooltip/>
                  <View data={sexHourlyData} scale={scale}>
                    <Axis name="hour"/>
                    <Axis name="cost"/>
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
                      tooltip={['hour*cost*sex', (hour, cost, sex) => {
                        return {
                          name: sex + '平均消费',
                          value: cost + "元"
                        };
                      }]}
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
                      tooltip={['hour*cost*sex', (hour, cost, sex) => {
                        return {
                          name: sex + "平均消费",
                          value: cost + "元"
                        };
                      }]}
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
            {sexHourlyData && <Col span={7} offset={1}>
              <div className={styles.salesRank}>
                <h4 className={styles.rankingTitle}>
                  每时段消费额排名
                </h4>
                <ul className={styles.rankingList}>
                  {sexRankingData.map((item, i) => (
                    <li key={item.title}>
                        <span
                          className={`${styles.rankingItemNumber} ${i < 1 ? styles.active : ''}`}
                        >
                          {i + 1}
                        </span>
                      <span className={styles.rankingItemTitle} title={item.title}>
                          {item.title}
                        </span>
                      <span>¥{item.total}</span>
                    </li>
                  ))}
                </ul>
                <Card size="small" title="文字分析" hoverable={true} style={{marginTop: 20}}>
                  <Paragraph>1. 消费主要发生在<Text type='danger'>6、7</Text>时,<Text type='danger'>11、12</Text>时
                    和<Text type='danger'>17</Text>时三个时间段;</Paragraph>
                  <Paragraph>2.由于总体人数的差异，男生的消费人次明显比女生多，
                    但<Text type='danger'>女生</Text>的平均消费水平更<Text type='danger'>高</Text>一些;</Paragraph>
                  <Paragraph>3.平均消费金额的极值与消费人数的极值并不发生在同一时段，
                    可以看出<Text type='danger'>非就餐时间的消费</Text>(零食等)占据部分学生<Text type='danger'>更多</Text>开销。</Paragraph>
                </Card>
              </div>
            </Col>}
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
                  padding={["auto", "auto", 80, "auto"]}
                  title="不同年级不同时刻平均消费情况对比"
                  forceFit
                  scale={scale}
                >
                  <h4 className={styles.rankingTitle}>不同年级不同时刻平均消费情况对比</h4>
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
                    tooltip={['hour*cost*grade', (hour, cost, grade) => {
                        return {
                          name: grade + "平均消费",
                          value: cost + "元"
                        };
                      }]}
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
                    tooltip={['hour*cost*grade', (hour, cost, grade) => {
                        return {
                          name: grade + "平均消费",
                          value: cost + "元"
                        };
                      }]}
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
            {gradeHourlyData && <Col span={7} offset={1}>
              <div className={styles.salesRank}>
                <h4 className={styles.rankingTitle}>
                  每时段消费额排名
                </h4>
                <ul className={styles.rankingList}>
                  {gradeRankingData.map((item, i) => (
                    <li key={item.title}>
                        <span
                          className={`${styles.rankingItemNumber} ${i < 1 ? styles.active : ''}`}
                        >
                          {i + 1}
                        </span>
                      <span className={styles.rankingItemTitle} title={item.title}>
                          {item.title}
                        </span>
                      <span>¥{item.total}</span>
                    </li>
                  ))}
                </ul>
                <Card size="small" title="文字分析" hoverable={true} style={{marginTop: 20}}>
                  <Paragraph>1. 高一、高二、高三同学的消费水平呈明显<Text type='danger'>递增</Text>趋势。
                    由于食堂就餐金额相似,三餐饭点时的消费几乎没有差别,消费差异集中在<Text type='danger'>非就餐时刻</Text>;</Paragraph>
                  <Paragraph>2. 高一的消费集中在<Text type='danger'>饭点</Text>,高二高三尤其<Text type='danger'>不</Text>喜欢在校吃早饭,
                    <Text type='danger'>高三</Text>学生更喜欢中饭<Text type='danger'>提前</Text>吃;</Paragraph>
                  <Paragraph>3.建议可以<Text type='danger'>错开</Text>学生的就餐时间，特别关注高三学生的<Text type='danger'>早餐情况</Text>,
                    和<Text type='danger'>9时</Text>、<Text type='danger'>16</Text>时的额外消费情况。</Paragraph>
                </Card>
              </div>
            </Col>}
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
                  padding={["auto", "auto", 80, "auto"]}
                  title="走读生/住校生不同时刻平均消费情况对比"
                  forceFit
                >
                  <h4 className={styles.rankingTitle}>走读生/住校生不同时刻平均消费情况对比</h4>
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
                    tooltip={['hour*cost*stayType', (hour, cost, stayType) => {
                        return {
                          name: stayType + "平均消费",
                          value: cost + "元"
                        };
                      }]}
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
                    tooltip={['hour*cost*stayType', (hour, cost, stayType) => {
                        return {
                          name: stayType + "平均消费",
                          value: cost + "元"
                        };
                      }]}
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
            {stayHourlyData && <Col span={7} offset={1}>
              <div className={styles.salesRank}>
                <h4 className={styles.rankingTitle}>
                  每时段消费额排名
                </h4>
                <ul className={styles.rankingList}>
                  {leaveRankingData.map((item, i) => (
                    <li key={item.title}>
                        <span
                          className={`${styles.rankingItemNumber} ${i < 1 ? styles.active : ''}`}
                        >
                          {i + 1}
                        </span>
                      <span className={styles.rankingItemTitle} title={item.title}>
                          {item.title}
                        </span>
                      <span>¥{item.total}</span>
                    </li>
                  ))}
                </ul>
                <Card size="small" title="文字分析" hoverable={true} style={{marginTop: 20}}>
                  <Paragraph>1. <Text type='danger'>走读生</Text>消费水平明显<Text type='danger'>高</Text>于住校生,
                    中午和晚上的就餐情况也占据这人次的优势.由于早饭可以在家吃,仅有极少走读生选择在校吃早饭;</Paragraph>
                  <Paragraph>2. 走读生<Text type='danger'>晚饭</Text>时段消费人次<Text
                    type='danger'>下降</Text>明显,不吃晚饭极易影响晚自修效率;</Paragraph>
                  <Paragraph>3. 需要注意的是<Text type='danger'>0时</Text>，还有<Text
                    type='danger'>14人次</Text>的走读生进行了消费。</Paragraph>
                </Card>
              </div>
            </Col>}
          </Row>
        </TabPane>
      </Tabs>
    </Card>
    <Card title="总体消费趋势" bordered={true} style={{width: '100%', marginTop: 32}}>
      <Row>
        {yearCostData && <Col span={7}>
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
                  <span>¥{numeral(item.total).format('0,0')}</span>
                </li>
              ))}
            </ul>
            <Card size="small" title="文字分析" hoverable={true} style={{marginTop: 20}}>
              <Paragraph>1. 呈<Text type='danger'>周期性</Text>变化符合逻辑,周一二三四水平相当，
                <Text type='danger'>周五</Text>由于学生准备离校消费<Text type='danger'>减半</Text>，周六周日几乎没有消费;</Paragraph>
              <Paragraph>2. <Text type='danger'>2018年11月中旬</Text>，由于期中考试和运动会的原因，
                周中的消费水平较平常呈现明显<Text type='danger'>下降</Text>趋势;</Paragraph>
              <Paragraph>3. 每日消费总额基本稳定在<Text type='danger'>4.1万元</Text>左右.</Paragraph>
            </Card>
          </div>
        </Col>}
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

