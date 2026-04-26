import api from '../utils/api.js';
import chalk from 'chalk';
import ora from 'ora';

export default async function profilesCommand() {
  const spinner = ora('Fetching profiles...').start();
  try {
    const response = await api.get('/v1/profiles');
    spinner.stop();
    
    console.log(chalk.bold.cyan('\n--- Profiles ---'));
    if (Array.isArray(response.data)) {
      response.data.forEach((profile, index) => {
        console.log(`${index + 1}. ${chalk.yellow(profile.name || 'N/A')} (${profile.email || 'No Email'})`);
      });
    } else {
      console.log(JSON.stringify(response.data, null, 2));
    }
    console.log('\n');
  } catch (error) {
    spinner.fail(chalk.red(`Failed to fetch profiles: ${error.message}`));
    if (error.response?.status === 401) {
      console.log(chalk.yellow('Please run "insighta login" to authenticate.'));
    }
  }
}
