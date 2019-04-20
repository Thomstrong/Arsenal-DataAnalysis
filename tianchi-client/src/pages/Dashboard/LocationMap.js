/**
 * Created by 胡晓慧 on 2019/4/18.
 */
import React, {memo} from 'react';
import {Card, Tabs, Row, Col, Dropdown, Menu, Icon, Radio} from 'antd';
import {formatMessage, FormattedMessage} from 'umi-plugin-react/locale';
import styles from './LocationMap.less';
import {TimelineChart, Pie} from '@/components/Charts';
import numeral from 'numeral';
import {
  Chart,
  Tooltip,
  Coord,
  Legend,
  Facet,
  Geom,
  Label,
  View,
} from 'bizcharts';
import Yuan from '@/utils/Yuan';

import DataSet from '@antv/data-set';
const {DataView} = DataSet;
const data = [
  {
    value: 251,
    type: '高一',
    name: '高一男生',
  },
  {
    value: 1048,
    type: '高一',
    name: '高一女生',
  },
  {
    value: 610,
    type: '高二',
    name: '高二男生',
  },
  {
    value: 434,
    type: '高二',
    name: '高二女生',
  },
  {
    value: 335,
    type: '高三',
    name: '高三男生',
  },
  {
    value: 250,
    type: '高三',
    name: '高三女生',
  },
];
const cols = {
  percent: {
    formatter: (val) => {
      val = `${(val * 100).toFixed(2)}%`;
      return val;
    },
  },
};


const LocationMap = memo(({sexType, studentType, sexPieData, studentPieData, handleChangeSexType, handleChangeStudentType})=>(
  <div className={styles.twoColLayout}>
    <Row gutter={24}>
      <Col xl={12} lg={24} md={24} sm={24} xs={24}>
        <Card
          height={400}
          className={styles.salesCard}
          bordered={false}
          title='性别分布一览'
          padding="auto"
          extra={
            <div className={styles.salesCardExtra}>
              <div className={styles.salesTypeRadio}>
                <Radio.Group value={sexType} onChange={handleChangeSexType}>
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
            <View data={new DataSet.View().source(sexPieData).transform({
              type: 'percent',
              field: 'value',
              dimension: 'name',
              as: 'percent',
            })} scale={cols}>
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
          className={styles.salesCard}
          bordered={false}
          title='人员分布情况'
          padding="auto"
          extra={
            <div className={styles.salesCardExtra}>
              <div className={styles.salesTypeRadio}>
                <Radio.Group value={studentType} onChange={handleChangeStudentType}>
                  <Radio.Button value="homeland">
                    来源地分布
                  </Radio.Button>
                  <Radio.Button value="nation">
                    民族分布
                  </Radio.Button>
                  <Radio.Button value="state">
                    政治面貌分布
                  </Radio.Button>
                </Radio.Group>
              </div>
            </div>
          }
        >
          <Pie
            hasLegend
            subTitle='人员分布'
            total={numeral(22252).format('0,0')}
            data={studentPieData}
            valueFormat={value => `${numeral(value).format('0,0')}人`}
            height={270}
            lineWidth={4}
            style={{padding: '8px 0'}}
          />
        </Card>
      </Col>
    </Row>
  </div>





));

export default LocationMap

