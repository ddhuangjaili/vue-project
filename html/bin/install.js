const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const fse = require('fs-extra');
const rm = require('rimraf');
const chalk = require('chalk');
const ora = require('ora');
const exec = require('child_process').exec;
const axios = require('axios');

const cfgUrl = 'http://192.168.35.94/dev_ops.json';
// 登录信息
const loginInfo = {
  name: '',
  password: ''
};
const srcDir = path.join(__dirname, '../src/views');
let spinner = null;

let moduleMap = {};
/**
 * 加载配置模块信息
 */
function loadCfg(loginInfo) {
  return axios({method: 'get', url: cfgUrl, params: loginInfo}).then((res) => {
    let data = res.data, result = [];
    if (data && data.code === '0') {
      if (data.data && data.data.modules && data.data.modules.length) {
        result = data.data.modules;
      }
    }
    return result;
  });
}

let select = {
  modules: null,
  offset: 0
};

function init() {
  inquirer.prompt([{
    type: 'input',
    name: 'name',
    message: 'Enter your name:'
  }, {
    type: 'password',
    message: 'Enter your password',
    name: 'password'
  }]).then(function (answers) {
    if (answers.name && answers.password) {
      loginInfo.name = answers.name;
      loginInfo.password = answers.password;

      loadCfg(loginInfo).then((data) => {
        if (data && data.length) {
          let entries = [];
          for (let i = 0, len = data.length; i < len; i++) {
            moduleMap[data[i].name] = data[i];
            entries.push({name: data[i].name});
          }
          // 显示模块选择列表
          showPrompt(entries, 'Select want to download modules').then(function (answers) {
            if (answers.modules.length) {
              select = {
                modules: answers.modules,
                offset: 0
              };
              installNpm();
            }
          });
        }
      });
    }
  });
}

init();

/**
 * 下载NPM包
 */
function installNpm() {
  if (select.offset < select.modules.length) {
    let name = select.modules[select.offset];
    spinner = ora(`downloading module: ${name}...`);
    spinner.start();
    exec('npm install ' + name, {cwd: path.join(__dirname, '..')}, function (error, stdout, stderr) {
      spinner.stop();

      let exist = true;
      if (error) {
        if (error.toString().indexOf('404 Not found') > -1) {
          // 该模块不存在
          exist = false;

          inquirer.prompt([{
            type: 'confirm',
            message: `module [${name}] is not fount in the npm registry, Do you want to create?`,
            name: 'ok'
          }]).then(function (answers) {
            if (answers.ok) {
              // 模板下载
              let templateDir = path.join(__dirname, '../node_modules/module_template');
              if (!fs.existsSync(templateDir)) {
                installTemplate(name);
              } else {
                createModule(name);
              }
            }
          });
        } else {
          throw error;
        }
      }
      console.log(chalk.yellow(stdout));
      select.offset++;

      if (exist) {
        createModule(name, name);
      }
    });
  } else {
    console.log(chalk.cyan('  Install complete.\n'));
    inquirer.prompt([{
      type: 'confirm',
      message: `Do you want to create src/views/index.js file [combine module's router] ?`,
      name: 'router'
    }]).then(function (answers) {
      if (answers.router) {
        createRouter();
      }
    });
  }
}

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

  let module;
  for (let key in moduleMap) {
    module = moduleMap[key];
    if (module.type === 'sys' && module.name !== 'bsmp_main') {
      strings.push(`import ${module.name} from '${module.name}';`);
      modules.push(module.name);
    }
  }

  if (strings.length) {
    strings.push(`export default [...${modules.join(',...')}]`);
    fs.writeFileSync(path.join(srcDir, 'index.js'), strings.join('\n'), 'utf8');
    console.log(chalk.cyan('  File create success.\n'));
  }
}

/**
 * 安装模块模板
 * @param name
 */
function installTemplate(name) {
  spinner = ora(`downloading template...`);
  spinner.start();
  exec('npm install module_template', {cwd: path.join(__dirname, '..')}, function (error, stdout, stderr) {
    spinner.stop();
    if (error) throw error;

    // 创建模块
    createModule(name);
  });
}

/**
 * 创建模块
 * @param name
 * @param template
 */
function createModule(name, template) {
  template = template || 'module_template';
  // 创建目录
  let toDir = path.join(srcDir, name);
  let fromDir = path.join(__dirname, '../node_modules/' + template);

  if (fs.existsSync(toDir)) {
    inquirer.prompt([{
      type: 'confirm',
      message: `module [${name}] is exist in sr/views, Do you want to override?`,
      name: 'override'
    }]).then(function (answers) {
      if (answers.override) {
        rm(toDir, err => {
          if (err) throw err;
            // 复制文件
            copyFolder(name, template, fromDir, toDir);
          });
      }
    });
  } else {
    if (moduleMap[name].type === 'user') {
      fs.mkdirSync(toDir);
    }
    // 复制文件
    copyFolder(name, template, fromDir, toDir);
  }
}

/**
 * 复制文件夹
 * @param name
 * @param template
 * @param fromDir
 * @param toDir
 */
function copyFolder(name, template, fromDir, toDir) {
  if (moduleMap[name].type === 'user') {
    spinner = ora(`creating module: ${name}...`);
    spinner.start();

    fse.copySync(fromDir, toDir);

    if (template === 'module_template') {
      replaceTemplate(toDir, name);
    }
    spinner.stop();
  }

  // 继续下载剩下的模块
  installNpm();
}

/**
 * 文本替换
 * @param dir
 * @param name
 */
function replaceTemplate(dir, name) {
  let paths = fs.readdirSync(dir);
  paths.forEach((p) => {
    let fullPath = path.join(dir, '/' + p);
    if (fs.lstatSync(fullPath).isDirectory()) {
      replaceTemplate(fullPath, name);
    } else {
      let result = fs.readFileSync(fullPath, 'utf8').replace(/module_template/g, name);
      fs.writeFileSync(fullPath, result, 'utf8');
    }
  });
}

/**
 * 显示模块
 * @param choices
 * @param message
 * @returns {*}
 */
function showPrompt(choices, message) {
  return inquirer.prompt([
    {
      type: 'checkbox',
      message: message,
      name: 'modules',
      choices: [
        new inquirer.Separator(' = The Modules = '),
        ...choices
      ],
      validate: function (answer) {
        if (answer.length < 1) {
          return 'You must choose at least one module.';
        }
        return true;
      }
    }
  ]);
}

