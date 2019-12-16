'use strict'
// Template version: 1.3.1
// see http://vuejs-templates.github.io/webpack for documentation.

const path = require('path')

// 当前环境
let environment = 'develop'

// 环境配置
let envConfigs = {
  develop: {
    host: '192.168.66.34',
    port: 8081
  },
  home: {
    host: '192.168.0.109',
    port: 8081
  }
}

// 当前配置
let environmentConfigs = envConfigs[environment]

module.exports = {
  dev: {
    // Paths
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // 服务器代理
    proxyTable: {
      '/api': {
        // 代理地址
        // target: 'http://192.168.66.56:8088/',
        target: 'http://192.168.55.45:8088/',
        // 是否允许开启代理
        changeOrigin: true,
        // 代理地址重写
        pathRewrite: {
          '^/api': ''
        }
      }
    },

    // Various Dev Server settings
    host: environmentConfigs.host, // can be overwritten by process.env.HOST
    port: environmentConfigs.port, // can be overwritten by process.env.PORT, if port is in use, a free one will be determined
    // host: 'localhost',
    // port: 8081,
    autoOpenBrowser: true,
    errorOverlay: true,
    notifyOnErrors: true,
    poll: false, // https://webpack.js.org/configuration/dev-server/#devserver-watchoptions-

    // Use Eslint Loader?
    // If true, your code will be linted during bundling and
    // linting errors and warnings will be shown in the console.
    useEslint: true,
    // If true, eslint errors and warnings will also be shown in the error overlay
    // in the browser.
    showEslintErrorsInOverlay: false,

    /**
     * Source Maps
     */

    // https://webpack.js.org/configuration/devtool/#development
    devtool: 'cheap-module-eval-source-map',

    // If you have problems debugging vue-files in devtools,
    // set this to false - it *may* help
    // https://vue-loader.vuejs.org/en/options.html#cachebusting
    cacheBusting: true,

    cssSourceMap: true
  },

  build: {
    // Template for index.html
    index: path.resolve(__dirname, '../dist/index.html'),
    // index: path.resolve(__dirname, '../../static/public/index.html'),

    // Paths
    assetsRoot: path.resolve(__dirname, '../dist'),
    // assetsRoot: path.resolve(__dirname, '../../static/public'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    // assetsPublicPath: '/public/',

    /**
     * Source Maps
     */

    productionSourceMap: false,
    // https://webpack.js.org/configuration/devtool/#production
    devtool: '#source-map',

    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css'],

    // Run the build command with an extra argument to
    // View the bundle analyzer report after build finishes:
    // `npm run build --report`
    // Set to `true` or `false` to always turn it on or off
    bundleAnalyzerReport: process.env.npm_config_report
  }
}
