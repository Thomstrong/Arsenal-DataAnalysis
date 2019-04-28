/**
 * Created by 胡晓慧 on 2019/4/18.
 */
import React, { memo } from 'react';
import { Card, Col, Radio, Row } from 'antd';
import styles from './LocationMap.less';
import { Pie, TimelineChart } from '@/components/Charts';
import numeral from 'numeral';
import { Chart, Coord, Geom, Label, Legend, Tooltip, View, } from 'bizcharts';

import DataSet from '@antv/data-set';

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
  return <div className={styles.twoColLayout}>
    <Row gutter={24}>
      <Col xl={12} lg={24} md={24} sm={24} xs={24}>
        <Card
          height={400}
          loading={sexDistriLoading}
          className={styles.salesCard}
          bordered={false}
          title='性别分布一览'
          padding="auto"
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
          title='人员分布情况'
          padding="auto"
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
            height={270}
            lineWidth={4}
            style={{ padding: '8px 0' }}
          />
        </Card>
      </Col>
    </Row>
    {!!showAnalysis && !sexDistriLoading && !locationLoading && <Row gutter={24}>
      <Col xl={24} xs={24}>
        <Card title="人员分析" hoverable={true}>
          <p>1. 高一高二高三人数递减，高一男生占全校学生数的1／4;各年级女生人数比较稳定都在16%左右，男生人数呈明显递减趋势，高三年级女生人数反超男生;</p>
          <p>2. 当前学年，走读生占6成; 男生走读人数和住校人数持平，女生走读人数是住校人数的近3倍;住校生中男生人数也是女生的两倍有余;</p>
          <p>3. 学校生源主要来自于浙江宁波(本地)，外地生源中以湖北省的生源最多。todo 待做</p>
        </Card>
      </Col>
    </Row>}
  </div>;

});

export default LocationMap;

