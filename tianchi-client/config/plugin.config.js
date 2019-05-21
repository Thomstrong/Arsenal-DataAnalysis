// Change theme plugin
import MergeLessPlugin from 'antd-pro-merge-less';
import AntDesignThemePlugin from 'antd-theme-webpack-plugin';
import path from 'path';

function getModulePackageName(module) {
  if (!module.context) return null;

  const nodeModulesPath = path.join(__dirname, '../node_modules/');
  if (module.context.substring(0, nodeModulesPath.length) !== nodeModulesPath) {
    return null;
  }

  const moduleRelativePath = module.context.substring(nodeModulesPath.length);
  const [moduleDirName] = moduleRelativePath.split(path.sep);
  let packageName = moduleDirName;
  // handle tree shaking
  if (packageName.match('^_')) {
    // eslint-disable-next-line prefer-destructuring
    packageName = packageName.match(/^_(@?[^@]+)/)[1];
  }

  return packageName;
}

export default config => {
  const outFile = path.join(__dirname, '../.temp/ant-design-pro.less');
  const stylesDir = path.join(__dirname, '../src/');

  config.plugin('merge-less').use(MergeLessPlugin, [
    {
      stylesDir,
      outFile,
    },
  ]);

  config.plugin('ant-design-theme').use(AntDesignThemePlugin, [
    {
      antDir: path.join(__dirname, '../node_modules/antd'),
      stylesDir,
      varFile: path.join(__dirname, '../node_modules/antd/lib/style/themes/default.less'),
      mainLessFile: outFile, //     themeVariables: ['@primary-color'],
      indexFileName: 'index.html',
      generateOne: true,
      lessUrl: 'https://gw.alipayobjects.com/os/lib/less.js/3.8.1/less.min.js',
    },
  ]);

  config.output
    .filename('[name].[hash:8].js')
    .chunkFilename('[name].[chunkhash:8].async.js');
  // optimize chunks
  config.optimization
    .minimize(true)
    .runtimeChunk(false) // share the same chunks across different modules
    .splitChunks({
      chunks: 'async',
      name: 'vendors',
      maxInitialRequests: Infinity,
      minSize: 30000,
      cacheGroups: {
        vendors: {
          test: module => {
            const packageName = getModulePackageName(module);
            if (packageName) {
              return ['bizcharts', '@antv_data-set'].indexOf(packageName) >= 0;
            }

            return false;
          },
          name(module) {
            const packageName = getModulePackageName(module);

            if (['bizcharts', '@antv_data-set'].indexOf(packageName) >= 0) {
              return 'viz'; // visualization package
            }

            return 'misc';
          },
        },
      },
    });
};
