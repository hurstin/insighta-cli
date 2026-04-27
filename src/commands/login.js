import { login } from '../utils/auth.js';
import chalk from 'chalk';
import ora from 'ora';

export default async function loginCommand() {
  if (!process.env.GITHUB_CLIENT_ID || !process.env.INSIGHTA_BACKEND_URL) {
    console.error(chalk.red('Error: Environment variables are missing.'));
    console.log(chalk.yellow('Make sure you have a .env or config.env file in the current directory with:'));
    console.log('GITHUB_CLIENT_ID=...');
    console.log('INSIGHTA_BACKEND_URL=...');
    process.exit(1);
  }

  const spinner = ora('Starting login process...').start();
  try {
    await login();
    spinner.succeed(chalk.green('Authentication successful!'));
  } catch (error) {
    spinner.fail(chalk.red(`Login failed: ${error.message}`));
    process.exit(1);
  }
}
