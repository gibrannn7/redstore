import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from '../app/axios';
import toast from 'react-hot-toast';

export interface CartItem {
  id: number;
  quantity: number;
  price_at_add: number;
  subtotal: number;
  product: {
    id: number;
    name: string;
    slug: string;
    base_price: number;
    thumbnail?: string;
  };
  variant?: {
    id: number;
    name: string;
    value: string;
  };
}

export interface Cart {
  id: number;
  total_price: number;
  items: CartItem[];
  items_count: number;
}

export function useCart() {
  const queryClient = useQueryClient();

  const { data: cart, isLoading } = useQuery({
    queryKey: ['cart'],
    queryFn: async () => {
      const response = await axios.get<{ data: Cart }>('/user/cart');
      return response.data.data;
    },
    // Only fetch if token exists / user is logged in
    enabled: !!localStorage.getItem('redstore_token'),
  });

  const addToCart = useMutation({
    mutationFn: async (data: { product_id: number; quantity: number; product_variant_id?: number }) => {
      const response = await axios.post('/user/cart', data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Added to cart');
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Failed to add to cart');
    },
  });

  const updateQuantity = useMutation({
    mutationFn: async ({ itemId, quantity }: { itemId: number; quantity: number }) => {
      const response = await axios.put(`/user/cart/${itemId}`, { quantity });
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
    },
  });

  const removeItem = useMutation({
    mutationFn: async (itemId: number) => {
      await axios.delete(`/user/cart/${itemId}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart'] });
      toast.success('Removed from cart');
    },
  });

  return {
    cart,
    isLoading,
    addToCart,
    updateQuantity,
    removeItem,
  };
}
