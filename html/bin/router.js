const path = require('path');
const fs = require('fs');
const chalk = require('chalk');

const srcDir = path.join(__dirname, '../src/views');
/**
 * 创建主路由
 */
function createRouter() {
  let folders = fs.readdirSync(srcDir);
  let strings = [], modules = [];
  folders.forEach((m) => {
    let fullPath = path.join(srcDir, '/' + m);
    if (fs.lstatSync(fullPath).isDirectory() && fs.existsSync(path.join(fullPath, 'index.js'))) {
      strings.push(`import ${m} from '@/views/${m}';`);
      modules.push(m);
    }
  });

  if (strings.length) {
    strings.push(`export default [...${modules.join(',...')}]`);
    fs.writeFileSync(path.join(srcDir, 'index.js'), strings.join('\n'), 'utf8');
    console.log(chalk.cyan('  File create success.\n'));
  }
}

createRouter();
