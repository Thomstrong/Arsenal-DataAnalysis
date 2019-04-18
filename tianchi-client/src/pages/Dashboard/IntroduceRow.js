import React, { memo } from 'react';
import { Row, Col, Icon, Tooltip } from 'antd';
import { FormattedMessage, formatMessage } from 'umi-plugin-react/locale';
import styles from './Analysis.less';
import { ChartCard, MiniArea, MiniBar, MiniProgress, Field } from '@/components/Charts';
import Trend from '@/components/Trend';
import numeral from 'numeral';
import Yuan from '@/utils/Yuan';

const topColResponsiveProps = {
  xs: 24,
  sm: 12,
  md: 12,
  lg: 12,
  xl: 6,
  style: { marginBottom: 24 },
};
const lastConsumptionData = [
    {
        x:"2019-1-1",
        y:1000
    },
    {
        x:"2019-1-2",
        y:6200
    },
    {
        x:"2019-1-6",
        y:2030
    },
    {
        x:"2019-1-10",
        y:6420
    },
    {
        x:"2019-1-11",
        y:7000
    },
    {
        x:"2019-1-12",
        y:6000
    },
];
const lastAttendanceData = [
    {
        x:"2019-1-1",
        y:2
    },
    {
        x:"2019-1-2",
        y:12
    },
    {
        x:"2019-1-6",
        y:6
    },
    {
        x:"2019-1-10",
        y:22
    },
    {
        x:"2019-1-11",
        y:23
    },
    {
        x:"2019-1-12",
        y:6
    },
];


const IntroduceRow = memo(({ loading, visitData }) => (
  <Row gutter={24}>
    {/*人数一览*/}
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        title="当前学生总数"
        loading={loading}
        total={() => 126560}
        footer={
          <Field
            label="2013年起就学人次达"
            value={`${numeral(10000).format('0,0')}`}
          />
        }
        contentHeight={46}
      >
        <span>
          白杨校区 2555
          东部校区 3000
        </span>
      </ChartCard>
    </Col>
    {/*2019年起消费数据一览*/}
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title='2019年消费总量'
        total={()=><Yuan>88846</Yuan>}
        footer={
          <Field
            label= '平均日消费'
            value={`￥${numeral(1234).format('0,0')}`}
          />
        }
        contentHeight={46}
      >
        <MiniArea color="#975FE4" data={lastConsumptionData} />
      </ChartCard>
    </Col>
    {/*2019年器违纪记录一览*/}
    <Col {...topColResponsiveProps}>
      <ChartCard
        bordered={false}
        loading={loading}
        title="2019年违纪记录"
        total={`${numeral(13).format('0,0')}次`}
        footer={
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
            <Row>
                <Col span={12}>
                    迟到早退 20次
                </Col>
                <Col span={12}>
                    校服违纪 36次
                </Col>
            </Row>
          </div>
        }
        contentHeight={46}
      >
        <MiniBar data={lastAttendanceData} />
      </ChartCard>
    </Col>
    <Col {...topColResponsiveProps}>
      <ChartCard
        loading={loading}
        bordered={false}
        title="todo 不知道要展示什么"
        action={
          <Tooltip
            title={<FormattedMessage id="app.analysis.introduce" defaultMessage="Introduce" />}
          >
            <Icon type="info-circle-o" />
          </Tooltip>
        }
        total="78%"
        footer={
          <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
            <Trend flag="up" style={{ marginRight: 16 }}>
              <FormattedMessage id="app.analysis.week" defaultMessage="Weekly Changes" />
              <span className={styles.trendText}>12%</span>
            </Trend>
            <Trend flag="down">
              <FormattedMessage id="app.analysis.day" defaultMessage="Weekly Changes" />
              <span className={styles.trendText}>11%</span>
            </Trend>
          </div>
        }
        contentHeight={46}
      >
        <MiniProgress
          percent={78}
          strokeWidth={8}
          target={80}
          targetLabel={`${formatMessage({ id: 'component.miniProgress.tooltipDefault' }).concat(
            ': '
          )}80%`}
          color="#13C2C2"
        />
      </ChartCard>
    </Col>
  </Row>
));

export default IntroduceRow;
