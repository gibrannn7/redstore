import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import axios from '../../app/axios';
import { useCart } from '../../hooks/useCart';
import MainLayout from '../../layouts/MainLayout';
import Button from '../../components/Button';
import Input from '../../components/Input';
import { formatCurrency } from '../../utils/format';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

export default function CheckoutPage() {
    const { cart, isLoading: cartLoading } = useCart();
    const navigate = useNavigate();
    const [address, setAddress] = useState('');

    useEffect(() => {
        // Load Midtrans Snap script
        const script = document.createElement('script');
        script.src = 'https://app.sandbox.midtrans.com/snap/snap.js';
        script.setAttribute('data-client-key', import.meta.env.VITE_MIDTRANS_CLIENT_KEY || 'SB-Mid-client-XXXXX'); // Safe fallback or env
        document.body.appendChild(script);

        return () => {
            document.body.removeChild(script);
        };
    }, []);

    const checkoutMutation = useMutation({
        mutationFn: async (data: { shipping_address: string }) => {
            const response = await axios.post('/user/orders', data);
            return response.data;
        },
        onSuccess: (data) => {
            // Assuming first order for simplicity in MVP, but Response wraps collection. 
            // Actually OrderService returns collection of orders (per store).
            // We need to handle multiple snaps? Midtrans Snap is usually per transaction. 
            // This multi-store logic splits into multiple orders/transactions.
            // For MVP, user pays one by one or we should aggregated?
            // Midtrans usually supports one transaction ID.
            // Backend `OrderService` creates array of orders and calls `createPayment` PER order.
            // So each order has a snap_token. We can only popup one.
            // Complex flow: Show list of created orders and "Pay" button for each?
            
            // Let's modify logic: Redirect to Orders page where user can pay each invoice.
            toast.success('Order placed successfully! Please complete payment.');
            navigate('/orders');
        },
        onError: (err: any) => {
            toast.error(err.response?.data?.message || 'Checkout failed');
        }
    });

    if (cartLoading) return <MainLayout><div className="p-8 text-center">Loading...</div></MainLayout>;
    if (!cart?.items?.length) return <MainLayout><div className="p-8 text-center">Empty Cart</div></MainLayout>;

    return (
        <MainLayout>
             <div className="max-w-3xl mx-auto px-4 py-8">
                <h1 className="font-heading text-3xl font-bold mb-8">Checkout</h1>
                
                <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 mb-6">
                    <h3 className="font-bold mb-4">Shipping Information</h3>
                    <div className="space-y-4">
                        <Input 
                            label="Address" 
                            value={address} 
                            onChange={(e) => setAddress(e.target.value)} 
                            required 
                            placeholder="Full address..."
                        />
                    </div>
                </div>

                <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 mb-6">
                    <h3 className="font-bold mb-4">Order Summary</h3>
                    <div className="flex justify-between text-xl font-bold">
                         <span>Total</span>
                         <span className="text-primary">{formatCurrency(cart.total_price)}</span>
                    </div>
                </div>

                <Button 
                    size="lg" 
                    className="w-full"
                    onClick={() => checkoutMutation.mutate({ shipping_address: address })}
                    disabled={!address || checkoutMutation.isPending}
                    isLoading={checkoutMutation.isPending}
                >
                    Place Order
                </Button>
             </div>
        </MainLayout>
    );
}
