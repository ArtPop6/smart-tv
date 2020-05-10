
// const _ = require('lodash');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const HtmlWebpackExtend = require('./html-webpack-extend');
// const utils = require('./utils');

const prod = process.env.NODE_ENV === 'production';

const webpackConfig = {
  entry: {},
  plugins: [
    new HtmlWebpackExtend(),
  ],
};

function setPageConfig(options) {
  const htmlPluginConfig = {
    filename: options.uri,
    chunks: ['vendor'],
    chunksSortMode: 'manual',
    inject: true,
  };

  // exist entry js
  if (options.js) {
    // add webpack entry config
    webpackConfig.entry[options.path] = path.join(options.dir, options.js);
    htmlPluginConfig.chunks.unshift(options.path);
  }

  // template
  if (options.html) {
    htmlPluginConfig.template = path.join(options.dir, options.html);
  }

  // prod options
  if (prod) {
    htmlPluginConfig.chunks.unshift('manifest');
    Object.assign(htmlPluginConfig, {
      minify: {
        removeComments: true,
        collapseWhitespace: true,
        removeAttributeQuotes: true,
      },
      chunksSortMode: 'dependency',
    });
  }
  // push to plugins
  webpackConfig.plugins.push(new HtmlWebpackPlugin(htmlPluginConfig));
}

setPageConfig({
  path: 'app',
  uri: 'index.html',
  html: 'tmpl.html',
  js: 'main.js',
  dir: path.join(__dirname, '../src/'),
});
// const pages = utils.pages();
// _.forEach(pages, setPageConfig);

module.exports = webpackConfig;
