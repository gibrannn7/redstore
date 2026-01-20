import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import { useAuthStore } from '../../stores/useAuthStore';

export default function DashboardPage() {
    const { user } = useAuthStore();

    const isSeller = user?.roles.includes('seller');
    const isAdmin = user?.roles.includes('super_admin');

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="font-heading text-3xl font-bold mb-8">Dashboard</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-dark-border shadow-sm">
                         <h3 className="font-bold text-lg mb-4">Profile</h3>
                         <div className="flex items-center gap-4 mb-4">
                             <div className="w-16 h-16 bg-primary/10 text-primary rounded-full flex items-center justify-center text-xl font-bold">
                                 {user?.name.charAt(0)}
                             </div>
                             <div>
                                 <p className="font-medium">{user?.name}</p>
                                 <p className="text-gray-500 text-sm">{user?.email}</p>
                                 <div className="flex gap-1 mt-1">
                                     {user?.roles.map(role => (
                                         <span key={role} className="text-xs bg-gray-100 dark:bg-gray-800 px-2 py-0.5 rounded">
                                             {role}
                                         </span>
                                     ))}
                                 </div>
                             </div>
                         </div>
                    </div>

                     {/* Buyer Quick Links */}
                    <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-dark-border shadow-sm">
                         <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                         <ul className="space-y-3">
                             <li>
                                 <Link to="/orders" className="flex items-center gap-2 hover:text-primary transition-colors">
                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                     </svg>
                                     My Orders
                                 </Link>
                             </li>
                             <li>
                                 <Link to="/cart" className="flex items-center gap-2 hover:text-primary transition-colors">
                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                     </svg>
                                     Shopping Cart
                                 </Link>
                             </li>
                             <li>
                                 <Link to="/chat" className="flex items-center gap-2 hover:text-primary transition-colors">
                                     <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                                     </svg>
                                     Messages
                                 </Link>
                             </li>
                         </ul>
                    </div>

                    {/* Seller Quick Links */}
                    {isSeller && (
                        <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-dark-border shadow-sm">
                             <h3 className="font-bold text-lg mb-4">Seller Center</h3>
                             <ul className="space-y-3">
                                 <li>
                                     <Link to="/seller/dashboard" className="flex items-center gap-2 hover:text-primary transition-colors">
                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                                         </svg>
                                         Seller Dashboard
                                     </Link>
                                 </li>
                                 <li>
                                     <Link to="/seller/products" className="flex items-center gap-2 hover:text-primary transition-colors">
                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                                         </svg>
                                         My Products
                                     </Link>
                                 </li>
                                 <li>
                                     <Link to="/seller/orders" className="flex items-center gap-2 hover:text-primary transition-colors">
                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                         </svg>
                                         Incoming Orders
                                     </Link>
                                 </li>
                             </ul>
                        </div>
                    )}

                    {/* Admin Quick Links */}
                    {isAdmin && (
                        <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-dark-border shadow-sm">
                             <h3 className="font-bold text-lg mb-4">Admin Panel</h3>
                             <ul className="space-y-3">
                                 <li>
                                     <Link to="/admin/dashboard" className="flex items-center gap-2 hover:text-primary transition-colors">
                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                                         </svg>
                                         Admin Dashboard
                                     </Link>
                                 </li>
                                 <li>
                                     <Link to="/admin/users" className="flex items-center gap-2 hover:text-primary transition-colors">
                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                         </svg>
                                         Manage Users
                                     </Link>
                                 </li>
                                 <li>
                                     <Link to="/admin/stores" className="flex items-center gap-2 hover:text-primary transition-colors">
                                         <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                         </svg>
                                         Manage Stores
                                     </Link>
                                 </li>
                             </ul>
                        </div>
                    )}
                </div>
            </div>
        </MainLayout>
    );
}
