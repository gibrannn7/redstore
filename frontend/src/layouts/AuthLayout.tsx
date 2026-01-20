import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useUIStore } from '../stores/useUIStore';

interface AuthLayoutProps {
  children: ReactNode;
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  const { isDarkMode } = useUIStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-dark-bg dark:to-dark-surface flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-block">
            <img 
              src={isDarkMode ? '/src/assets/logo/logo-darkmode.svg' : '/src/assets/logo/logo-primary.svg'} 
              alt="RedStore" 
              className="h-12 mx-auto"
            />
          </Link>
        </div>

        {/* Auth Card */}
        <div className="bg-white dark:bg-dark-surface rounded-2xl shadow-large p-8">
          {children}
        </div>

        {/* Back to Home */}
        <div className="text-center mt-6">
          <Link 
            to="/" 
            className="text-sm text-gray-600 dark:text-gray-400 hover:text-primary transition-colors"
          >
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
