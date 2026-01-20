import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useUIStore } from '../stores/useUIStore';

interface SellerLayoutProps {
  children: ReactNode;
}

const menuItems = [
  { path: '/seller/dashboard', label: 'Dashboard', icon: 'M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6' },
  { path: '/seller/products', label: 'Products', icon: 'M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4' },
  { path: '/seller/orders', label: 'Orders', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' },
];

export default function SellerLayout({ children }: SellerLayoutProps) {
  const { user, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useUIStore();
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-dark-bg">
      {/* Sidebar */}
      <aside className="fixed inset-y-0 left-0 w-64 bg-white dark:bg-dark-surface border-r border-gray-200 dark:border-dark-border z-30">
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="h-16 flex items-center justify-center border-b border-gray-200 dark:border-dark-border">
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src={isDarkMode ? '/src/assets/logo/logo-darkmode.svg' : '/src/assets/logo/logo-primary.svg'} 
                alt="RedStore" 
                className="h-8"
              />
            </Link>
          </div>

          {/* Menu */}
          <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
            <div className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4 px-3">
              Seller Center
            </div>
            {menuItems.map((item) => {
              const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/');
              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
                    isActive
                      ? 'bg-primary text-white'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={item.icon} />
                  </svg>
                  <span className="font-medium">{item.label}</span>
                </Link>
              );
            })}

            {/* Quick Add Product */}
            <Link
              to="/seller/products/new"
              className="flex items-center gap-3 px-3 py-2.5 mt-4 rounded-lg bg-primary/10 text-primary hover:bg-primary/20 transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              <span className="font-medium">Add Product</span>
            </Link>
          </nav>

          {/* User */}
          <div className="p-4 border-t border-gray-200 dark:border-dark-border">
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold">
                {user?.name.charAt(0)}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate">{user?.name}</p>
                <p className="text-xs text-gray-500 truncate">{user?.email}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={toggleDarkMode}
                className="flex-1 p-2 text-sm rounded-lg border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                {isDarkMode ? 'Light' : 'Dark'}
              </button>
              <button
                onClick={logout}
                className="flex-1 p-2 text-sm rounded-lg border border-gray-200 dark:border-dark-border hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors text-red-600"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="ml-64">
        {/* Top Bar */}
        <header className="h-16 bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border flex items-center justify-between px-6">
          <h1 className="text-lg font-semibold">Seller Center</h1>
          <Link to="/" className="text-sm text-primary hover:underline">
            Back to Store
          </Link>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
