const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const srcDir = path.join(__dirname, '../src/views');
/**
 * 创建主路由
 */
function createChunkName() {
  let folders = fs.readdirSync(srcDir);
  folders.forEach((m) => {
    let fullPath = path.join(srcDir, '/' + m);
    let routeFile, cfgFile, name, version;
    if (fs.lstatSync(fullPath).isDirectory()
      && fs.existsSync(path.join(fullPath, 'index.js'))
      && fs.existsSync(path.join(fullPath, 'package.json'))) {

      // 获取模块名称与版本号
      cfgFile = JSON.parse(fs.readFileSync(path.join(fullPath, 'package.json')));
      name = cfgFile.name;
      version = cfgFile.version;

      // 替换路由文件中的webpackChunkName设置
      routeFile = fs.readFileSync(path.join(fullPath, 'index.js')).toString();
      fs.writeFileSync(path.join(fullPath, 'index.js'), routeFile.replace(/\/\*[\s\S]*?\*\//g, `/* webpackChunkName: "${name}-${version}" */`));
    }
  });

  console.log(chalk.cyan('  version create success.\n'));
}

createChunkName();
