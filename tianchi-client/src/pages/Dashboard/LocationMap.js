/**
 * Created by 胡晓慧 on 2019/4/18.
 */
import React, { Fragment, memo } from 'react';
import {Card, Col, Radio, Row, Select, Typography} from 'antd';
import styles from './LocationMap.less';
import { Pie, TimelineChart } from '@/components/Charts';
import numeral from 'numeral';
import { Chart, Coord, Geom, Label, Legend, Tooltip, View, } from 'bizcharts';

import DataSet from '@antv/data-set';
const {Paragraph, Text} = Typography;

const cols = {
  percent: {
    formatter: (val) => {
      val = `${(val * 100).toFixed(2)}%`;
      return val;
    },
  },
};


const LocationMap = memo(({ sexType, studentType, data, handleChangeSexType, handleChangeStudentType }) => {
  const { sexPieData, studentPieData, totalStudentCount, sexDistriLoading, locationLoading } = data;
  const showAnalysis = sexPieData.length + studentPieData.length + totalStudentCount;
  return(
    <Fragment>
    <Row gutter={24} type="flex" justify="space-between">
      <Col xl={12} lg={24} md={24} sm={24} xs={24}>
        <Card
          height={400}
          loading={sexDistriLoading}
          className={styles.salesCard}
          bordered={false}
          title='性别分布概况'
          extra={
            <div className={styles.salesCardExtra}>
              <div className={styles.salesTypeRadio}>
                <Radio.Group defaultValue={sexType} onChange={handleChangeSexType}>
                  <Radio.Button value="grade">
                    年级
                  </Radio.Button>
                  <Radio.Button value="leave">
                    走住校生
                  </Radio.Button>
                </Radio.Group>
              </div>
            </div>
          }
        >
          <Chart
            key='sex-distribution-chart'
            data={new DataSet.View().source(sexPieData).transform({
              type: 'percent',
              field: 'value',
              dimension: 'type',
              as: 'percent',
            })}
            scale={cols}
            height={270}
            padding='auto'
            forceFit
          >
            <Coord type="theta" radius={0.5}/>
            <Legend position="right-center"/>
            <Tooltip
              showTitle={false}
              itemTpl="<li><span style=&quot;background-color:{color};&quot; class=&quot;g2-tooltip-marker&quot;></span>{name}: {value}</li>"
            />
            <Geom
              type="intervalStack"
              position="percent"
              color="type"
              tooltip={[
                'type*percent',
                (item, percent) => {
                  percent = `${(percent * 100).toFixed(2)}%`;
                  return {
                    name: item,
                    value: percent,
                  };
                },
              ]}
              style={{
                lineWidth: 1,
                stroke: '#fff',
              }}
              select={false}
            >
              <Label content="type" offset={-10}/>
            </Geom>
            <View
              data={new DataSet.View().source(sexPieData).transform({
                type: 'percent',
                field: 'value',
                dimension: 'name',
                as: 'percent',
              })}
              scale={cols}
              key='sex-distribution-grade'
            >
              <Coord type="theta" radius={0.75} innerRadius={0.5 / 0.75}/>
              <Geom
                type="intervalStack"
                position="percent"
                color={[
                  'name',
                  [
                    '#BAE7FF',
                    '#7FC9FE',
                    '#71E3E3',
                    '#ABF5F5',
                    '#8EE0A1',
                    '#BAF5C4',
                  ],
                ]}
                tooltip={[
                  'name*percent',
                  (item, percent) => {
                    percent = `${(percent * 100).toFixed(2)}%`;
                    return {
                      name: item,
                      value: percent,
                    };
                  },
                ]}
                style={{
                  lineWidth: 1,
                  stroke: '#fff',
                }}
                select={false}
              >
                <Label content="name"/>
              </Geom>
            </View>
          </Chart>
        </Card>
      </Col>
      <Col xl={12} lg={24} md={24} sm={24} xs={24}>
        <Card
          height={400}
          loading={locationLoading}
          className={styles.salesCard}
          bordered={false}
          title='人员分布概况'
          extra={
            <div className={styles.salesCardExtra}>
              <div className={styles.salesTypeRadio}>
                <Radio.Group defaultValue={studentType} onChange={handleChangeStudentType}>
                  <Radio.Button value="nativePlace">
                    来源地分布
                  </Radio.Button>
                  <Radio.Button value="nation">
                    民族分布
                  </Radio.Button>
                  <Radio.Button value="policy">
                    政治面貌分布
                  </Radio.Button>
                </Radio.Group>
              </div>
            </div>
          }
        >
          <Pie
            key='nativePlace-distribution'
            hasLegend={true}
            subTitle='学生总数'
            total={totalStudentCount}
            data={studentPieData}
            valueFormat={value => `${numeral(value).format('0,0')}人`}
            height={253.8}
            lineWidth={4}
            style={{ padding: '8px 0' }}
          />
        </Card>
      </Col>
    </Row>
    {!!showAnalysis && !sexDistriLoading && !locationLoading &&
        <Card title="人员分析" hoverable={true} style={{cursor:"auto", marginTop:24}}>
          <Paragraph>1. 高一高二高三人数递减，<Text type="danger">高一男生</Text>占全校学生数的<Text type="danger"> 1/4 </Text>;
            各年级女生人数比较稳定都在<Text type="danger"> 16% </Text>左右，男生人数呈明显递<Text type="danger">减</Text>趋势，
            高三年级女生人数反超男生。</Paragraph>
          <Paragraph>2. 当前学年，走读生占<Text type="danger"> 6 成</Text>; 男生走读人数和住校人数持平，
            女生走读人数是住校人数的<Text type="danger">近 3 倍</Text>;
            住校生中男生人数也是女生的<Text type="danger"> 2 倍</Text>有余。</Paragraph>
          <Paragraph>3. 学校生源主要来自于<Text type="danger">浙江省宁波市</Text>(本地)，外地生源中以<Text type="danger">江西省</Text>的生源最多。
            其他省市生源比较分散。</Paragraph>
          <Paragraph>4. 汉族是学生的主要民族，但仍有<Text type="danger">近 1% </Text>的学生来自其他各个民族。</Paragraph>
          <Paragraph>5. 该校学生的主要政治面貌是<Text type="danger">共青团员</Text>，还有一位共产党员，一位民主党派人士。</Paragraph>
        </Card>}
    </Fragment>);

});

export default LocationMap;

