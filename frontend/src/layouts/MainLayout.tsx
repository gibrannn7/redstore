import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useUIStore } from '../stores/useUIStore';

interface MainLayoutProps {
  children: ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
  const { user, isAuthenticated, logout } = useAuthStore();
  const { isDarkMode, toggleDarkMode } = useUIStore();

  return (
    <div className="min-h-screen bg-white dark:bg-dark-bg">
      {/* Navbar */}
      <nav className="sticky top-0 z-50 bg-white dark:bg-dark-surface border-b border-gray-200 dark:border-dark-border shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link to="/" className="flex items-center space-x-2">
              <img 
                src={isDarkMode ? '/src/assets/logo/logo-darkmode.svg' : '/src/assets/logo/logo-primary.svg'} 
                alt="RedStore" 
                className="h-8"
              />
            </Link>

            {/* Search */}
            <div className="flex-1 max-w-2xl mx-8">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search products..."
                  className="w-full px-4 py-2 pl-10 rounded-lg border border-gray-300 dark:border-dark-border bg-white dark:bg-dark-bg focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <img 
                  src="/src/assets/icons/search.svg" 
                  alt="Search" 
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 opacity-50"
                />
              </div>
            </div>

            {/* Right Menu */}
            <div className="flex items-center space-x-4">
              {/* Dark Mode Toggle */}
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                {isDarkMode ? '🌞' : '🌙'}
              </button>

              {/* Cart */}
              <Link 
                to="/cart" 
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors relative"
              >
                <img src="/src/assets/icons/cart-shopping.svg" alt="Cart" className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  0
                </span>
              </Link>

              {/* User Menu */}
              {isAuthenticated ? (
                <div className="flex items-center space-x-3">
                  <Link 
                    to="/dashboard" 
                    className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <img src="/src/assets/icons/dashboard.svg" alt="Dashboard" className="w-6 h-6" />
                    <span className="text-sm font-medium">{user?.name}</span>
                  </Link>
                  <button
                    onClick={logout}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <img src="/src/assets/icons/logout.svg" alt="Logout" className="w-6 h-6" />
                  </button>
                </div>
              ) : (
                <Link 
                  to="/login" 
                  className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-hover transition-colors"
                >
                  Login
                </Link>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="min-h-[calc(100vh-4rem)]">
        {children}
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-dark-surface border-t border-gray-200 dark:border-dark-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-heading font-semibold text-lg mb-4">RedStore</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Your one-stop marketplace for everything you need.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Shop</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link to="/products" className="hover:text-primary">All Products</Link></li>
                <li><Link to="/categories" className="hover:text-primary">Categories</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Account</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><Link to="/dashboard" className="hover:text-primary">Dashboard</Link></li>
                <li><Link to="/orders" className="hover:text-primary">Orders</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
                <li><a href="#" className="hover:text-primary">Help Center</a></li>
                <li><a href="#" className="hover:text-primary">Contact Us</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-200 dark:border-dark-border text-center text-sm text-gray-600 dark:text-gray-400">
            <p>&copy; 2026 RedStore. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
