const fs = require('fs');
const crypto = require('crypto-js');

const PATHS = require('../constants/paths');

/**
 * 获得当前文件列表的 hash
 * @param {string[]} files
 */
function getHashByFilenames(files) {
  return crypto.SHA256(files.join('')).toString(crypto.enc.Base64);
}

/**
 * 比较存储的 hash 与当前文件列表的 hash
 * @param {string[]} files
 * @param {boolean} isDemo
 */
function getHashs(isDemo = false) {
  const files = fs.readdirSync(isDemo ? PATHS.originDemo : PATHS.origin);
  const oldHash = fs.readFileSync(isDemo ? PATHS.hashDemo : PATHS.hash, 'utf8');
  const newHash = getHashByFilenames(files);

  return {
    oldHash,
    newHash,
    same: oldHash === newHash,
  };
}

/**
 * 保存新的 hash 值
 * @param {string} hash
 */
function saveHash(hash, isDemo = false) {
  fs.writeFileSync(isDemo ? PATHS.hashDemo : PATHS.hash, hash);
}

module.exports = {
  getHashByFilenames,
  getHashs,
  saveHash,
};
