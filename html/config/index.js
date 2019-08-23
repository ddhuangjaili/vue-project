// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: false,
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
  },
  dev: {
    env: require('./dev.env'),
    port: 8088,
    autoOpenBrowser: true,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {
      //  '/api/**/*.json': {
      //    changeOrigin: true,
      //   target: 'http://127.0.0.1:8888'
      //  },
        '/api/sys_config': {
          changeOrigin: true,
          target: 'http://47.107.126.89:8062',
          pathRewrite: {
           '^/api/sys_config' : '/'
          }
        },
        '/api/app_scret': {
          changeOrigin: true,
          target: 'http://47.107.126.89:8060',
          pathRewrite: {
           '^/api/app_scret' : '/'
          }
        },
      // '/api/vc_coupon/': {
      //   changeOrigin: true,
      //   target: 'http://172.30.4.54:8069',
      //   pathRewrite: {
      //       '^/api/vc_coupon/' : '/'
      //   }
      // },
        '/api/risk_system/business': {
          changeOrigin: true,
          target: 'http://47.107.126.89:9080',
          pathRewrite: {
            '^/api/risk_system' : '/'
          }
        },
       '/api/risk_system': {
         changeOrigin: true,
         target: 'http://47.107.126.89:8040',
         pathRewrite: {
           '^/api/risk_system' : '/'
         }
       }, 
      // '/api/data_center': {
      //   changeOrigin: true,
      //   target: 'http://192.168.35.117:18888',
      //   pathRewrite: {
      //     '^/api/data_center' : '/'
      //   }
      // },
      '/api': {
        changeOrigin: true,
        target: 'http://47.107.126.89'
      }
    },
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  }
}
