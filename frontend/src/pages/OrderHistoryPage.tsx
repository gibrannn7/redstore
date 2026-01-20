import { useQuery } from '@tanstack/react-query';
import axios from '../app/axios';
import MainLayout from '../layouts/MainLayout';
import { formatCurrency } from '../utils/format';
import Button from '../components/Button';

declare global {
    interface Window {
        snap: any;
    }
}

export default function OrderHistoryPage() {
    const { data: orders, isLoading } = useQuery({
        queryKey: ['orders'],
        queryFn: async () => {
             const response = await axios.get('/user/orders');
             return response.data.data;
        }
    });

    const handlePay = (snapToken: string) => {
        if (window.snap) {
            window.snap.pay(snapToken, {
                onSuccess: function(result: any){
                    alert("Payment success!");
                    window.location.reload(); 
                },
                onPending: function(result: any){
                    alert("Wating your payment!"); 
                },
                onError: function(result: any){
                    alert("Payment failed!"); 
                }
            });
        } else {
            alert('Midtrans SNAP not loaded');
        }
    };


    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="font-heading text-3xl font-bold mb-8">My Orders</h1>
                
                {isLoading ? <div>Loading...</div> : (
                   <div className="space-y-6">
                       {orders?.map((order: any) => (
                           <div key={order.id} className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 flex flex-col md:flex-row justify-between gap-6">
                               <div className="flex-1">
                                   <div className="flex items-center gap-4 mb-4">
                                       <span className="font-bold text-lg">{order.invoice_number}</span>
                                       <span className={`px-2 py-1 rounded text-xs ${
                                           order.payment_status === 'paid' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                                       }`}>
                                           {order.payment_status.toUpperCase()}
                                       </span>
                                   </div>
                                   <div className="text-sm text-gray-500 mb-2">Store: {order.store.name}</div>
                                   
                                   <div className="space-y-2">
                                       {order.items.map((item: any) => (
                                           <div key={item.id} className="flex gap-4">
                                               <img src={item.image} className="w-12 h-12 object-cover rounded" />
                                               <div>
                                                   <div className="font-medium">{item.product_name}</div>
                                                   <div className="text-sm text-gray-500">x{item.quantity} - {formatCurrency(item.price)}</div>
                                               </div>
                                           </div>
                                       ))}
                                   </div>
                               </div>
                               
                               <div className="flex flex-col items-end justify-between">
                                   <div className="text-xl font-bold text-primary mb-4">
                                       {formatCurrency(order.total_amount)}
                                   </div>
                                   {order.payment_status === 'pending' && order.snap_token && (
                                       <Button onClick={() => handlePay(order.snap_token)}>
                                           Pay Now
                                       </Button>
                                   )}
                               </div>
                           </div>
                       ))}
                   </div>
                )}
            </div>
        </MainLayout>
    );
}
