import React, { Component, Suspense } from 'react';
import { connect } from 'dva';
import GridContent from '@/components/PageHeaderWrapper/GridContent';
import { getTimeDistance } from '@/utils/utils';
import PageLoading from '@/components/PageLoading';
import DataSet from "@antv/data-set";

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

  // shit code...
  addZeroForTotalAvg = (costData) => {
    let i = 0;
    const len = costData.length;
    if (!len) {
      return;
    }
    const template = {
      ...costData[0],
      total_avg: 0,
    };
    for (let hour = 0; hour < 24 && i < len; hour++) {
      if (costData[i].hour === hour) {
        i += 1;
        continue;
      }
      costData.push({
        ...template,
        hour
      });
    }
  };

  addZeroForTwoFieldData = (costData, fieldName, biFilds) => {
    const partitionData = new DataSet.View().source(costData).transform({
      type: 'partition',
      groupBy: ['hour'],
    }).rows;

    for (let hour = 0; hour < 24; hour++) {
      if (partitionData[`_${hour}`]) {
        if (hour === 5 && fieldName === 'stayType') {
          costData.push({
            cost: 0,
            hour: hour,
            [fieldName]: '走读',
          });
        }
        continue;
      }
      costData.push({
        cost: 0,
        hour: hour,
        [fieldName]: biFilds[0],
      });
      costData.push({
        cost: 0,
        hour: hour,
        [fieldName]: biFilds[1],
      });
    }
  };

  addZeroForGradeData = (costData) => {
    const partitionData = new DataSet.View().source(costData).transform({
      type: 'partition',
      groupBy: ['hour'],
    }).rows;

    for (let hour = 0; hour < 24; hour++) {
      if (partitionData[`_${hour}`]) {
        if (hour === 5) {
          costData.push({
            cost: 0,
            hour: hour,
            grade: '高二',
          });
          costData.push({
            cost: 0,
            hour: hour,
            grade: '高三',
          });
        }
        continue;
      }
      costData.push({
        cost: 0,
        hour: hour,
        grade: '高一',
      });
      costData.push({
        cost: 0,
        hour: hour,
        grade: '高二',
      });
      costData.push({
        cost: 0,
        hour: hour,
        grade: '高三',
      });
    }
  };


  render() {
    const { sexType, studentType } = this.state;
    const { loading, dashboard, totalHourlyAvgCost, sexHourlyLoading } = this.props;

    const {
      campusData, totalStudentCount, stayData,
      totalStayCount, gradeData, nationData,
      nativePlaceData, policyData,
      yearCostData, totalYearCost, dailyAvgCost,
      kaoqinSummaryData, totalKaoqinCount,
      sexHourlyCostData, sexHourlyCountData,
      gradeCostData, gradeCostCountData,
      stayCostData, stayCountData, enterSchoolData, kaoqinMixedData
    } = dashboard;
    this.addZeroForTotalAvg(totalHourlyAvgCost);
    this.addZeroForTwoFieldData(sexHourlyCostData, 'sex', ['男生', '女生']);
    this.addZeroForTwoFieldData(stayCostData, 'stayType', ['走读', '住校']);
    this.addZeroForGradeData(gradeCostData);
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
