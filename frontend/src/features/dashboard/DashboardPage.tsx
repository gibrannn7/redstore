import { Link } from 'react-router-dom';
import MainLayout from '../../layouts/MainLayout';
import { useAuthStore } from '../../stores/useAuthStore';

export default function DashboardPage() {
    const { user } = useAuthStore();

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="font-heading text-3xl font-bold mb-8">Dashboard</h1>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Profile Card */}
                    <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 shadow-sm">
                         <h3 className="font-bold text-lg mb-4">Profile</h3>
                         <div className="flex items-center gap-4 mb-4">
                             <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold">
                                 {user?.name.charAt(0)}
                             </div>
                             <div>
                                 <p className="font-medium">{user?.name}</p>
                                 <p className="text-gray-500 text-sm">{user?.email}</p>
                             </div>
                         </div>
                         <Link to="/profile" className="text-primary hover:underline text-sm ml-auto block w-fit">Edit Profile</Link>
                    </div>

                     {/* Buyer Quick Links */}
                    <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 shadow-sm">
                         <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                         <ul className="space-y-3">
                             <li>
                                 <Link to="/orders" className="flex items-center gap-2 hover:text-primary transition-colors">
                                     <span>📦</span> My Orders
                                 </Link>
                             </li>
                             <li>
                                 <Link to="/cart" className="flex items-center gap-2 hover:text-primary transition-colors">
                                     <span>🛒</span> Shopping Cart
                                 </Link>
                             </li>
                             <li>
                                 <Link to="/chat" className="flex items-center gap-2 hover:text-primary transition-colors">
                                     <span>💬</span> Messages
                                 </Link>
                             </li>
                         </ul>
                    </div>
                </div>
            </div>
        </MainLayout>
    );
}
