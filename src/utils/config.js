import fs from 'fs-extra';
import path from 'path';
import os from 'os';

const CONFIG_DIR = path.join(os.homedir(), '.insighta');
const CREDENTIALS_FILE = path.join(CONFIG_DIR, 'credentials.json');

export const saveCredentials = async (credentials) => {
  await fs.ensureDir(CONFIG_DIR);
  await fs.writeJson(CREDENTIALS_FILE, credentials, { spaces: 2 });
};

export const loadCredentials = async () => {
  try {
    if (await fs.pathExists(CREDENTIALS_FILE)) {
      return await fs.readJson(CREDENTIALS_FILE);
    }
  } catch (error) {
    console.error('Error reading credentials:', error.message);
  }
  return null;
};

export const clearCredentials = async () => {
  try {
    if (await fs.pathExists(CREDENTIALS_FILE)) {
      await fs.remove(CREDENTIALS_FILE);
    }
  } catch (error) {
    console.error('Error clearing credentials:', error.message);
  }
};
