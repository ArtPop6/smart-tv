
const webpack = require('webpack');
const merge = require('webpack-merge');

const baseWebpackConfig = require('./webpack.base.conf');
const utils = require('./utils');
const config = require('../config');

module.exports = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({ sourceMap: config.dev.cssSourceMap }),
  },
  // cheap-module-eval-source-map is faster for development
  // cheap-source-map source-map 加载额外的 Source Map 文件，以方便断点调试
  devtool: '#source-map',
  plugins: [
    new webpack.DefinePlugin({
      'process.env': config.dev.env,
    }),
    new webpack.NoEmitOnErrorsPlugin(),
  ],
});
