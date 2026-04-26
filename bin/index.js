#!/usr/bin/env node

import { Command } from 'commander';
import loginCommand from '../src/commands/login.js';
import profilesCommand from '../src/commands/profiles.js';
import exportCommand from '../src/commands/export.js';
import dotenv from 'dotenv';

dotenv.config();

const program = new Command();

program
  .name('insighta')
  .description('CLI tool for Insighta Labs+')
  .version('1.0.0');

program
  .command('login')
  .description('Login to Insighta Labs+ using OAuth 2.0 PKCE')
  .action(loginCommand);

program
  .command('profiles')
  .description('Fetch profiles data')
  .action(profilesCommand);

program
  .command('export')
  .description('Export profiles to a CSV file')
  .option('-o, --output <path>', 'Output file path')
  .action(exportCommand);

program.parse(process.argv);
