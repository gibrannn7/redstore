import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from '../app/axios';
import MainLayout from '../layouts/MainLayout';
import ProductCard from '../features/products/ProductCard';

interface Category {
  id: number;
  name: string;
  slug: string;
  icon?: string;
}

interface Product {
  id: number;
  name: string;
  slug: string;
  base_price: number;
  images: Array<{
    id: number;
    url: string;
    is_thumbnail: boolean;
    type: 'image' | 'video';
  }>;
  store: { name: string };
}

export default function HomePage() {
  const { data: categories, isLoading: categoriesLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await axios.get<{ data: Category[] }>('/categories');
      return response.data.data;
    }
  });

  const { data: featuredProducts, isLoading: productsLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      const response = await axios.get<{ data: Product[] }>('/products?limit=8&sort_by=sold_count');
      return response.data.data;
    }
  });

  const categoryIcons: Record<string, string> = {
    'electronics': '📱',
    'fashion': '👕',
    'home-living': '🏠',
    'sports': '⚽',
    'beauty': '💄',
    'books': '📚',
    'toys': '🎮',
    'food': '🍔',
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-primary to-red-700 rounded-2xl p-12 text-white mb-12">
          <h1 className="font-heading text-5xl font-bold mb-4">
            Welcome to RedStore
          </h1>
          <p className="text-xl mb-6 opacity-90">
            Discover amazing products from trusted sellers
          </p>
          <Link 
            to="/products"
            className="inline-block bg-white text-primary px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Shop Now
          </Link>
        </div>

        {/* Categories */}
        <div className="mb-12">
          <h2 className="font-heading text-3xl font-bold mb-6">Shop by Category</h2>
          {categoriesLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-100 dark:bg-dark-surface rounded-lg p-6 animate-pulse h-24" />
              ))}
            </div>
          ) : categories && categories.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.slug}`}
                  className="bg-white dark:bg-dark-surface rounded-lg p-6 text-center hover:shadow-md transition-shadow cursor-pointer border border-gray-200 dark:border-dark-border"
                >
                  <div className="text-4xl mb-2">
                    {categoryIcons[category.slug] || '📦'}
                  </div>
                  <h3 className="font-semibold">{category.name}</h3>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No categories available
            </div>
          )}
        </div>

        {/* Featured Products */}
        <div>
          <div className="flex justify-between items-center mb-6">
            <h2 className="font-heading text-3xl font-bold">Featured Products</h2>
            <Link to="/products" className="text-primary hover:underline font-medium">
              View All
            </Link>
          </div>
          {productsLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-gray-100 dark:bg-dark-surface rounded-lg animate-pulse h-80" />
              ))}
            </div>
          ) : featuredProducts && featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-gray-50 dark:bg-dark-surface rounded-lg">
              <p className="text-gray-500 mb-4">No products available yet</p>
              <Link 
                to="/products" 
                className="text-primary hover:underline font-medium"
              >
                Browse all products
              </Link>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
