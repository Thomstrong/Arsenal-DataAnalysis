import React, { Fragment, memo } from "react";
import { Button, Card, Col, Empty, Icon, Row, Typography } from 'antd';
import { Axis, Chart, Geom, Legend, Tooltip } from "bizcharts";
import Link from 'umi/link';

const { Paragraph, Text } = Typography;

const ClassEcardChart = memo(
  ({ costData, costSummary, loading}) => (
    <Card
      loading={loading} bordered={false} style={{ width: '100%' }}
      title="各学生消费情况"
    >
      {costData.length ? <Row>
        <Col span={20}>
          <Chart height={400} data={costData}
             scale={{
              tickInterval: 20
              }} forceFit>
          <Axis name="stuName" />
          <Axis name="cost" />
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom type="interval" position="stuName*cost" />
        </Chart>
        </Col>
        <Col span={4}>
          <Paragraph>
            在消费信息记录中,该班级共有<Text type='danger'>{costData.length}
          </Text>名同学产生消费记录，班级平均日消费为<Text type="danger">{costSummary.classAvgCost}元</Text>。
          </Paragraph>
          {costSummary.lowCostData.length?
            <Paragraph>其中，{costSummary.lowCostData.map((data)=>{
              if(data.stuId !== costSummary.lowCostData[costSummary.lowCostData.length-1].stuId){
                return <React.Fragment><Link to={`/student/center/?studentId=${data.stuId}`}>
                      {`${data.stuId}_${data.stuName}(${data.rank*100}%)、`}
              </Link></React.Fragment>
              }
              return <React.Fragment><Link to={`/student/center/?studentId=${data.stuId}`}>
                      {`${data.stuId}_${data.stuName}(${data.rank*100}%)`}
              </Link></React.Fragment>
          })}的消费较平均水平低，不到全校消费水平的20%。</Paragraph>
            :<Paragraph>暂无学生消费水平低于全校消费水平的20%。</Paragraph>}
        </Col>
      </Row> : <Empty description='该班级暂无消费数据'/>}
    </Card>
  )
);


export default ClassEcardChart;