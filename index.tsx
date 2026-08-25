import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles.css';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);

// Keep the static SEO fallback hidden only until React replaces it.
const revealApp = () => {
  document.documentElement.classList.remove('app-loading');
};

let mountObserver: MutationObserver | null = null;
if (typeof MutationObserver === 'function') {
  mountObserver = new MutationObserver(() => {
    mountObserver?.disconnect();
    revealApp();
  });
  mountObserver.observe(rootElement, { childList: true });
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Safety fallback so the page is never left hidden if mounting is interrupted.
window.setTimeout(() => {
  mountObserver?.disconnect();
  revealApp();
}, 2000);
