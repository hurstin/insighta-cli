import api from '../utils/api.js';
import chalk from 'chalk';
import ora from 'ora';
import fs from 'fs-extra';
import path from 'path';

export default async function exportCommand(options) {
  const outputPath = options.output || path.join(process.cwd(), `export-${Date.now()}.csv`);
  const spinner = ora(`Exporting data to ${outputPath}...`).start();

  try {
    const response = await api.get('/v1/profiles/export', {
      responseType: 'stream',
    });

    const writer = fs.createWriteStream(outputPath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        spinner.succeed(chalk.green(`Export completed: ${outputPath}`));
        resolve();
      });
      writer.on('error', (err) => {
        spinner.fail(chalk.red(`Failed to save file: ${err.message}`));
        reject(err);
      });
    });
  } catch (error) {
    spinner.fail(chalk.red(`Export failed: ${error.message}`));
    if (error.response?.status === 401) {
      console.log(chalk.yellow('Please run "insighta login" to authenticate.'));
    }
  }
}
