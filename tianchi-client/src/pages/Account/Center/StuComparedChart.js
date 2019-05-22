/**
 * Created by 胡晓慧 on 2019/4/14.
 */
import React, { Fragment, memo } from "react";
import { Card, Empty, Typography } from 'antd';
import { Axis, Chart, Coord, Geom, Legend, Tooltip } from "bizcharts";
import { TimelineChart } from '@/components/Charts';
import { HOUR_LIST } from '@/constants';
const { Paragraph, Text } = Typography;

const StuComparedChart = memo(
  ({ studentInfo, vsStudentInfo, comparedScoreData, hourlyVsCostData, vsDailyCostData, kaoqinVsData, colorMap, vsDailyAvg,dailyAvg }) => {
    const color = [
      "student",
      (student) => {
        return colorMap[student];
      }
    ];
    let advSubject=[];
    let vsAdvSubject = [];
    let equalSubject = [];
    if(comparedScoreData.length ===20){
      for (let i=0;i<20;i=i+2){
        if(comparedScoreData[i].average>comparedScoreData[i+1].average+1){
          advSubject.push(`${comparedScoreData[i].course} `)
        }
        else if(comparedScoreData[i].average+1<comparedScoreData[i+1].average){
          vsAdvSubject.push(`${comparedScoreData[i].course} `)
        }
        else{
          equalSubject.push(`${comparedScoreData[i].course} `)
        }
      }
    }
    let highHour=[];
    let vsHighHour = [];
    let equalHour = [];
    if(hourlyVsCostData.length ===48){
      for (let i=0;i<48;i=i+2){
        if(hourlyVsCostData[i].cost!==0 || hourlyVsCostData[i+1].cost!==0){
          if(hourlyVsCostData[i].cost >hourlyVsCostData[i+1].cost+1){
            highHour.push(`${hourlyVsCostData[i].hour}时 `)
          }
          else if(hourlyVsCostData[i].cost+1<hourlyVsCostData[i+1].cost){
            vsHighHour.push(`${hourlyVsCostData[i].hour}时 `)
          }
          else{
            equalHour.push(`${hourlyVsCostData[i].hour}时 `)
          }
        }

      }
    }
    let kaoqin = 0;
    let vsKaoqin = 0;
    for (let data of kaoqinVsData){
      if(data.type!=="离校"&&data.type!=="进校"){
        if(data.student.indexOf(studentInfo.id)=== -1){
          vsKaoqin=vsKaoqin+data.count
        }
        else {
          kaoqin = kaoqin+data.count
        }
      }
    }
    return <React.Fragment>
      {/*成绩对比*/}
      <Card title="平均成绩对比" bordered={false} style={{ width: '100%' }}>
        {comparedScoreData.length ? <Chart height={400} data={comparedScoreData} forceFit>
          <Legend/>
          <Coord transpose scale={[1, -1]}/>
          <Axis
            name="course"
            label={{
              offset: 12
            }}
          />
          <Axis name="average" position={"right"}/>
          <Tooltip/>
          <Geom
            type="interval"
            position="course*average"
            color={color}
            adjust={[
              {
                type: "dodge",
                marginRatio: 1 / 32
              }
            ]}
          />
        </Chart> : <Empty/>}
      </Card>
      {/*一卡通分析,消费时间和金额对比*/}
      <Card title="消费对比" bordered={false} style={{ width: '100%' }}>
        {/*平均消费时间的对比,图表*/}
        {vsDailyCostData.data.length ? <Fragment>
          <Chart
            height={400}
            data={hourlyVsCostData}
            scale={{
              hour: {
                type: "cat",
                values: HOUR_LIST
              }
            }}
            forceFit
          >
            <Legend position="bottom"/>
            <Axis name="hour"/>
            <Axis name="cost"/>
            <Tooltip
              crosshairs={{
                type: "y"
              }}
            />
            <Geom type="line" position="hour*cost" size={2} color={color}
                  tooltip={['hour*cost*student', (hour, cost, student) => {
                    return {
                      name: student + '平均消费',
                      value: cost + "元"
                    };
                  }]}/>
            <Geom
              type="point"
              position="hour*cost"
              size={4}
              shape={"circle"}
              color={color}
              style={{
                stroke: "#fff",
                lineWidth: 1
              }}
              tooltip={['hour*cost*student', (hour, cost, student) => {
                return {
                  name: student + '平均消费',
                  value: cost + "元"
                };
              }]}
            />
          </Chart>
          {/*各个时期总消费金额对比*/}
          <div style={{ padding: '0 24px' }}>
            <TimelineChart
              titleMap={vsDailyCostData.titleMap}
              height={300}
              data={vsDailyCostData.data}
            /></div>
        </Fragment> : <Empty/>}
      </Card>
      {/*考勤*/}
      <Card title="总考勤情况对比" bordered={false} style={{ width: '100%' }}>
        {kaoqinVsData && kaoqinVsData.length ? <Chart height={400} data={kaoqinVsData} forceFit>
          <Axis name="考勤类型"/>
          <Axis name="次数"/>
          <Legend position="bottom"/>
          <Tooltip
            crosshairs={{
              type: "y"
            }}
          />
          <Geom
            type="interval"
            position="type*count"
            color={color}
            adjust={[
              {
                type: "dodge",
                marginRatio: 1 / 32
              }
            ]}
            tooltip={['student*count', (student, count) => {
              return {
                name: student,
                value: count + "次"
              };
            }]}
          />
        </Chart> : <Empty description="两位同学暂无不良考勤数据"/>}
      </Card>
      {/*文字总结*/}
      <Card title="对比总结" bordered={false} style={{ width: '100%',paddingTop:0}}>
        {/*基本信息的对比，判断是否都是在校生*/}
        <Paragraph>{studentInfo.is_left === vsStudentInfo.is_left?
          <React.Fragment>{studentInfo.id}_{studentInfo.name}和{vsStudentInfo.id}_{vsStudentInfo.name}都是
            <Text type="danger">{vsStudentInfo.is_left?"离校生":"在校生"} </Text>，</React.Fragment>
          : <React.Fragment>{studentInfo.id}_{studentInfo.name}为<Text type="danger">{studentInfo.is_left?"离校生":"在校生"}</Text>，
            {vsStudentInfo.id}_{vsStudentInfo.name}为<Text type="danger">{vsStudentInfo.is_left?"离校生":"在校生"}</Text>，</React.Fragment>}
            {studentInfo.is_stay_school === vsStudentInfo.is_stay_school?
          <React.Fragment>且{studentInfo.id}_{studentInfo.name}和{vsStudentInfo.id}_{vsStudentInfo.name}都是
            <Text type="danger">{vsStudentInfo.is_stay_school?"住校生":"走读生"} </Text>。</React.Fragment>
          : <React.Fragment>其中{studentInfo.id}_{studentInfo.name}为<Text type="danger">{studentInfo.is_stay_school?"住校生":"走读生"}</Text>，
            {vsStudentInfo.id}_{vsStudentInfo.name}为<Text type="danger">{vsStudentInfo.is_stay_school?"住校生":"走读生"}</Text>。
          </React.Fragment>}</Paragraph>
        {/*成绩对比*/}
        {comparedScoreData.length===10?<Paragraph>仅有{comparedScoreData[0].student}的成绩数据</Paragraph>
          :!comparedScoreData.length?<Paragraph>两位同学暂无成绩信息</Paragraph>
            :<Paragraph>{advSubject.length?<React.Fragment>
              <Text type="danger">{studentInfo.id}_{studentInfo.name}</Text>的
              <Text type='danger'>{advSubject}</Text>平均成绩更好；</React.Fragment>:""}
              {vsAdvSubject.length?<React.Fragment>
                <Text type="danger">{vsStudentInfo.id}_{vsStudentInfo.name}</Text>在
                <Text type="danger">{vsAdvSubject}</Text>中更占优势；</React.Fragment>:""}
              {equalSubject.length?<React.Fragment>持平的科目有
                <Text type="danger">{equalSubject}</Text>；</React.Fragment>:""}</Paragraph>}
        {/*消费情况汇总*/}
        {hourlyVsCostData.length===24?<Paragraph>仅有{hourlyVsCostData[0].student}的消费数据</Paragraph>
          :!hourlyVsCostData.length?<Paragraph>两位同学暂无消费</Paragraph>
            :<Paragraph>{highHour.length?<React.Fragment>
              <Text type="danger">{studentInfo.id}_{studentInfo.name}</Text>在
              <Text type='danger'>{highHour}</Text>的平均消费水平更高，平均日消费为
              <Text type="danger">{dailyAvg}元</Text>；</React.Fragment>:""}
              {vsHighHour.length?<React.Fragment>
                <Text type="danger">{vsStudentInfo.id}_{vsStudentInfo.name}</Text>更倾向于在
                <Text type="danger">{vsHighHour}</Text>消费，平均日消费为
                <Text type="danger">{vsDailyAvg}元</Text>；</React.Fragment>:""}
              {equalHour.length?<React.Fragment>
                <Text type="danger">{equalHour}</Text>的消费相近；</React.Fragment>:""}
              {dailyAvg && vsDailyAvg?<React.Fragment>
                总体来说，<Text type="danger">{dailyAvg>vsDailyAvg?`${studentInfo.id}_${studentInfo.name}消费水平更高`
                :dailyAvg===vsDailyAvg?"两人消费水平持平"
                  :`${studentInfo.id}_${studentInfo.name}消费水平更高`}</Text></React.Fragment>:"" }
            </Paragraph>}
        {/* 违纪情况汇总*/}
        {kaoqinVsData.length?<Paragraph>就考勤情况来说，{studentInfo.id}_{studentInfo.name}共违纪{kaoqin}次，
          {vsStudentInfo.id}_{vsStudentInfo.name}共违纪{vsKaoqin}次，在遵守纪律方面
          {kaoqin>vsKaoqin?<Text type="danger">{vsStudentInfo.id}_{vsStudentInfo.name}更优秀</Text>
            :kaoqin===vsKaoqin? <Text type='danger'>二者情况相当</Text>
              :<Text type="danger">{studentInfo.id}_{studentInfo.name}更优秀</Text>}。
        </Paragraph>:""}

      </Card>
    </React.Fragment>;
  });

export default StuComparedChart;

