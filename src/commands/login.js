import { login } from '../utils/auth.js';
import chalk from 'chalk';
import ora from 'ora';

export default async function loginCommand() {
  const spinner = ora('Starting login process...').start();
  try {
    await login();
    spinner.succeed(chalk.green('Authentication successful!'));
  } catch (error) {
    spinner.fail(chalk.red(`Login failed: ${error.message}`));
    process.exit(1);
  }
}
