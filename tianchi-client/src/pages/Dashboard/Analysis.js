import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getTimeDistance } from '@/utils/utils';
import PageLoading from '@/components/PageLoading';
import DataSet from "@antv/data-set/build/data-set";

const IntroduceRow = React.lazy(() => import('./IntroduceRow'));
const LocationMap = React.lazy(() => import('./LocationMap'));
const EcardConsumptionCard = React.lazy(() => import('./EcardConsumptionCard'));
const AttendanceCard = React.lazy(() => import('./AttendanceCard'));

@connect(({ loading, dashboard, global }) => ({
  dashboard,
  totalHourlyAvgCost: global.totalHourlyAvgCost,
  loading: loading.effects['dashboard/fetchCampusSummary'],
  sexHourlyLoading: loading.effects['dashboard/fetchSexHourlyCostSummary']
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
    const { dispatch, totalHourlyAvgCost } = this.props;
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
    dispatch({
      type: 'dashboard/fetchEnterSchoolSummary',
    });
    dispatch({
      type: 'dashboard/fetchSexHourlyCostSummary',
    });
    dispatch({
      type: 'dashboard/fetchStayCostSummary',
    });
    dispatch({
      type: 'dashboard/fetchGradeCostSummary',
    });
    if (!totalHourlyAvgCost || !totalHourlyAvgCost.length) {
      dispatch({
        type: 'global/fetchTotalHourlyAvgCost',
      });
    }
  }

  render() {
    const { sexType, studentType } = this.state;
    const { loading, dashboard, totalHourlyAvgCost, sexHourlyLoading } = this.props;

    const {
      campusData, totalStudentCount, stayData,
      totalStayCount, gradeData, nationData,
      nativePlaceData, policyData,
      yearCostData, totalYearCost, dailyAvgCost,
      kaoqinSummaryData, totalKaoqinCount,
      sexHourlyCostData,gradeCostData,stayCostData,
      enterSchoolData
    } = dashboard;
    const sexHourlyData = sexHourlyCostData.concat(totalHourlyAvgCost.map(data => {
      return {
        hour: data.hour,
        cost: Number(data.total_avg.toFixed(2)),
        sex: '整体'
      };
    }));
    const stayHourlyData = stayCostData.concat(totalHourlyAvgCost.map(data => {
      return {
        hour: data.hour,
        cost: Number(data.total_avg.toFixed(2)),
        stayType: '整体'
      };
    }));

    const gradeHourlyData = gradeCostData.concat(totalHourlyAvgCost.map(data => {
      return {
        hour: data.hour,
        cost: Number(data.total_avg.toFixed(2)),
        grade: '整体'
      };
    }));
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
              dailyAvgCost,
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
              sexPieData,
            }}
            handleChangeSexType={this.handleChangeSexType}
            handleChangeStudentType={this.handleChangeStudentType}

          />
        </Suspense>
        <Suspense fallback={null}>
          <EcardConsumptionCard
            data={{
              sexHourlyData,
              sexHourlyLoading,
              gradeHourlyData,
              stayHourlyData,
              yearCostData
            }}
          />
        </Suspense>
        <Suspense fallback={null}>
          <AttendanceCard data={{
            enterSchoolData
          }}/>
        </Suspense>

      </GridContent>
    );
  }
}

export default Analysis;
