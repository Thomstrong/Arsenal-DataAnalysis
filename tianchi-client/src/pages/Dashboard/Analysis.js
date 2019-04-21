import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getTimeDistance } from '@/utils/utils';
import PageLoading from '@/components/PageLoading';

const IntroduceRow = React.lazy(() => import('./IntroduceRow'));
const LocationMap = React.lazy(() => import('./LocationMap'));
const EcardConsumptionCard = React.lazy(() => import('./EcardConsumptionCard'));
const AttendanceCard = React.lazy(() => import('./AttendanceCard'));

@connect(({ loading, dashboard }) => ({
  dashboard,
  loading: loading.effects['dashboard/fetchCampusSummary'],
}))
class Analysis extends Component {
  state = {
    studentType: 'nativePlace',
    sexType: 'grade',
    year: 2019
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

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'dashboard/fetchCampusSummary',
    });
    dispatch({
      type: 'dashboard/fetchStaySummary',
    });
    dispatch({
      type: 'dashboard/fetchGradeSummary',
    });
    dispatch({
      type: 'dashboard/fetchNativePlaceSummary',
    });
    dispatch({
      type: 'dashboard/fetchNationSummary',
    });
    dispatch({
      type: 'dashboard/fetchPolicySummary',
    });
    dispatch({
      type: 'dashboard/fetchYearCostSummary',
      payload: {
        year: this.state.year
      }
    });
    dispatch({
      type: 'dashboard/fetchKaoqinSummary',
      payload: {
        year: this.state.year
      }
    });
  }


  render() {
    const { sexType, studentType } = this.state;
    const { loading, dashboard } = this.props;

    const {
      campusData, totalStudentCount, stayData,
      totalStayCount, gradeData, nationData,
      nativePlaceData, policyData, yearCostData, totalYearCost,
      kaoqinSummaryData, totalKaoqinCount,
    } = dashboard;
    //student表示人员分布的图表
    let studentPieData = [];

    if (studentType === 'nativePlace') {
      studentPieData = nativePlaceData;
    }
    if (studentType === 'nation') {
      studentPieData = nationData;
    }
    if (studentType === 'policy') {
      studentPieData = policyData;
    }
    //sex表示性别分布的图表
    let sexPieData;
    if (sexType === 'grade') {
      sexPieData = gradeData;
    } else {
      sexPieData = stayData;
    }

    return (
      <GridContent>
        <Suspense fallback={<PageLoading/>}>
          <IntroduceRow
            loading={loading}
            year={this.state.year}
            data={{
              campusData,
              totalStudentCount,
              totalStayCount,
              yearCostData,
              totalYearCost,
              kaoqinSummaryData,
              totalKaoqinCount
            }}/>
        </Suspense>
        <Suspense fallback={null}>
          <LocationMap
            studentType={studentType}
            sexType={sexType}
            data={{
              totalStudentCount,
              studentPieData,
              sexPieData
            }}
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
