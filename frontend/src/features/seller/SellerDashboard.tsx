import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from '../../app/axios';
import SellerLayout from '../../layouts/SellerLayout';
import Button from '../../components/Button';

export default function SellerDashboard() {
    const { data: store } = useQuery({
        queryKey: ['seller-store'],
        queryFn: async () => {
            const response = await axios.get('/seller/store');
            return response.data.data;
        }
    });

    return (
        <SellerLayout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="font-heading text-3xl font-bold">Seller Dashboard</h1>
                    <Link to="/seller/products/new">
                        <Button>Add New Product</Button>
                    </Link>
                </div>

                {store && (
                    <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-dark-border mb-8">
                        <div className="flex items-center gap-4">
                            <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full overflow-hidden">
                                {store.logo_url && <img src={store.logo_url} className="w-full h-full object-cover" />}
                            </div>
                            <div>
                                <h2 className="text-xl font-bold">{store.name}</h2>
                                <p className="text-gray-500">{store.slug}</p>
                            </div>
                            <div className="ml-auto">
                                <span className={`px-3 py-1 rounded-full text-sm ${
                                    store.is_verified ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {store.is_verified ? 'Verified' : 'Pending Verification'}
                                </span>
                            </div>
                        </div>
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <Link to="/seller/products" className="block p-6 bg-white dark:bg-dark-surface rounded-lg border border-gray-200 hover:border-primary transition-colors group">
                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary">Manage Products</h3>
                        <p className="text-gray-500">Add, edit, or remove products from your store.</p>
                    </Link>
                    
                    <Link to="/seller/orders" className="block p-6 bg-white dark:bg-dark-surface rounded-lg border border-gray-200 hover:border-primary transition-colors group">
                        <h3 className="text-lg font-bold mb-2 group-hover:text-primary">Manage Orders</h3>
                        <p className="text-gray-500">View and update status of incoming orders.</p>
                    </Link>
                </div>
            </div>
        </SellerLayout>
    );
}
