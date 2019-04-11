import React from 'react';
import { Router as DefaultRouter, Route, Switch } from 'react-router-dom';
import dynamic from 'umi/dynamic';
import renderRoutes from 'umi/_renderRoutes';
import RendererWrapper0 from '/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/.umi/LocaleWrapper.jsx'
import _dvaDynamic from 'dva/dynamic'

let Router = require('dva/router').routerRedux.ConnectedRouter;

let routes = [
  {
    "path": "/",
    "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "layouts__BasicLayout" */'../../layouts/BasicLayout'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
    "routes": [
      {
        "path": "/",
        "redirect": "/dashboard/analysis",
        "exact": true
      },
      {
        "path": "/dashboard",
        "name": "dashboard",
        "icon": "dashboard",
        "routes": [
          {
            "path": "/dashboard/analysis",
            "name": "analysis",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Dashboard__models__activities.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Dashboard/models/activities.js').then(m => { return { namespace: 'activities',...m.default}}),
  import(/* webpackChunkName: 'p__Dashboard__models__chart.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Dashboard/models/chart.js').then(m => { return { namespace: 'chart',...m.default}}),
  import(/* webpackChunkName: 'p__Dashboard__models__monitor.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Dashboard/models/monitor.js').then(m => { return { namespace: 'monitor',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Dashboard__Analysis" */'../Dashboard/Analysis'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/dashboard/monitor",
            "name": "monitor",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Dashboard__models__activities.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Dashboard/models/activities.js').then(m => { return { namespace: 'activities',...m.default}}),
  import(/* webpackChunkName: 'p__Dashboard__models__chart.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Dashboard/models/chart.js').then(m => { return { namespace: 'chart',...m.default}}),
  import(/* webpackChunkName: 'p__Dashboard__models__monitor.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Dashboard/models/monitor.js').then(m => { return { namespace: 'monitor',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Dashboard__Monitor" */'../Dashboard/Monitor'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/dashboard/workplace",
            "name": "workplace",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Dashboard__models__activities.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Dashboard/models/activities.js').then(m => { return { namespace: 'activities',...m.default}}),
  import(/* webpackChunkName: 'p__Dashboard__models__chart.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Dashboard/models/chart.js').then(m => { return { namespace: 'chart',...m.default}}),
  import(/* webpackChunkName: 'p__Dashboard__models__monitor.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Dashboard/models/monitor.js').then(m => { return { namespace: 'monitor',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Dashboard__Workplace" */'../Dashboard/Workplace'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/form",
        "icon": "form",
        "name": "form",
        "routes": [
          {
            "path": "/form/basic-form",
            "name": "basicform",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Forms__models__form.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Forms/models/form.js').then(m => { return { namespace: 'form',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Forms__BasicForm" */'../Forms/BasicForm'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/form/step-form",
            "name": "stepform",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Forms__models__form.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Forms/models/form.js').then(m => { return { namespace: 'form',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Forms__StepForm" */'../Forms/StepForm'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
            "hideChildrenInMenu": true,
            "routes": [
              {
                "path": "/form/step-form",
                "redirect": "/form/step-form/info",
                "exact": true
              },
              {
                "path": "/form/step-form/info",
                "name": "info",
                "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Forms__models__form.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Forms/models/form.js').then(m => { return { namespace: 'form',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Forms__StepForm" */'../Forms/StepForm/Step1'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
                "exact": true
              },
              {
                "path": "/form/step-form/confirm",
                "name": "confirm",
                "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Forms__models__form.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Forms/models/form.js').then(m => { return { namespace: 'form',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Forms__StepForm" */'../Forms/StepForm/Step2'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
                "exact": true
              },
              {
                "path": "/form/step-form/result",
                "name": "result",
                "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Forms__models__form.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Forms/models/form.js').then(m => { return { namespace: 'form',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Forms__StepForm" */'../Forms/StepForm/Step3'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
                "exact": true
              },
              {
                "component": () => React.createElement(require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
              }
            ]
          },
          {
            "path": "/form/advanced-form",
            "name": "advancedform",
            "authority": [
              "admin"
            ],
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Forms__models__form.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Forms/models/form.js').then(m => { return { namespace: 'form',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Forms__AdvancedForm" */'../Forms/AdvancedForm'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/list",
        "icon": "table",
        "name": "list",
        "routes": [
          {
            "path": "/list/table-list",
            "name": "searchtable",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__List__models__rule.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/List/models/rule.js').then(m => { return { namespace: 'rule',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__List__TableList" */'../List/TableList'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/list/basic-list",
            "name": "basiclist",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__List__models__rule.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/List/models/rule.js').then(m => { return { namespace: 'rule',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__List__BasicList" */'../List/BasicList'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/list/card-list",
            "name": "cardlist",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__List__models__rule.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/List/models/rule.js').then(m => { return { namespace: 'rule',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__List__CardList" */'../List/CardList'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/list/search",
            "name": "searchlist",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__List__models__rule.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/List/models/rule.js').then(m => { return { namespace: 'rule',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__List__List" */'../List/List'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
            "routes": [
              {
                "path": "/list/search",
                "redirect": "/list/search/articles",
                "exact": true
              },
              {
                "path": "/list/search/articles",
                "name": "articles",
                "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__List__models__rule.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/List/models/rule.js').then(m => { return { namespace: 'rule',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__List__List" */'../List/Articles'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
                "exact": true
              },
              {
                "path": "/list/search/projects",
                "name": "projects",
                "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__List__models__rule.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/List/models/rule.js').then(m => { return { namespace: 'rule',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__List__List" */'../List/Projects'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
                "exact": true
              },
              {
                "path": "/list/search/applications",
                "name": "applications",
                "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__List__models__rule.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/List/models/rule.js').then(m => { return { namespace: 'rule',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__List__List" */'../List/Applications'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
                "exact": true
              },
              {
                "component": () => React.createElement(require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
              }
            ]
          },
          {
            "component": () => React.createElement(require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "path": "/profile",
        "name": "profile",
        "icon": "profile",
        "routes": [
          {
            "path": "/profile/basic",
            "name": "basic",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Profile__models__profile.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Profile/models/profile.js').then(m => { return { namespace: 'profile',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Profile__BasicProfile" */'../Profile/BasicProfile'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/profile/basic/:id",
            "name": "basic",
            "hideInMenu": true,
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Profile__models__profile.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Profile/models/profile.js').then(m => { return { namespace: 'profile',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Profile__BasicProfile" */'../Profile/BasicProfile'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/profile/advanced",
            "name": "advanced",
            "authority": [
              "admin"
            ],
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Profile__models__profile.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Profile/models/profile.js').then(m => { return { namespace: 'profile',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Profile__AdvancedProfile" */'../Profile/AdvancedProfile'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "name": "result",
        "icon": "check-circle-o",
        "path": "/result",
        "routes": [
          {
            "path": "/result/success",
            "name": "success",
            "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "p__Result__Success" */'../Result/Success'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/result/fail",
            "name": "fail",
            "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "p__Result__Error" */'../Result/Error'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "name": "exception",
        "icon": "warning",
        "path": "/exception",
        "routes": [
          {
            "path": "/exception/403",
            "name": "not-permission",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Exception__models__error.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Exception/models/error.js').then(m => { return { namespace: 'error',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Exception__403" */'../Exception/403'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/exception/404",
            "name": "not-find",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Exception__models__error.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Exception/models/error.js').then(m => { return { namespace: 'error',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Exception__404" */'../Exception/404'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/exception/500",
            "name": "server-error",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Exception__models__error.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Exception/models/error.js').then(m => { return { namespace: 'error',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Exception__500" */'../Exception/500'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/exception/trigger",
            "name": "trigger",
            "hideInMenu": true,
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Exception__models__error.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Exception/models/error.js').then(m => { return { namespace: 'error',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Exception__TriggerException" */'../Exception/TriggerException'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "name": "account",
        "icon": "user",
        "path": "/account",
        "routes": [
          {
            "path": "/account/center",
            "name": "center",
            "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "p__Account__Center__Center" */'../Account/Center/Center'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
            "routes": [
              {
                "path": "/account/center",
                "redirect": "/account/center/articles",
                "exact": true
              },
              {
                "path": "/account/center/articles",
                "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "p__Account__Center__Center" */'../Account/Center/Articles'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
                "exact": true
              },
              {
                "path": "/account/center/applications",
                "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "p__Account__Center__Center" */'../Account/Center/Applications'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
                "exact": true
              },
              {
                "path": "/account/center/projects",
                "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "p__Account__Center__Center" */'../Account/Center/Projects'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
                "exact": true
              },
              {
                "component": () => React.createElement(require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
              }
            ]
          },
          {
            "path": "/account/settings",
            "name": "settings",
            "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Account__Settings__models__geographic.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Account/Settings/models/geographic.js').then(m => { return { namespace: 'geographic',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Account__Settings__Info" */'../Account/Settings/Info'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
            "routes": [
              {
                "path": "/account/settings",
                "redirect": "/account/settings/base",
                "exact": true
              },
              {
                "path": "/account/settings/base",
                "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Account__Settings__models__geographic.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Account/Settings/models/geographic.js').then(m => { return { namespace: 'geographic',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Account__Settings__Info" */'../Account/Settings/BaseView'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
                "exact": true
              },
              {
                "path": "/account/settings/security",
                "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Account__Settings__models__geographic.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Account/Settings/models/geographic.js').then(m => { return { namespace: 'geographic',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Account__Settings__Info" */'../Account/Settings/SecurityView'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
                "exact": true
              },
              {
                "path": "/account/settings/binding",
                "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Account__Settings__models__geographic.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Account/Settings/models/geographic.js').then(m => { return { namespace: 'geographic',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Account__Settings__Info" */'../Account/Settings/BindingView'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
                "exact": true
              },
              {
                "path": "/account/settings/notification",
                "component": _dvaDynamic({
  app: window.g_app,
models: () => [
  import(/* webpackChunkName: 'p__Account__Settings__models__geographic.js' */'/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/pages/Account/Settings/models/geographic.js').then(m => { return { namespace: 'geographic',...m.default}})
],
  component: () => import(/* webpackChunkName: "p__Account__Settings__Info" */'../Account/Settings/NotificationView'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
                "exact": true
              },
              {
                "component": () => React.createElement(require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
              }
            ]
          },
          {
            "component": () => React.createElement(require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "name": "editor",
        "icon": "highlight",
        "path": "/editor",
        "routes": [
          {
            "path": "/editor/flow",
            "name": "flow",
            "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "p__Editor__GGEditor__Flow" */'../Editor/GGEditor/Flow'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/editor/mind",
            "name": "mind",
            "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "p__Editor__GGEditor__Mind" */'../Editor/GGEditor/Mind'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "path": "/editor/koni",
            "name": "koni",
            "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "p__Editor__GGEditor__Koni" */'../Editor/GGEditor/Koni'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
            "exact": true
          },
          {
            "component": () => React.createElement(require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
          }
        ]
      },
      {
        "component": _dvaDynamic({
  
  component: () => import(/* webpackChunkName: "p__404" */'../404'),
  LoadingComponent: require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/src/components/PageLoading/index').default,
}),
        "exact": true
      },
      {
        "component": () => React.createElement(require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
      }
    ]
  },
  {
    "component": () => React.createElement(require('/Users/caiwenqiang/Documents/Tianchi-DataView/Arsenal-DataAnalysis/tianchi-client/node_modules/umi-build-dev/lib/plugins/404/NotFound.js').default, { pagesPath: 'src/pages', hasRoutesInConfig: true })
  }
];
window.g_routes = routes;
window.g_plugins.applyForEach('patchRoutes', { initialValue: routes });

// route change handler
function routeChangeHandler(location, action) {
  window.g_plugins.applyForEach('onRouteChange', {
    initialValue: {
      routes,
      location,
      action,
    },
  });
}
window.g_history.listen(routeChangeHandler);
routeChangeHandler(window.g_history.location);

export default function RouterWrapper() {
  return (
<RendererWrapper0>
          <Router history={window.g_history}>
      { renderRoutes(routes, {}) }
    </Router>
        </RendererWrapper0>
  );
}
