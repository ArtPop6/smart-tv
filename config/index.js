const path = require('path')
const prodEnv = require('./prod.env')
const devEnv = require('./dev.env')
let proxyHost = ''

switch (process.env.SERVER_ENV) {
  case 'dev': {
    // proxyHost = 'http://qa.www.ampmfit.net/'
    proxyHost = 'http://dev.tv.ampmfit.net/'
    // proxyHost = 'http://yapi.ampmfit.net/mock/20/'
    // proxyHost = 'http://192.168.0.66:9006/';//yang
    break
  }
  case 'test': {
    proxyHost = 'http://test.tv.ampmfit.net/'
    break
  }
  case 'qa': {
    proxyHost = 'http://qa.tv.ampmfit.net/'
    break
  }
  default: {
    proxyHost = 'http://tv.ampmfit.net/'
    break
  }
}

module.exports = {
  page: {
    entry: ['main.js'],
    template: ['tmpl.html'],
    keepFolder: [
    ]
  },
  build: {
    env: prodEnv,
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    bundleAnalyzerReport: process.env.npm_config_report
  },
  dev: {
    env: devEnv,
    port: 10004,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      '/api': {
        target: proxyHost,
        changeOrigin: true,
        pathRewrite: {
          '^/api': '/api' // 重写接口
        }
      }
    },
    cssSourceMap: false
  }
}
