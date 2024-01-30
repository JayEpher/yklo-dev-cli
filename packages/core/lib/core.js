'use strict';

module.exports = core;
const utils = require('@yklo-dev-cli/utils')
function core() {
  utils();
  return 'Hello from core';
}
core()