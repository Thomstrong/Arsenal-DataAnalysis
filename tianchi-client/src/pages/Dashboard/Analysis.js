import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import { Row, Col, Icon, Menu, Dropdown } from 'antd';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getTimeDistance } from '@/utils/utils';
import styles from './Analysis.less';
import PageLoading from '@/components/PageLoading';

const IntroduceRow = React.lazy(() => import('./IntroduceRow'));
const SalesCard = React.lazy(() => import('./SalesCard'));
const DailyConsumptionCard = React.lazy(() => import('./DailyConsumptionCard'));
const TopSearch = React.lazy(() => import('./TopSearch'));
const ProportionSales = React.lazy(() => import('./ProportionSales'));
const OfflineData = React.lazy(() => import('./OfflineData'));
const LocationMap = React.lazy(() => import('./LocationMap'));
const EcardConsumptionCard = React.lazy(() => import('./EcardConsumptionCard'));
const AttendanceCard = React.lazy(() => import('./AttendanceCard'));

@connect(({ chart, loading }) => ({
  chart,
  loading: loading.effects['chart/fetch'],
}))
class Analysis extends Component {
  state = {
    studentType: 'homeland',
    sexType:'grade',
  };


  handleChangeSexType = e => {
    this.setState({
      sexType: e.target.value,
    });
  };

  handleChangeStudentType = e => {
    this.setState({
      studentType: e.target.value,
    });
  };




  render() {
    const { sexType, studentType } = this.state;
    const { chart, loading } = this.props;
    const {
      visitData,
    } = chart;

    //student表示人员分布的图表
    const studentHomeData=[
      {
        x: '事例一',
        y: 40
      },
      {
        x: '事例二',
        y: 21
      },
      {
        x: '事例三',
        y: 17
      },
      {
        x: '事例四',
        y: 13
      },
      {
        x: '事例五',
        y: 9
      }
    ];
    const studentNationData=[
      {
        x: '事例一',
        y: 40
      },
      {
        x: '事例二',
        y: 21
      },
      {
        x: '事例三',
        y: 17
      },
      {
        x: '事例四',
        y: 13
      },
      {
        x: '事例五',
        y: 9
      }
    ];
    const studentStateData=[
      {
        x: '事例一',
        y: 40
      },
      {
        x: '事例二',
        y: 21
      },
      {
        x: '事例三',
        y: 17
      },
      {
        x: '事例四',
        y: 13
      },
      {
        x: '事例五',
        y: 9
      }
    ];
    let studentPieData;
    if (studentType === 'homeland') {
      studentPieData = studentHomeData;
    } else {
      studentPieData = studentType === 'nation' ? studentNationData : studentStateData;
    }
    //sex表示性别分布的图表
    let sexPieData;
    const sexGradedata = [
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
    const sexLeavedata = [
  {
    value: 251,
    type: '走读',
    name: '走读男生',
  },
  {
    value: 1048,
    type: '走读',
    name: '走读女生',
  },
  {
    value: 610,
    type: '住校',
    name: '住校男生',
  },
  {
    value: 434,
    type: '住校',
    name: '住校女生',
  }
];
    if (sexType === 'grade') {
      sexPieData = sexGradedata;
    } else {
      sexPieData = sexLeavedata;
    }

    return (
      <GridContent>
        <Suspense fallback={<PageLoading/>}>
          <IntroduceRow loading={loading} visitData={visitData}/>
        </Suspense>
        <Suspense fallback={null}>
          <LocationMap
            studentType={studentType}
            sexType={sexType}
            studentPieData={studentPieData}
            sexPieData={sexPieData}
            handleChangeSexType={this.handleChangeSexType}
            handleChangeStudentType={this.handleChangeStudentType}

          />
        </Suspense>
        <Suspense fallback={null}>
          <EcardConsumptionCard/>
        </Suspense>
        <Suspense fallback={null}>
          <AttendanceCard/>
        </Suspense>

      </GridContent>
    );
  }
}

export default Analysis;
