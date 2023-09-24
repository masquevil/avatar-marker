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
  .option('-f, --force', '强制重跑')
  .action(async (options) => {
    const isDemo = options.demo || false;
    const isForce = options.force || false;

    const oldShine = getOldShine(isDemo);
    const newShine = createShine();
    if (!isDemo && oldShine.imageLabels) {
      newShine.imageLabels = oldShine.imageLabels;
    }

    const originPath = isDemo ? PATHS.originDemo : PATHS.origin;
    const outputPath = isDemo ? PATHS.outputDemo : PATHS.output;
    const files = fs.readdirSync(originPath);

    const handledFiles = [];

    console.log(`\n正在检查 ${originPath} 目录下 ${files.length} 张图片`);

    for (file of files) {
      const filename = file.slice(0, -4);
      // 如果已经处理过，可以跳过处理
      if (!isForce && newShine.imageLabels[filename]) continue;

      const labels = await parseFile(filename, originPath, outputPath);
      newShine.imageLabels[filename] = labels;
      handledFiles.push(filename);
    }

    if (!handledFiles.length) {
      console.log(`没有新的图片，无需处理。\n`);
      return;
    }

    console.log(`\n已处理的图片列表：${handledFiles}`);
    console.log(`\n共处理 ${handledFiles.length} 张图片。`);

    setShine(newShine, isDemo);
    console.log(`已更新 Json。\n`);
  });

module.exports = command;
