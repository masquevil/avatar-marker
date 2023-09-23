#!/usr/bin/env node
const fs = require('fs');
const path = require('path');
const { Command } = require('commander');

const { createShine, getOldShine, setShine } = require('../models/shine');
const { parseFile } = require('../models/shine');

const PATHS = require('../constants/paths');

const command = new Command('gen')
  .description('生成结果')
  .option('-d, --demo', '检查 demo 序列')
  .action(async (options) => {
    const isDemo = options.demo || false;

    const oldShine = getOldShine(isDemo);
    const newShine = createShine();
    if (!isDemo && oldShine.imageLabels) {
      newShine.imageLabels = oldShine.imageLabels;
    }

    const originPath = isDemo ? PATHS.originDemo : PATHS.origin;
    const outputPath = isDemo ? PATHS.outputDemo : PATHS.output;
    const files = fs.readdirSync(originPath);

    const handledFiles = [];

    for (file of files) {
      const filename = file.slice(0, -4);
      // 如果已经处理过，可以跳过处理
      if (newShine.imageLabels[filename]) return;

      const labels = await parseFile(filename, originPath, outputPath);
      newShine.imageLabels[filename] = labels;
      handledFiles.push(filename);
    }

    console.log(`\n已处理的图片列表：${handledFiles}`);
    console.log(`\n共处理 ${handledFiles.length} 张图片。`);

    setShine(newShine, isDemo);
    console.log(`已更新 Json。\n`);
  });

module.exports = command;
