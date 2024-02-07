'use strict';

const axios = require('axios');
const urlJoin = require('url-join');
const semver = require('semver');

function getNpmInfo(npmName, registry) {
  console.log(npmName, registry);
  if (!npmName) {
    return null;
  }
  const registryUrl = registry || getDefaultRegistry();
  const npmInfoUrl = urlJoin(registryUrl, npmName);
  console.log(npmInfoUrl);
  return axios
    .get(npmInfoUrl)
    .then((res) => {
      if (res.status === 200) {
        return res.data;
      }
      return null;
    })
    .catch((e) => {
      return Promise.reject(e);
    });
}

function getDefaultRegistry(isOriginal = false) {
  return isOriginal
    ? 'https://registry.npmjs.org'
    : 'https://registry.npm.taobao.org';
}

async function getNpmVersions(npmName, registry) {
  const data = await getNpmInfo(npmName, registry);
  if (data) {
    return Object.keys(data.versions);
  } else {
    return [];
  }
}

function getNpmSemverVersions(baseVersion, versions) {
  versions = versions
    .filter((version) => semver.satisfies(version, `^${baseVersion}`))
    .sort((a, b) => {
      return semver.gt(b, a);
    });
  return versions;
}

async function getNpmSemverVersion(baseVersion, npmName, registry) {
  const versions = await getNpmVersions(npmName, registry);
  const newVersions = getNpmSemverVersions(baseVersion, versions);
  console.log(newVersions);
  if (newVersions && newVersions.length > 0) {
    return newVersions[0];
  }
}

module.exports = {
  getNpmInfo,
  getNpmVersions,
  getNpmSemverVersion,
};
