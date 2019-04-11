import React, { memo } from 'react';
import { Card, Input } from 'antd';
import styles from './Analysis.less';
import { Bar } from '@/components/Charts';
import { Axis, Chart, Geom, Tooltip } from "bizcharts";

const { Search } = Input;
const cols = {
  total_cost: {
    min: 0
  },
  // date: {
  //   range:
  // }
};
const DailyConsumptionCard = memo(
  ({ student, dailyConsumptionData, loading, handleStudentChange }) => (
    <React.Fragment>
      <Card className={styles.dailyCostCard} loading={loading} bordered={true} bodyStyle={{ padding: 0 }}>
        <Search
          className={styles.studentInput}
          placeholder="输入学生学号"
          enterButton="查询"
          size="large"
          onSearch={value => handleStudentChange(value)}
        />
        {student && <p className={styles.dailyCostTitle}>{`${student.id}-${student.name}日消费水平情况分析`}</p>}
        {dailyConsumptionData &&<Chart
          height={400}
          data={dailyConsumptionData.map(data => {
            data.total_cost = -data.total_cost;
            return data
          })}
          scale={cols}
          forceFit>
          <Axis name="日期" />
          <Axis name="花费" />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom type="line" position="date*total_cost" size={2} />
          <Geom
            type="point"
            position="date*total_cost"
            size={4}
            shape={"circle"}
            style={{
              stroke: "#fff",
              lineWidth: 1
            }}
          />
        </Chart>}
      </Card>
    </React.Fragment>

  )
);

export default DailyConsumptionCard;
