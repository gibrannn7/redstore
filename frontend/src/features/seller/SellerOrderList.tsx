import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../app/axios';
import SellerLayout from '../../layouts/SellerLayout';
import { formatCurrency } from '../../utils/format';
import toast from 'react-hot-toast';

export default function SellerOrderList() {
    const queryClient = useQueryClient();
    const { data: orders, isLoading } = useQuery({
        queryKey: ['seller-orders'],
        queryFn: async () => {
            const response = await axios.get('/seller/orders');
            return response.data.data;
        }
    });

    const statusMutation = useMutation({
        mutationFn: async ({ id, status }: { id: number; status: string }) => {
            await axios.put(`/seller/orders/${id}/status`, { status });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['seller-orders'] });
            toast.success('Order status updated');
        }
    });

    if (isLoading) return <SellerLayout><div className="p-8 text-center">Loading...</div></SellerLayout>;

    return (
        <SellerLayout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                <h1 className="font-heading text-3xl font-bold mb-8">Incoming Orders</h1>

                <div className="space-y-6">
                    {orders?.map((order: any) => (
                        <div key={order.id} className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200">
                             <div className="flex justify-between items-start mb-4">
                                 <div>
                                     <h3 className="font-bold text-lg">{order.invoice_number}</h3>
                                     <p className="text-sm text-gray-500">Customer: {order.user.name}</p>
                                     <p className="text-sm text-gray-500">Date: {new Date(order.created_at).toLocaleDateString()}</p>
                                 </div>
                                 <div className="text-right">
                                     <div className="font-bold text-primary text-xl">{formatCurrency(order.total_amount)}</div>
                                     <div className={`text-sm ${order.payment_status === 'paid' ? 'text-green-600' : 'text-yellow-600'}`}>
                                         Payment: {order.payment_status.toUpperCase()}
                                     </div>
                                 </div>
                             </div>

                             <div className="border-t border-b py-4 mb-4 space-y-2">
                                 {order.items.map((item: any) => (
                                     <div key={item.id} className="flex justify-between">
                                         <span>{item.product.name} x {item.quantity}</span>
                                         <span>{formatCurrency(item.subtotal)}</span>
                                     </div>
                                 ))}
                             </div>

                             <div className="flex justify-between items-center">
                                 <div className="flex items-center gap-2">
                                     <span className="text-sm font-medium">Status:</span>
                                     <select 
                                         className="border rounded px-2 py-1 text-sm dark:bg-dark-bg"
                                         value={order.status}
                                         onChange={(e) => statusMutation.mutate({ id: order.id, status: e.target.value })}
                                     >
                                         <option value="pending">Pending</option>
                                         <option value="processing">Processing</option>
                                         <option value="shipped">Shipped</option>
                                         <option value="delivered">Delivered</option>
                                         <option value="cancelled">Cancelled</option>
                                     </select>
                                 </div>
                                 <div>
                                     {/* Could add input for Tracking Number here when shipped */}
                                 </div>
                             </div>
                        </div>
                    ))}
                </div>
            </div>
        </SellerLayout>
    );
}
