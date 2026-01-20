import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from './app/queryClient';
import { useUIStore } from './stores/useUIStore';
import { useEffect } from 'react';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import './index.css';

function App() {
  const { isDarkMode, setDarkMode } = useUIStore();

  // Initialize dark mode on mount
  useEffect(() => {
    const stored = localStorage.getItem('redstore_dark_mode');
    if (stored) {
      const darkMode = JSON.parse(stored).state.isDarkMode;
      setDarkMode(darkMode);
    }
  }, [setDarkMode]);

  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 3000,
            style: {
              background: isDarkMode ? '#16161A' : '#fff',
              color: isDarkMode ? '#fff' : '#111827',
            },
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
