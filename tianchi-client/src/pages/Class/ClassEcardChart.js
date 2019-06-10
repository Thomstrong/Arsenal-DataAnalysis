import React, { Fragment, memo } from "react";
import { Card, Col, Empty, Row, Typography } from 'antd';
import { Axis, Chart, Geom, Tooltip } from "bizcharts";
import Link from 'umi/link';

const { Paragraph, Text } = Typography;

const getUrl = (id) => `/student/center/ECard/?studentId=${id}`;

const getStuText = (student) => `${student.name}(${(student.rank * 100).toFixed(2)}%)`;

const renderLowCosts = (lowCost) => {
  const noStayStudents = lowCost[0];
  const noStayRecords = noStayStudents.map((student) => {
    let stuText = <Link to={getUrl(student.id)}>{getStuText(student)}</Link>;
    if (student.id !== noStayStudents[noStayStudents.length - 1].id) {
      stuText = <Fragment>{stuText}、</Fragment>;
    }
    return stuText;
  });

  const stayStudents = lowCost[1];
  const stayRecords = stayStudents.map((student) => {
    let stuText = <Link to={getUrl(student.id)}>{getStuText(student)}</Link>;
    if (student.id !== stayStudents[stayStudents.length - 1].id) {
      stuText = <Fragment>{stuText}、</Fragment>;
    }
    return stuText;
  });

  return <Fragment>
    {!!stayRecords.length && <span>
      住校生: {stayRecords}，消费水平低于在校住校生总体水平的15%；
    </span>}
    {!!noStayRecords.length && <span>
      走读生: {noStayRecords}，消费水平低于在校走读生总体水平的20%。
    </span>}
  </Fragment>;
};

const ClassEcardChart = memo(
  ({ costData, costSummary, loading }) => {
    return <Card
      loading={loading} bordered={false} style={{ width: '100%' }}
      title="各学生消费情况"
    >
      {costData.length ? <Row>
        <Col span={22}>
          <Chart
            height={400} data={costData}
            scale={{
              'name': {
                tickCount: 14
              }
            }}
            forceFit
          >
            <Axis name="name"/>
            <Axis name="avg"/>
            <Tooltip/>
            <Geom type="interval" position="name*avg" tooltip={[
              "avg",
              (avg) => {
                return {
                  name: "日均消费",
                  value: avg + "元"
                };
              }
            ]}
            />
          </Chart>
        </Col>
        <Col span={21} offset={2}>
          <Paragraph>
            <ul>
              <li>
                在消费信息记录中，该班级共有<Text type='danger'>{costData.length}名
              </Text>同学产生消费记录，班级平均日消费为<Text type="danger">{costSummary.classAvgCost}元</Text>。
              </li>
              <li>
                {!costSummary.lowCostData.length ? `暂无学生消费水平低于全校消费水平的20%。` :
                  <Fragment>
                    其中，{renderLowCosts(costSummary.lowCostData)}
                  </Fragment>}
              </li>
            </ul>
          </Paragraph>
        </Col>
      </Row> : <Empty description='该班级暂无消费数据'/>}
    </Card>;
  }
);


export default ClassEcardChart;
