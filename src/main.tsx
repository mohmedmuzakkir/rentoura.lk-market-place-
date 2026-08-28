import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { SplashScreen } from './components/SplashScreen';
import './index.css';
import { checkSupabaseConnection, isSupabaseConfigured } from './lib/supabase';
import { registerSW } from 'virtual:pwa-register';

registerSW({ immediate: true });

if (import.meta.env.DEV && isSupabaseConfigured) {
  checkSupabaseConnection().then((res) => {
    if (res.success) {
      console.log('[Supabase] Connection health check passed.');
    } else {
      console.warn('[Supabase] Connection health check warning:', res.message);
    }
  }).catch(() => {
    // Ignore error silently
  });
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <SplashScreen />
  </StrictMode>,
);

