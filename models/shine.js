const fs = require('fs');
const path = require('path');
const exifr = require('exifr');
const sharp = require('sharp');

const { getLabelsByMetaData } = require('../models/label');

const PATHS = require('../constants/paths');

/**
 * 生成默认的 json 数据
 */
function createShine() {
  return {
    version: 1,
    imageLabels: {},
  };
}

/**
 * 获取存储的 json 数据
 * @param {boolean} isDemo
 */
function getOldShine(isDemo = false) {
  return isDemo ? require(PATHS.shineDemo) : require(PATHS.shine);
}

/**
 * 更新 json 数据
 * @param {boolean} isDemo
 */
function setShine(shine, isDemo = false) {
  const filePath = isDemo ? PATHS.shineDemo : PATHS.shine;
  fs.writeFileSync(filePath, JSON.stringify(shine));
}

/**
 * 通过文件名获取文件的 meta data，如果有 outputPath，则生成压缩后的图片
 * @param {string} filename
 * @param {string} originPath
 * @param {string | undefined} outputPath
 */
async function parseFile(filename, originPath, outputPath) {
  const isGenMode = !!outputPath;
  const originFilename = `${filename}.png`;
  const outputFilename = `${filename}.jpg`;
  const srcPath = path.join(originPath, originFilename);
  const data = await exifr.parse(srcPath);

  if (typeof data.parameters !== 'string')
    throw new Error(`文件 ${originFilename} 的 SD meta data 不存在`);

  const labels = getLabelsByMetaData(data.parameters);
  if (isGenMode) {
    await sharp(srcPath)
      .resize(132 * 2, 172 * 2)
      .jpeg()
      .toFile(path.join(outputPath, outputFilename));
  }

  return labels;
}

module.exports = {
  createShine,
  getOldShine,
  setShine,
  parseFile,
};
