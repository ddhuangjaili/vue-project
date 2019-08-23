require('./check-versions')()

process.env.NODE_ENV = 'production'

var ora = require('ora')
var rm = require('rimraf')
var path = require('path')
var chalk = require('chalk')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.prod.conf')
var fs = require('fs')
var fse = require('fs-extra')
var zipFolder = require('zip-folder')

var spinner = ora('building for production...')
spinner.start()

var releaseDir = './release', distDir = '/html', srcDir = './dist/', zipName = 'bsmp-app-1.0-dist.zip';

rm(path.join(config.build.assetsRoot, config.build.assetsSubDirectory), err => {
  if (err) throw err
  console.log(chalk.cyan('  Building...\n'))
  webpack(webpackConfig, function (err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
      }) + '\n\n')

    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
      '  Tip: built files are meant to be served over an HTTP server.\n' +
      '  Opening index.html over file:// won\'t work.\n'
    ))

    // 创建发布结构目录
    if (!fs.existsSync(releaseDir)) {
      fs.mkdirSync(releaseDir);
    }
    if (!fs.existsSync(releaseDir + distDir)) {
      fs.mkdirSync(releaseDir + distDir);
    }

    // 复制发布文件
    fse.copySync(srcDir, releaseDir + distDir);

    // 压缩
    zipFolder(releaseDir, './' + zipName, function (err) {
      if (err) {
        console.log('oh no!', err);
      } else {
        console.log('EXCELLENT');
        // 删除创建发布结构目录
        rm(releaseDir, function (err) {
          if (err) throw err;
          console.log(chalk.yellow('Please copy ' + zipName + ' to release!'));
        });
      }
    });
  })
})

