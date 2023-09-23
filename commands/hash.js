#!/usr/bin/env node
const { Command } = require('commander');

const { getHashs } = require('../models/hash');

const command = new Command('hash')
  .description('检查哈希值变动')
  .option('-d, --demo', '检查 demo 序列')
  .action(async (options) => {
    const isDemo = options.demo || false;

    const { oldHash, newHash, same } = getHashs(isDemo);

    console.log('');
    console.log('oldHash:', oldHash);
    console.log('newHash:', newHash);
    console.log('is same:', same);
    console.log('');
  });

module.exports = command;
