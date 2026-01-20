import { useCart } from '../../hooks/useCart';
import MainLayout from '../../layouts/MainLayout';
import { formatCurrency } from '../../utils/format';
import Button from '../../components/Button';
import { useNavigate } from 'react-router-dom';

export default function CartPage() {
    const { cart, isLoading, updateQuantity, removeItem } = useCart();
    const navigate = useNavigate();

    if (isLoading) return <MainLayout><div className="p-8 text-center">Loading...</div></MainLayout>;

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <h1 className="font-heading text-3xl font-bold mb-8">Shopping Cart</h1>

                {(!cart?.items || cart.items.length === 0) ? (
                    <div className="text-center py-12 bg-gray-50 dark:bg-dark-surface rounded-lg">
                        <p className="text-gray-500 mb-4">Your cart is empty</p>
                        <Button onClick={() => navigate('/products')}>Browse Products</Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        <div className="lg:col-span-2 space-y-4">
                            {cart.items.map((item) => (
                                <div key={item.id} className="bg-white dark:bg-dark-surface p-4 rounded-lg border border-gray-200 dark:border-dark-border flex gap-4">
                                    <div className="w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-md overflow-hidden flex-shrink-0">
                                        {item.product.thumbnail && (
                                            <img src={item.product.thumbnail} alt={item.product.name} className="w-full h-full object-cover" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-lg">{item.product.name}</h3>
                                        {item.variant && (
                                            <p className="text-sm text-gray-500 mb-2">Variant: {item.variant.value}</p>
                                        )}
                                        <div className="text-primary font-bold">
                                            {formatCurrency(item.price_at_add)}
                                        </div>
                                    </div>
                                    <div className="flex flex-col justify-between items-end">
                                        <button 
                                            onClick={() => removeItem.mutate(item.id)}
                                            className="text-red-500 hover:text-red-700 text-sm"
                                        >
                                            Remove
                                        </button>
                                        <div className="flex items-center space-x-2">
                                            <button 
                                                className="w-8 h-8 rounded border flex items-center justify-center"
                                                onClick={() => updateQuantity.mutate({ itemId: item.id, quantity: Math.max(1, item.quantity - 1) })}
                                            >-</button>
                                            <span className="w-8 text-center">{item.quantity}</span>
                                            <button 
                                                className="w-8 h-8 rounded border flex items-center justify-center"
                                                onClick={() => updateQuantity.mutate({ itemId: item.id, quantity: item.quantity + 1 })}
                                            >+</button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="bg-white dark:bg-dark-surface p-6 rounded-lg border border-gray-200 dark:border-dark-border h-fit sticky top-24">
                            <h3 className="font-heading text-xl font-bold mb-4">Order Summary</h3>
                            <div className="space-y-2 mb-6 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-600 dark:text-gray-400">Total Items</span>
                                    <span>{cart.items_count}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold border-t pt-4 mt-4">
                                    <span>Total Price</span>
                                    <span className="text-primary">{formatCurrency(cart.total_price)}</span>
                                </div>
                            </div>
                            <Button className="w-full" onClick={() => navigate('/checkout')}>
                                Checkout
                            </Button>
                        </div>
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
