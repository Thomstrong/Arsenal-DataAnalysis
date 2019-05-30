import React, { memo } from 'react';
import { Col, Row } from 'antd';
import { ChartCard, Field, MiniArea, MiniBar, MiniProgress } from '@/components/Charts';
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

const IntroduceRow = memo(({ loading, data, year }) => {
    const {
      campusData, totalStudentCount, totalStayCount, totalStudentInDb, dailyAvgCost,
      yearCostData, totalYearCost, kaoqinSummaryData, totalKaoqinCount
    } = data;
    return <Row gutter={24}>
      {/*人数一览*/}
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          title="在校生总数"
          loading={loading}
          total={`${numeral(totalStudentCount).format('0,0')}`}
          footer={
            <Field
              label="2013年起就学人次达"
              value={`${numeral(totalStudentInDb).format('0,0')}`}
            />
          }
          contentHeight={46}
        >
          {campusData.map((data) => <span key={`${data.campus}-count`} style={{ marginRight: '10px' }}>
            {`${data.campus} ${`${numeral(data.count).format('0,0')}`}`}
            </span>)}
        </ChartCard>
      </Col>
      {/*住校人数*/}
      <Col {...topColResponsiveProps}>
        <ChartCard
          loading={loading}
          bordered={false}
          title="住校生占比"
          total={`${(totalStayCount / totalStudentCount * 100).toFixed(2)}%`}
          footer={
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
              <Row>
                <Col span={12}>
                  走读生 {numeral(totalStudentCount - totalStayCount).format('0,0')}
                </Col>
                <Col span={12}>
                  住校生 {numeral(totalStayCount).format('0,0')}
                </Col>
              </Row>
            </div>
          }
          contentHeight={47}
        >
          <MiniProgress
            percent={42}
            strokeWidth={8}
            target={50}
            color="#13C2C2"
          />
        </ChartCard>
      </Col>
      {/*2019年起消费数据一览*/}
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title={`2018-2019学年消费总额`}
          total={() => <Yuan>{totalYearCost}</Yuan>}
          footer={
            <Field
              label='日平均消费额'
              value={`￥${numeral(dailyAvgCost).format('0,0.00')}`}
            />
          }
          contentHeight={46}
        >
          <MiniArea color="#975FE4" data={yearCostData}/>
        </ChartCard>
      </Col>
      {/*2019年器违纪记录一览*/}
      <Col {...topColResponsiveProps}>
        <ChartCard
          bordered={false}
          loading={loading}
          title={`${year}年违纪记录`}
          total={`${numeral(totalKaoqinCount).format('0,0')}次`}
          footer={
            <div style={{ whiteSpace: 'nowrap', overflow: 'hidden' }}>
              <Row>
                <Col span={8} style={{ fontSize: '.8em', margin: '2px 0' }}>
                  迟到{kaoqinSummaryData[0] ? kaoqinSummaryData[0].y : 0}次
                </Col>
                <Col span={6} style={{ fontSize: '.8em', margin: '2px 0' }}>
                   早退0次
                </Col>
                <Col span={8} style={{ fontSize: '.8em', margin: '2px 0' }}>
                  校服违纪{kaoqinSummaryData[1] ? kaoqinSummaryData[1].y : 0}次
                </Col>
              </Row>
            </div>
          }
          contentHeight={46}
        >
          <MiniBar data={kaoqinSummaryData}/>
        </ChartCard>
      </Col>
    </Row>;
  }
);

export default IntroduceRow;
