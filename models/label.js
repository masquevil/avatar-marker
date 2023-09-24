const fs = require('fs');
const path = require('path');

const PATHS = require('../constants/paths');

const REGS = {
  hairColors: /(white|black|red|yellow|brown|purple|blue|green|pink) hair/g,
  hairStyles: /(back|ponytail|long|short) hair/g,
  eyeColors: /(black|red|yellow|brown|purple|blue|green|pink) eyes/g,
  female: /1 (girl|old female)/g,
  male: /1 (boy|old man)/g,
  old: /(old)/g,
};

/**
 * 生成默认的 label 数据
 */
function createLabels() {
  return [];
}

/**
 * 根据源图片的 meta data 获取 labels
 * @param {string} metaData
 */
function getLabelsByMetaData(metaData) {
  const labels = createLabels();
  // 发色
  const hairColors = metaData.match(REGS.hairColors);
  labels.push(hairColors[0]);

  // 发型
  const hairStyles = metaData.match(REGS.hairStyles);
  labels.push(hairStyles[0]);

  // 瞳色
  const eyeColors = metaData.match(REGS.eyeColors);
  labels.push(eyeColors[0]);

  // 性别
  if (REGS.female.test(metaData)) {
    labels.push('female');
  }
  if (REGS.male.test(metaData)) {
    labels.push('male');
  }

  // 年龄
  if (REGS.old.test(metaData)) {
    labels.push('old');
  } else {
    labels.push('young');
  }

  // reset regexp
  REGS.female.lastIndex = 0;
  REGS.male.lastIndex = 0;
  REGS.old.lastIndex = 0;

  return labels;
}

module.exports = {
  getLabelsByMetaData,
};
