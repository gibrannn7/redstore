import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../../app/axios';
import SellerLayout from '../../layouts/SellerLayout';
import Button from '../../components/Button';
import { formatCurrency } from '../../utils/format';
import toast from 'react-hot-toast';

export default function SellerProductList() {
    const queryClient = useQueryClient();
    const { data: products, isLoading } = useQuery({
        queryKey: ['seller-products'],
        queryFn: async () => {
            const response = await axios.get('/seller/products');
            return response.data.data;
        }
    });

    const deleteMutation = useMutation({
        mutationFn: async (id: number) => {
            await axios.delete(`/seller/products/${id}`);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['seller-products'] });
            toast.success('Product deleted');
        }
    });

    if (isLoading) return <SellerLayout><div className="p-8 text-center">Loading...</div></SellerLayout>;

    return (
        <SellerLayout>
            <div className="max-w-7xl mx-auto px-4 py-8">
                 <div className="flex justify-between items-center mb-8">
                    <h1 className="font-heading text-3xl font-bold">My Products</h1>
                    <Link to="/seller/products/new">
                        <Button>+ Add Product</Button>
                    </Link>
                </div>

                <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 overflow-hidden">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 dark:bg-gray-800 border-b dark:border-gray-700">
                            <tr>
                                <th className="p-4">Product</th>
                                <th className="p-4">Price</th>
                                <th className="p-4">Stock</th>
                                <th className="p-4">Sales</th>
                                <th className="p-4 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                            {products?.map((product: any) => (
                                <tr key={product.id}>
                                    <td className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 bg-gray-100 rounded overflow-hidden">
                                                {product.images?.[0] && <img src={product.images[0].url} className="w-full h-full object-cover" />}
                                            </div>
                                            <div>
                                                <div className="font-medium">{product.name}</div>
                                                <div className="text-sm text-gray-500">{product.category.name}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="p-4">{formatCurrency(product.base_price)}</td>
                                    <td className="p-4">{product.stock_quantity}</td>
                                    <td className="p-4">{product.sold_count}</td>
                                    <td className="p-4 text-right space-x-2">
                                        <Link to={`/seller/products/${product.id}/edit`}>
                                            <button className="text-blue-600 hover:underline">Edit</button>
                                        </Link>
                                        <button 
                                            onClick={() => {
                                                if(confirm('Delete this product?')) deleteMutation.mutate(product.id);
                                            }}
                                            className="text-red-600 hover:underline"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </SellerLayout>
    );
}
