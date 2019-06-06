import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getTimeDistance } from '@/utils/utils';
import PageLoading from '@/components/PageLoading';
import { BackTop } from "antd";

const IntroduceRow = React.lazy(() => import('./IntroduceRow'));
const LocationMap = React.lazy(() => import('./LocationMap'));
const EcardConsumptionCard = React.lazy(() => import('./EcardConsumptionCard'));
const AttendanceCard = React.lazy(() => import('./AttendanceCard'));

@connect(({ loading, dashboard, global }) => ({
  dashboard,
  hasInit: dashboard.hasInit,
  totalHourlyAvgCost: global.totalHourlyAvgCost,
  introLoading: loading.effects['dashboard/fetchYearCostSummary'],
  sexDistriLoading: loading.effects['dashboard/fetchGradeSummary'] && loading.effects['dashboard/fetchStaySummary'],
  locationLoading: (loading.effects['dashboard/fetchNativePlaceSummary'] &&
    loading.effects['dashboard/fetchNationSummary'] &&
    loading.effects['dashboard/fetchPolicySummary']),
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
    const { dispatch, totalHourlyAvgCost, hasInit } = this.props;
    if (hasInit) {
      return;
    }
    // introducd row
    dispatch({
      type: 'dashboard/fetchCampusSummary',
    });
    dispatch({
      type: 'dashboard/fetchStaySummary',
    });
    dispatch({
      type: 'dashboard/fetchTeacherSummary',
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
      type: 'dashboard/fetchKaoqinMixedSum',
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
    const {
      introLoading, sexDistriLoading, locationLoading,
      dashboard, totalHourlyAvgCost, sexHourlyLoading
    } = this.props;

    const {
      campusData, totalStudentCount, stayData,
      totalStayCount, totalStudentInDb, gradeData, nationData,
      nativePlaceData, policyData,
      yearCostData, totalYearCost, dailyAvgCost,
      kaoqinSummaryData, totalKaoqinCount,
      sexHourlyCostData, sexHourlyCountData,
      gradeCostData, gradeCostCountData, teacherData, totalTeacherCount,
      stayCostData, stayCountData, enterSchoolData, kaoqinMixedData,
    } = dashboard;

    console.log(teacherData, totalTeacherCount)
    const sexHourlyData = totalHourlyAvgCost ? sexHourlyCostData.concat(totalHourlyAvgCost.map(data => {
      return {
        hour: data.hour,
        cost: Number(data.total_avg.toFixed(2)),
        sex: '整体'
      };
    })) : sexHourlyCostData;
    const stayHourlyData = totalHourlyAvgCost ? stayCostData.concat(totalHourlyAvgCost.map(data => {
      return {
        hour: data.hour,
        cost: Number(data.total_avg.toFixed(2)),
        stayType: '整体'
      };
    })) : stayCostData;

    const gradeHourlyData = totalHourlyAvgCost ? gradeCostData.concat(totalHourlyAvgCost.map(data => {
      return {
        hour: data.hour,
        cost: Number(data.total_avg.toFixed(2)),
        grade: '整体'
      };
    })) : gradeCostData;
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
        <BackTop/>
        <Suspense fallback={<PageLoading/>}>
          <IntroduceRow
            loading={introLoading}
            year={this.state.year}
            data={{
              campusData,
              totalStudentCount,
              totalStayCount,
              totalStudentInDb,
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
              sexDistriLoading,
              locationLoading,
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
              sexHourlyCountData,
              sexHourlyLoading,
              gradeHourlyData,
              gradeCostCountData,
              stayHourlyData,
              stayCountData,
              yearCostData
            }}
          />
        </Suspense>
        <Suspense fallback={null}>
          <AttendanceCard data={{
            enterSchoolData, kaoqinMixedData
          }}/>
        </Suspense>
      </GridContent>
    );
  }
}

export default Analysis;
