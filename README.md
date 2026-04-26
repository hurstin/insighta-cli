# Insighta CLI

A powerful Node.js CLI tool for **Insighta Labs+**, designed to interact with the Insighta backend ecosystem. It provides secure authentication, profile management, and data export capabilities.

## 🚀 Features

- **Secure Authentication**: OAuth 2.0 with PKCE (Proof Key for Code Exchange) using GitHub.
- **Credential Management**: Securely stores Access and Refresh tokens locally in `~/.insighta/credentials.json`.
- **Automatic Token Refresh**: Transparently handles expired sessions by calling the backend's refresh endpoint.
- **Data Export**: Stream large profile datasets directly to CSV files.
- **Aesthetic UI**: Modern CLI interface using `chalk`, `ora` spinners, and clear logging.

## 🛠 Installation

### Prerequisites
- Node.js (v18 or higher)
- A running instance of the Insighta Backend

### Setup
1. Clone the repository:
   ```bash
   git clone https://github.com/hurstin/insighta-cli.git
   cd insighta-cli
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Link the CLI globally:
   ```bash
   npm link
   ```

## ⚙️ Configuration

Create a `.env` file in the root directory (or use `config.env`):

```env
INSIGHTA_BACKEND_URL=http://localhost:3000
GITHUB_CLIENT_ID=your_github_client_id
```

## 📖 Usage

### Login
Authenticate with your GitHub account. This will open your default browser.
```bash
insighta login
```

### View Profiles
Fetch and display demographic intelligence profiles.
```bash
insighta profiles
```

### Export Data
Export profiles to a local CSV file. Note: This requires **ADMIN** privileges.
```bash
# Export with default filename
insighta export

# Export to a specific path
insighta export --output data/profiles.csv
```

## 🏗 Project Structure

- `bin/index.js`: Entry point and command definitions.
- `src/commands/`: Command handlers for login, profiles, and export.
- `src/utils/`:
  - `api.js`: Axios instance with auth/refresh interceptors.
  - `auth.js`: OAuth PKCE logic and GitHub exchange.
  - `config.js`: File-based credential storage management.

## 📄 License
ISC
