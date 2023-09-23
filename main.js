#!/usr/bin/env node
const { program } = require('commander');
const package = require('./package.json');

// commands
const commandGen = require('./commands/gen');
const commandHash = require('./commands/hash');
const commandInfo = require('./commands/info');

program
  .name(package.name)
  .version(package.version)
  .description(package.description)
  .addCommand(commandGen)
  .addCommand(commandHash)
  .addCommand(commandInfo);

program.parse();
