import { useQuery } from '@tanstack/react-query';
import axios from '../../app/axios';
import MainLayout from '../../layouts/MainLayout';
import { formatCurrency } from '../../utils/format';

export default function AdminDashboard() {
    const { data: stats } = useQuery({
        queryKey: ['admin-stats'],
        queryFn: async () => {
             const response = await axios.get('/admin/dashboard');
             return response.data.data;
        }
    });

    return (
        <MainLayout>
             <div className="max-w-7xl mx-auto px-4 py-8">
                 <h1 className="font-heading text-3xl font-bold mb-8">Admin Dashboard</h1>

                 <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
                     <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200">
                         <div className="text-gray-500 mb-1">Total Users</div>
                         <div className="text-3xl font-bold">{stats?.total_users}</div>
                     </div>
                     <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200">
                         <div className="text-gray-500 mb-1">Total Stores</div>
                         <div className="text-3xl font-bold">{stats?.total_stores}</div>
                     </div>
                     <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200">
                         <div className="text-gray-500 mb-1">Total Orders</div>
                         <div className="text-3xl font-bold">{stats?.total_orders}</div>
                     </div>
                     <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200">
                         <div className="text-gray-500 mb-1">Revenue</div>
                         <div className="text-3xl font-bold text-green-600">{stats ? formatCurrency(stats.total_revenue) : '-'}</div>
                     </div>
                 </div>

                 {/* Pending Stores Section could go here */}
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200">
                         <h3 className="font-bold mb-4">Recent Orders</h3>
                         <div className="space-y-4">
                             {stats?.recent_orders.map((order: any) => (
                                 <div key={order.id} className="flex justify-between items-center border-b pb-2 last:border-0">
                                     <div>
                                         <div className="font-medium">{order.invoice_number}</div>
                                         <div className="text-sm text-gray-500">{order.user.name}</div>
                                     </div>
                                     <div className="font-bold">{formatCurrency(order.total_amount)}</div>
                                 </div>
                             ))}
                         </div>
                     </div>
                 </div>
             </div>
        </MainLayout>
    );
}
