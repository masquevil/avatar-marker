#!/usr/bin/env node
const fs = require('fs');
const { Command } = require('commander');

const { parseFile } = require('../models/shine');

const PATHS = require('../constants/paths');

const command = new Command('info')
  .description('统计图片信息')
  .option('-d, --demo', '检查 demo 序列')
  .action(async (options) => {
    const isDemo = options.demo || false;

    const originPath = isDemo ? PATHS.originDemo : PATHS.origin;
    const files = fs.readdirSync(originPath);

    for (file of files) {
      const filename = file.slice(0, -4);
      const labels = await parseFile(filename, originPath);
      console.log(`labels of ${filename}:`, labels);
    }
  });

module.exports = command;
