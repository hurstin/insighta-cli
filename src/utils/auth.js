import open from 'open';
import pkceChallenge from 'pkce-challenge';
import express from 'express';
import axios from 'axios';
import { saveCredentials } from './config.js';
import chalk from 'chalk';

export const login = async () => {
  const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
  const BACKEND_URL = process.env.INSIGHTA_BACKEND_URL;
  const REDIRECT_PORT = 8080;
  const REDIRECT_URI = `http://localhost:${REDIRECT_PORT}/callback`;

  const challenge = await pkceChallenge();
  const codeVerifier = challenge.code_verifier;
  const codeChallenge = challenge.code_challenge;

  const authUrl = new URL('https://github.com/login/oauth/authorize');
  authUrl.searchParams.append('client_id', GITHUB_CLIENT_ID);
  authUrl.searchParams.append('redirect_uri', REDIRECT_URI);
  authUrl.searchParams.append('code_challenge', codeChallenge);
  authUrl.searchParams.append('code_challenge_method', 'S256');
  authUrl.searchParams.append('scope', 'user:email');

  const app = express();
  
  return new Promise((resolve, reject) => {
    const server = app.listen(REDIRECT_PORT, async () => {
      console.log(chalk.blue('Opening browser for GitHub authentication...'));
      await open(authUrl.toString());
    });

    app.get('/callback', async (req, res) => {
      const { code, error } = req.query;

      if (error) {
        res.send('Authentication failed. You can close this window.');
        server.close();
        reject(new Error(`Auth error: ${error}`));
        return;
      }

      try {
        console.log(chalk.blue('Exchanging code for tokens...'));
        const response = await axios.post(`${BACKEND_URL}/v1/auth/github/cli-exchange`, {
          code,
          code_verifier: codeVerifier,
          redirect_uri: REDIRECT_URI,
        });

        const { access_token, refresh_token } = response.data;
        // The backend might not return expires_in, so we'll assume 15m as per backend code
        await saveCredentials({
          access_token,
          refresh_token,
          expires_at: Date.now() + 15 * 60 * 1000, 
        });

        res.send('Authentication successful! You can close this window.');
        console.log(chalk.green('Successfully logged in!'));
        server.close();
        resolve();
      } catch (err) {
        if (err.response) {
          console.error(chalk.red('Token exchange failed (Backend Error):'), err.response.data);
        } else if (err.request) {
          console.error(chalk.red('Token exchange failed (No response from backend):'), err.message);
        } else {
          console.error(chalk.red('Token exchange failed (Request Setup Error):'), err.message);
        }
        res.send('Authentication failed during token exchange. Check CLI output.');
        server.close();
        reject(err);
      }
    });
  });
};

export const refreshToken = async (storedRefreshToken) => {
  const BACKEND_URL = process.env.INSIGHTA_BACKEND_URL;
  try {
    const response = await axios.post(`${BACKEND_URL}/v1/auth/refresh`, {
      refresh_token: storedRefreshToken,
    });

    const { access_token, refresh_token, expires_in } = response.data;
    const newCredentials = {
      access_token,
      refresh_token: refresh_token || storedRefreshToken,
      expires_at: Date.now() + expires_in * 1000,
    };

    await saveCredentials(newCredentials);
    return access_token;
  } catch (error) {
    console.error(chalk.red('Failed to refresh token. Please login again.'));
    throw error;
  }
};
