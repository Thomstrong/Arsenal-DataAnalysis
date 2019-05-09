// https://umijs.org/config/
import slash from 'slash2';
import os from 'os';
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';


const { pwa, primaryColor } = defaultSettings;
const { APP_TYPE, TEST } = process.env;
const server = 'http://39.97.114.234:8000';
const plugins = [
  [
    'umi-plugin-react',
    {
      antd: true,
      dva: {
        hmr: true,
      },
      locale: {
        enable: false, // default false
      },
      dynamicImport: {
        loadingComponent: './components/PageLoading/index',
        webpackChunkName: true,
        level: 3,
      },
      pwa: pwa ?
        {
          workboxPluginMode: 'InjectManifest',
          workboxOptions: {
            importWorkboxFrom: 'local',
          },
        } : false,
      ...(!TEST && os.platform() === 'darwin' ?
        {
          dll: {
            include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
            exclude: ['@babel/runtime', 'netlify-lambda'],
          },
          hardSource: false,
        } : {}),
    },
  ],
  ['umi-plugin-auto-externals', {
    packages: ['react', 'antd', 'moment', 'react-dom',],
    urlTemplate: 'https://unpkg.com/{{ library }}@{{ version }}/{{ path }}',
    checkOnline: false,
  }],
];

export default {
  // add for transfer to umi
  plugins,
  define: {
    APP_TYPE: APP_TYPE || '',
  },
  treeShaking: true,
  externals: {
    '@antv/g2': 'antv-g2',
    '@antv/data-set': '@antv/data-set',
    'bizcharts': 'bizcharts'
  },
  targets: {
    ie: 11,
  },
  // 路由配置
  routes: pageRoutes,
  // Theme for antd
  // https://ant.design/docs/react/customize-theme-cn
  theme: {
    'primary-color': primaryColor,
  },
  proxy: {
    '/api': {
      target: `${server}/api`,
      changeOrigin: true,
      pathRewrite: { '^/api': '' },
    },
  },
  ignoreMomentLocale: true,
  lessLoaderOptions: {
    javascriptEnabled: true,
  },
  disableRedirectHoist: true,
  cssLoaderOptions: {
    modules: true,
    getLocalIdent: (context, localIdentName, localName) => {
      if (
        context.resourcePath.includes('node_modules') ||
        context.resourcePath.includes('ant.design.pro.less') ||
        context.resourcePath.includes('global.less')
      ) {
        return localName;
      }
      const match = context.resourcePath.match(/src(.*)/);
      if (match && match[1]) {
        const antdProPath = match[1].replace('.less', '');
        const arr = slash(antdProPath)
          .split('/')
          .map(a => a.replace(/([A-Z])/g, '-$1'))
          .map(a => a.toLowerCase());

        return `tianchi-client${arr.join('-')}-${localName}`.replace(/--/g, '-');
      }

      return localName;
    },
  },
  manifest: {
    basePath: '/',
  },

  chainWebpack: webpackPlugin,
};
