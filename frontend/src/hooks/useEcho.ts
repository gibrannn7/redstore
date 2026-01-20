import { useEffect, useState } from 'react';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { useAuthStore } from '../stores/useAuthStore';

// Declare global Echo interface
declare global {
  interface Window {
    Pusher: any;
    Echo: Echo;
  }
}

export function useEcho() {
  const [echo, setEcho] = useState<Echo | null>(null);
  const { token } = useAuthStore();

  useEffect(() => {
    if (token && !window.Echo) {
      window.Pusher = Pusher;

      window.Echo = new Echo({
        broadcaster: 'reverb',
        key: import.meta.env.VITE_REVERB_APP_KEY,
        wsHost: import.meta.env.VITE_REVERB_HOST,
        wsPort: import.meta.env.VITE_REVERB_PORT ?? 80,
        wssPort: import.meta.env.VITE_REVERB_PORT ?? 443,
        forceTLS: (import.meta.env.VITE_REVERB_SCHEME ?? 'https') === 'https',
        enabledTransports: ['ws', 'wss'],
        authEndpoint: `${import.meta.env.VITE_API_URL}/broadcasting/auth`,
        auth: {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      });

      setEcho(window.Echo);
    }

    return () => {
      if (window.Echo) {
        // Optional: Disconnect logic if needed, but usually keep alive for SPA
      }
    };
  }, [token]);

  return echo;
}
