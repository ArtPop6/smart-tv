
const _ = require('lodash');
const glob = require('glob');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const config = require('../config');

exports.assetsPath = (_path) => {
  const assetsSubDirectory = process.env.NODE_ENV === 'production'
    ? config.build.assetsSubDirectory
    : config.dev.assetsSubDirectory;
  return path.posix.join(assetsSubDirectory, _path);
};

exports.cssLoaders = (_options) => {
  const options = _options || {};

  const cssLoader = {
    loader: 'css-loader',
    options: {
      minimize: process.env.NODE_ENV === 'production',
      sourceMap: options.sourceMap,
    },
  };

  function generateLoaders(loader, loaderOptions) {
    const loaders = [cssLoader];
    if (loader) {
      loaders.push({
        loader: `${loader}-loader`,
        options: Object.assign({}, loaderOptions, {
          sourceMap: options.sourceMap,
        }),
      });
    }

    if (options.extract) {
      return ExtractTextPlugin.extract({
        use: loaders,
        fallback: 'vue-style-loader',
      });
    }
    return ['vue-style-loader'].concat(loaders);
  }

  // stylus options
  const stylusOptions = {
    import: [
      path.join(__dirname, '..', 'src/styles/helpers/index.styl'),
    ],
  };

  return {
    css: generateLoaders(),
    stylus: generateLoaders('stylus', stylusOptions),
    styl: generateLoaders('stylus', stylusOptions),
  };
};

exports.styleLoaders = (options) => {
  const output = [];
  const loaders = exports.cssLoaders(options);
  _.forEach(loaders, (loader, extension) => {
    output.push({
      test: new RegExp(`\\.${extension}$`),
      use: loader,
    });
  });
  return output;
};

function pageExt(uri) {
  return `${uri.replace(/index$/i, '')}/index.html`.replace(/^\//ig, '');
}

function pageUri(folderPath) {
  if (!config.page || !config.page.keepFolder) return folderPath;

  let shouldKeep = null;
  config.page.keepFolder.forEach((keep) => {
    const toKeep = keep.replace(/^\/|\/$/ig, '');

    if (!shouldKeep || shouldKeep.length < toKeep.length) {
      if (folderPath.indexOf(toKeep) !== -1) shouldKeep = toKeep;
      else if (toKeep.indexOf(folderPath) !== -1) shouldKeep = folderPath;
    }
  });

  if (shouldKeep) {
    const prefix = shouldKeep;
    const suffix = folderPath.replace(shouldKeep, '').replace(/^\//ig, '').replace(/\//ig, '-');
    return path.join(prefix, suffix);
  }

  return folderPath.replace(/\//ig, '-');
}

exports.pages = () => {
  const pageroot = path.resolve(__dirname, '../src/pages');
  if (!config.page) return {};

  const htmlConf = config.page.template || [];
  const jsConf = config.page.entry || [];
  const patterns = [
    htmlConf.join(','),
    jsConf.join(','),
  ];

  const data = {};
  glob.sync(`**/{${patterns.join(',')}}`, {
    cwd: pageroot,
  }).forEach((file) => {
    const opt = path.parse(file);

    if (!data[opt.dir]) {
      const uri = pageUri(opt.dir);
      data[opt.dir] = {
        uri: pageExt(uri),
        path: opt.dir,
        dir: path.join(pageroot, opt.dir),
      };
    }
    const cur = data[opt.dir];

    if (htmlConf.indexOf(opt.base) !== -1) cur.html = opt.base;
    else if (jsConf.indexOf(opt.base) !== -1) cur.js = opt.base;
  });
  return data;
};

