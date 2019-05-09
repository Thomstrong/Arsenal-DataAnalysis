export default [
  {
    path: '/',
    component: '../layouts/BasicLayout',
    routes: [
      // dashboard
      { path: '/', redirect: '/dashboard/analysis' },
      {
        path: '/dashboard',
        name: 'dashboard',
        icon: 'dashboard',
        routes: [
          {
            path: '/dashboard/analysis',
            name: 'analysis',
            component: './Dashboard/Analysis',
          },
        ],
      },
      {
        name: 'studentInfo',
        icon: 'user',
        path: '/student',
        routes: [
          {
            path: '/student/center',
            name: 'center',
            component: './Account/Center/Center',
            routes: [
              {
                path: '/student/center',
                redirect: '/student/center/Score',
              },
              {
                path: '/student/center/Score',
              },
              {
                path: '/student/center/ECard',
              },
              {
                path: '/student/center/Attendance',
              },
              {
                path: '/student/center/Compare',
              },
            ],
          },
        ],
      },
      {
        name: 'class',
        icon: 'team',
        path: '/class',
        routes: [
          {
            path: '/class/analysis',
            name: 'analysis',
            component: './Class/ClassAnalysis',
            routes: [
              { path: '/class/analysis/Trend' },
              { path: '/class/analysis/Specific' },
              { path: '/class/analysis/Attendance' },
            ]
          },
        ],
      },
      {
        name: 'courseAnalysis',
        icon: 'book',
        path: '/course',
        routes: [
          {
            path: '/course/subject',
            name: 'subject',
            component: './Course/Subject/Subject',
          },
          {
            path: '/course/selection',
            name: 'elective',
            component: './Course/Selection/Selection',
          },
          {
            path: '/course/collageExam',
            name: 'collageExam',
            component: './Course/CollageExam/CollageExam',
          },
        ],
      },
      {
        component: '404',
      },
    ],
  },
];
