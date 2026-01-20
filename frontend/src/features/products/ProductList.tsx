import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import axios from '../../app/axios';
import ProductCard from './ProductCard';
import MainLayout from '../../layouts/MainLayout';
import Input from '../../components/Input';

export default function ProductList() {
    const [search, setSearch] = useState('');
    const [sortBy, setSortBy] = useState('created_at');
    
    const { data, isLoading } = useQuery({
        queryKey: ['products', search, sortBy],
        queryFn: async () => {
            const params = new URLSearchParams();
            if (search) params.append('search', search);
            params.append('sort_by', sortBy);
            const response = await axios.get(`/products?${params.toString()}`);
            return response.data.data;
        }
    });

    return (
        <MainLayout>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <h1 className="font-heading text-3xl font-bold">All Products</h1>
                    
                    <div className="flex w-full md:w-auto gap-4">
                        <Input 
                             placeholder="Search..." 
                             value={search}
                             onChange={(e) => setSearch(e.target.value)}
                             className="min-w-[200px]"
                        />
                        <select 
                            className="px-4 py-2.5 rounded-lg border border-gray-300 bg-white dark:bg-dark-surface dark:border-dark-border"
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                        >
                            <option value="created_at">Newest</option>
                            <option value="base_price">Price</option>
                            <option value="sold_count">Popular</option>
                        </select>
                    </div>
                </div>

                {isLoading ? (
                    <div className="text-center py-12">Loading...</div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {data?.map((product: any) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                )}
            </div>
        </MainLayout>
    );
}
