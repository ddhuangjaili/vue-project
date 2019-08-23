const inquirer = require('inquirer');
const path = require('path');
const fs = require('fs');
const chalk = require('chalk');
const ora = require('ora');
const exec = require('child_process').exec;

const srcDir = path.join(__dirname, '../src/views');
/**
 * 初始化
 */
function init() {
  if (fs.existsSync(srcDir)) {
    let entries = fs.readdirSync(srcDir).reduce((entries, dir) => {
      const fullDir = path.join(srcDir, dir);
      const entry = path.join(fullDir, 'package.json');
      if (fs.statSync(fullDir).isDirectory() && fs.existsSync(entry)) {
        entries.push({name: dir});
      }

      return entries
    }, []);

    // 显示模块选择列表
    showPrompt(entries).then(function (answers) {
      if (answers.modules.length) {
        let count = 0;
        let spinner = ora('publishing modules...');
        spinner.start();
        answers.modules.forEach((m) => {
          exec('npm publish', {cwd: path.join(srcDir, m)}, function (error, stdout, stderr) {
            if (error) throw error;
            console.log(chalk.yellow(stdout));
            count++;
            if (count === answers.modules.length) {
              spinner.stop();
              console.log(chalk.cyan('  Deploy complete.\n'));
            }
          });
        });
      }
    });
  }
}

init();

/**
 * 显示模块
 * @param choices
 * @returns {*}
 */
function showPrompt(choices) {
  return inquirer.prompt([
    {
      type: 'checkbox',
      message: 'Select want to deploy modules',
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

