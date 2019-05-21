// https://umijs.org/config/
import slash from 'slash2';
import os from 'os';
import pageRoutes from './router.config';
import webpackPlugin from './plugin.config';
import defaultSettings from '../src/defaultSettings';


const { primaryColor } = defaultSettings;
const server = 'http://localhost:8005';
const plugins = [
  ['umi-plugin-react', {
    antd: true,
    dva: {
      hmr: true,
    },
    locale: {
      enable: false, // default false
    },
    library: 'react',
    dynamicImport: {
      loadingComponent: './components/PageLoading/index',
      webpackChunkName: true,
      level: 3,
    },
    pwa: false,
    chunks: ['vendors', 'umi'],
    ...(!process.env.TEST && os.platform() === 'darwin' ?
      {
        dll: {
          include: ['dva', 'dva/router', 'dva/saga', 'dva/fetch'],
          exclude: ['@babel/runtime', 'netlify-lambda'],
        },
      } : {}),
  },],
  ['umi-plugin-auto-externals', {
    packages: ['react', 'react-dom', 'antd', 'moment',],
    urlTemplate: 'https://unpkg.com/{{ library }}@{{ version }}/{{ path }}',
    checkOnline: true,
  }],
];

export default {
  // add for transfer to umi
  plugins,
  define: {},
  treeShaking: true,
  targets: {
    chrome: 49,
    firefox: 58,
    safari: 10,
    edge: 13,
    opera: 50,
    ie: 11,
  },
  externals: {
    lodash: {
      commonjs: 'lodash',
      amd: 'lodash',
      root: '_'
    }
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
