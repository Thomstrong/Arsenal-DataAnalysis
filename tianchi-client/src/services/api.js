import { stringify } from 'qs';
import request from '@/utils/request';

// student
export async function getStudentBasic(studentId) {
  return request(`/api/students/${studentId}/`);
}

export async function getGrade({ studentId, type, scoreType }) {
  return request(`/api/students/${studentId}/grade/?type=${type}&score_type=${scoreType || ''}`);
}

export async function getStudentTeachers(studentId) {
  return request(`/api/students/${studentId}/teachers/`);
}

export async function getStudentList(query) {
  return request(`/api/students/?query=${query}`);
}

export async function getKaoqinData(studentId) {
  return request(`/api/students/${studentId}/kaoqin/`);
}

export async function getConsumption({ studentId, date, type, dateRange }) {
  return request(`/api/students/${studentId}/consumptions/?date=${date || ''}&type=${type}&date_range=${dateRange || ''}`);
}

// dashboard
export async function getStudentSummary({ base }) {
  return request(`/api/students/summary/?base=${base}`);
}

export async function getCostSummary({ base, year }) {
  return request(`/api/consumption/summary/?base=${base}&year=${year || ''}`);
}

export async function getKaoqinSummary({ base, year }) {
  return request(`/api/kaoqin_record/summary/?base=${base}&year=${year || ''}`);
}


// global
export async function getTotalHourlyAvgCost() {
  return request(`/api/consumption/hourly_avg/`);
}

export async function getTermMap() {
  return request(`/api/terms/`);
}

// course
export async function getCourseSelectionDistribution() {
  return request(`/api/course_record/distribution/?type=selection`);
}

export async function getCoursePercent(year) {
  return request(`/api/course_record/distribution/?type=course_percent&year=${year}`);
}

// useless
export async function queryProjectNotice() {
  return request('/api/project/notice');
}

export async function queryActivities() {
  return request('/api/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    data: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params = {}) {
  return request(`/api/rule?${stringify(params.query)}`, {
    method: 'POST',
    data: {
      ...params.body,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    data: params,
  });
}

export async function fetchDailySumData(studentId) {
  return request(`/api/consumption/daily_sum/?student_id=${studentId}`);
}

export async function fakeChartData() {
  return request(`/api/fake_chart_data`);
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile(id) {
  return request(`/api/profile/basic?id=${id}`);
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    data: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    data: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    data: params,
  });
}

export async function queryNotices(params = {}) {
  return request(`/api/notices?${stringify(params)}`);
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}
