'use strict';

module.exports = core;
const semver = require('semver');
const colors = require('colors');
// const pathExists = require('path-exists');
const pkg = require('../package.json');
const log = require('@yklo-dev-cli/log');
const constant = require('./const');
// const rootCheck = require('root-check'); // 看下源码,注意版本，2.0+不支持require了
// import rootCheck from 'root-check';
// const userHome = require('user-home');
let args;
async function core() {
  try {
    checkPkgVersion();
    checkNodeVersion();
    checkRoot();
    checkUserHome();
    checkInputArgs();
    log.verbose('test');
    await checkGlobalUpdate();
  } catch (e) {
    log.error(e.message);
  }
}

async function checkGlobalUpdate() {
  // 获取当前版本和模块名
  const currentVersion = pkg.version;
  const npmName = pkg.name;
  // 调用npm API，获取所有版本号
  const { getNpmSemverVersion } = require('@yklo-dev-cli/npm-info');
  const lastVersion = await getNpmSemverVersion(currentVersion, npmName);
  console.log(lastVersion);
  // 提取所有版本号，比对
  // 获取最新的版本号，提示用户更新
  if (lastVersion && semver.gt(lastVersion, currentVersion)) {
    log.warn(
      '更新提示',
      colors.yellow(
        `请手动更新 ${npmName}, 当前版本 ${currentVersion}, 最新版本 ${lastVersion} 更新命令: npm install -g ${npmName}`
      )
    );
  }
}

function checkInputArgs() {
  const minimist = require('minimist');
  args = minimist(process.argv.slice(2));
  console.log(args);
  checkArgs();
}

function checkArgs() {
  if (args.debug) {
    process.env.LOG_LEVEL = 'verbose';
  } else {
    process.env.LOG_LEVEL = 'info';
  }
  log.level = process.env.LOG_LEVEL;
}

function checkUserHome() {
  // console.log(userHome);
  // if (!userHome || !pathExists(userHome)) {
  // throw new Error(colors.red('当前登录用户主目录不存在'));
  // }
}

function checkRoot() {
  // rootCheck();
  console.log(process.getegid());
}

function checkNodeVersion() {
  const currentVersion = process.version;
  const lowestVersion = constant.LOWEST_NODE_VERSION;
  console.log(process.version);
  if (!semver.gte(currentVersion, lowestVersion)) {
    throw new Error(
      colors.red(`yklo-cli 需要安装 v${lowestVersion} 以上版本的 Node.js`)
    );
  }
}

function checkPkgVersion() {
  log.info('cli', pkg.version);
}
