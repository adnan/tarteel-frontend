const isGitHubDeploy = process.env.NOW_GITHUB_DEPLOYMENT == 1;

const env = {
  development: {
    TARTEEL_API_KEY: 'be5f3eaa01c226b0faa570e5a92ddca33ab51052',
    RECOGNITION_SERVER_URL: 'http://localhost:5000',
    TRANSCRIBE_SERVER_URL: 'http://localhost:5000',
    API_URL: 'http://localhost:8000',
  },
  staging: {
    TARTEEL_API_KEY: process.env.STAGING_TARTEEL_API_KEY,
    RECOGNITION_SERVER_URL: process.env.STAGING_RECOGNITION_SERVER_URL,
    TRANSCRIBE_SERVER_URL: process.env.STAGING_TRANSCRIBE_SERVER_URL,
    API_URL: process.env.STAGING_API_URL,
  },
  production: {
    TARTEEL_API_KEY: process.env.TARTEEL_API_KEY,
    RECOGNITION_SERVER_URL: process.env.RECOGNITION_SERVER_URL,
    TRANSCRIBE_SERVER_URL: process.env.TRANSCRIBE_SERVER_URL,
    API_URL: process.env.API_URL,
  },
};

const currentEnv = isGitHubDeploy
  ? env.staging
  : env[process.env.DEPLOYMENT] || env.development;

/**
 * Gets a string environment variable by the given name.
 *
 * @param  {String} name - The name of the environment variable.
 * @param  {String} defaultVal - The default value to use.
 *
 * @return {String} The value.
 */
export function string(name, defaultVal) {
  return currentEnv[name] || defaultVal;
}

/**
 * Gets a number environment variable by the given name.
 *
 * @param  {String} name - The name of the environment variable.
 * @param  {number} defaultVal - The default value to use.
 *
 * @return {number} The value.
 */
export function number(name, defaultVal) {
  return currentEnv[name] ? parseInt(currentEnv[name], 10) : defaultVal;
}

export function bool(name, defaultVal) {
  return currentEnv[name]
    ? currentEnv[name] === 'true' || currentEnv[name] === '1'
    : defaultVal;
}
