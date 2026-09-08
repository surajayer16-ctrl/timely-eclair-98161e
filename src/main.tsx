import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { LanguageProvider } from './context/LanguageContext';
import './index.css';

// Silence benign development HMR websocket connection errors in sandboxed preview iframes
if (typeof window !== 'undefined') {
  const isWebsocketError = (msg: string) => {
    return (
      msg.toLowerCase().includes('websocket') ||
      msg.toLowerCase().includes('ws://') ||
      msg.toLowerCase().includes('wss://') ||
      msg.includes('[vite] failed to connect')
    );
  };

  const originalConsoleError = console.error;
  console.error = (...args: any[]) => {
    const firstArg = args[0] ? String(args[0]) : '';
    if (isWebsocketError(firstArg)) {
      return;
    }
    originalConsoleError.apply(console, args);
  };

  const originalConsoleWarn = console.warn;
  console.warn = (...args: any[]) => {
    const firstArg = args[0] ? String(args[0]) : '';
    if (isWebsocketError(firstArg)) {
      return;
    }
    originalConsoleWarn.apply(console, args);
  };

  window.addEventListener('unhandledrejection', (event) => {
    const reason = event.reason;
    const message = reason?.message || String(reason || '');
    if (isWebsocketError(message)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });

  window.addEventListener('error', (event) => {
    const message = event.message || '';
    if (isWebsocketError(message)) {
      event.preventDefault();
      event.stopImmediatePropagation();
    }
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <LanguageProvider>
      <App />
    </LanguageProvider>
  </StrictMode>,
);

