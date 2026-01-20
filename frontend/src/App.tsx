import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from 'react-hot-toast';
import { queryClient } from './app/queryClient';
import { useUIStore } from './stores/useUIStore';
import { useEffect } from 'react';
import { ProtectedRoute, SellerRoute, AdminRoute } from './components/RouteGuards';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProductList from './features/products/ProductList';
import ProductDetail from './features/products/ProductDetail';
import CartPage from './features/cart/CartPage';
import CheckoutPage from './features/checkout/CheckoutPage';
import OrderHistoryPage from './pages/OrderHistoryPage';
import ChatListPage from './features/chat/ChatListPage';
import ChatWindowPage from './features/chat/ChatWindowPage';
import DashboardPage from './features/dashboard/DashboardPage';
import SellerDashboard from './features/seller/SellerDashboard';
import SellerProductList from './features/seller/SellerProductList';
import SellerProductForm from './features/seller/SellerProductForm';
import SellerOrderList from './features/seller/SellerOrderList';
import AdminDashboard from './features/admin/AdminDashboard';
import AdminUserList from './features/admin/AdminUserList';
import AdminStoreList from './features/admin/AdminStoreList';
import './index.css';

function App() {
  const { isDarkMode, setDarkMode } = useUIStore();

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
          
          {/* Public product browsing */}
          <Route path="/products" element={<ProductList />} />
          <Route path="/products/:slug" element={<ProductDetail />} />
          
          {/* Protected user routes */}
          <Route path="/cart" element={<ProtectedRoute><CartPage /></ProtectedRoute>} />
          <Route path="/checkout" element={<ProtectedRoute><CheckoutPage /></ProtectedRoute>} />
          <Route path="/orders" element={<ProtectedRoute><OrderHistoryPage /></ProtectedRoute>} />
          <Route path="/chat" element={<ProtectedRoute><ChatListPage /></ProtectedRoute>} />
          <Route path="/chat/:id" element={<ProtectedRoute><ChatWindowPage /></ProtectedRoute>} />
          <Route path="/dashboard" element={<ProtectedRoute><DashboardPage /></ProtectedRoute>} />

          {/* Seller Routes - Protected */}
          <Route path="/seller/dashboard" element={<SellerRoute><SellerDashboard /></SellerRoute>} />
          <Route path="/seller/products" element={<SellerRoute><SellerProductList /></SellerRoute>} />
          <Route path="/seller/products/new" element={<SellerRoute><SellerProductForm /></SellerRoute>} />
          <Route path="/seller/products/:id/edit" element={<SellerRoute><SellerProductForm /></SellerRoute>} />
          <Route path="/seller/orders" element={<SellerRoute><SellerOrderList /></SellerRoute>} />

          {/* Admin Routes - Protected */}
          <Route path="/admin/dashboard" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
          <Route path="/admin/users" element={<AdminRoute><AdminUserList /></AdminRoute>} />
          <Route path="/admin/stores" element={<AdminRoute><AdminStoreList /></AdminRoute>} />
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
