import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

const pageInputs = {
  main: path.resolve(__dirname, 'index.html'),
  about: path.resolve(__dirname, 'about/index.html'),
  whatWeCare: path.resolve(__dirname, 'what-we-care/index.html'),
  researchUpdate: path.resolve(__dirname, 'research-update/index.html'),
  team: path.resolve(__dirname, 'team/index.html'),
  outputResources: path.resolve(__dirname, 'output-resources/index.html'),
  getInvolved: path.resolve(__dirname, 'get-involved/index.html'),
  contact: path.resolve(__dirname, 'contact/index.html'),
  privacyPolicy: path.resolve(__dirname, 'privacy-policy/index.html'),
  termsOfUse: path.resolve(__dirname, 'terms-of-use/index.html'),
  accessibility: path.resolve(__dirname, 'accessibility/index.html'),
  researchEthics: path.resolve(__dirname, 'research-ethics/index.html'),
  upcomingWorkshops: path.resolve(__dirname, 'upcomingworkshops/index.html'),
};

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  const repositoryName = process.env.GITHUB_REPOSITORY?.split('/')[1];
  const isGitHubUserOrOrgPage = repositoryName?.toLowerCase().endsWith('.github.io');
  const configuredBase = env.VITE_BASE_PATH || (process.env.GITHUB_ACTIONS && repositoryName
    ? (isGitHubUserOrOrgPage ? '/' : `/${repositoryName}/`)
    : './');

  return {
    base: configuredBase,
    server: {
      port: 3000,
      host: '0.0.0.0',
    },
    plugins: [react()],
    define: {
      'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
      'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
    },
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      }
    },
    build: {
      rollupOptions: {
        input: pageInputs,
      },
    },
  };
});
