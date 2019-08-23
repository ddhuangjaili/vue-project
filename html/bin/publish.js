const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const ora = require('ora');
const Client = require('ssh2-sftp-client');
const sftp = new Client();
const node_ssh = require('node-ssh');
const ssh = new node_ssh();

let spinner = null;

const zipName = 'bsmp-app-1.0-dist.zip';
const fromDir = path.join(__dirname, '../' + zipName);
const toDir = '/web/bsmp-app';

const cfgName = 'dev_ops.json';
const cfgFilePath = path.join(__dirname, '../config/' + cfgName);

const options = {
  host: '192.168.35.94',
  port: 242,
  username: 'root',
  password: 'Gold1234{}'
};

sftp.connect(options).then(() => {
  spinner = ora(`uploading files`);
  spinner.start();
  return sftp.rmdir(toDir + '/html', true);
}).then(() => {
  return sshConnect();
}).then(() => {
  let stream = fs.createReadStream(fromDir);
  return sftp.put(stream, toDir + '/' + zipName, true, 'utf-8');
}).then(() => {
  spinner.stop();
  return unzipFile(zipName, toDir);
}).then(() => {
  let stream = fs.createReadStream(cfgFilePath);
  return sftp.put(stream, toDir + '/html/' + cfgName, true, 'utf-8');
}).then(() => {
  return chmodFolder(toDir);
}).then(() => {
  sftp.end();
  ssh.dispose();
  console.log(chalk.cyan('Publish complete.\n'));
}).catch((err) => console.log(err, 'catch error'));

/**
 * SSH连接
 * @returns {*}
 */
function sshConnect() {
  return ssh.connect(options);
}

/**
 * 解压发布压缩包
 * @param name
 * @param dir
 * @returns {Promise}
 */
function unzipFile(name, dir) {
  return new Promise(function (resolve, reject) {
    spinner = ora(`unziping files`);
    spinner.start();
    ssh.execCommand('unzip ' + name, {cwd: dir}).then(function (result) {
      spinner.stop();
      if (result.stderr) {
        console.error(result.stderr);
      } else {
        console.log(chalk.cyan('Unzip Success.\n'));
        resolve();
      }
    });
  });
}

/**
 * html文件夹删除之后，需要重新开放权限
 * @param dir
 * @returns {Promise}
 */
function chmodFolder(dir) {
  return new Promise(function (resolve, reject) {
    spinner = ora(`chmod folder`);
    spinner.start();
    ssh.execCommand('chmod -R 755 html/ ', {cwd: dir}).then(function (result) {
      spinner.stop();
      if (result.stderr) {
        console.error(result.stderr);
      } else {
        console.log(chalk.cyan('Chmod folder Success.\n'));
        resolve();
      }
    });
  });
}
