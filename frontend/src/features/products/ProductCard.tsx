import { Link } from 'react-router-dom';
import { formatCurrency } from '../../utils/format';
import { useCart } from '../../hooks/useCart';
import Button from '../../components/Button';

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
  store: {
    name: string;
  };
}

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  
  const thumbnail = product.images.find(img => img.is_thumbnail) || product.images[0];
  const hasVideo = product.images.some(img => img.type === 'video');

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addToCart.mutate({
        product_id: product.id,
        quantity: 1
    });
  };

  return (
    <div className="bg-white dark:bg-dark-surface rounded-lg border border-gray-200 dark:border-dark-border overflow-hidden hover:shadow-medium transition-all duration-200 group">
      <Link to={`/products/${product.slug}`} className="block relative">
        <div className="aspect-square bg-gray-100 dark:bg-gray-800 relative overflow-hidden">
          {thumbnail ? (
            <img 
              src={thumbnail.url} 
              alt={product.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
          ) : (
             <div className="w-full h-full flex items-center justify-center text-gray-400">
                No Image
             </div>
          )}
          {hasVideo && (
            <div className="absolute top-2 right-2 bg-black/50 text-white p-1 rounded-full">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            </div>
          )}
        </div>
      </Link>
      
      <div className="p-4">
        <div className="text-sm text-gray-500 dark:text-gray-400 mb-1">{product.store.name}</div>
        <Link to={`/products/${product.slug}`}>
            <h3 className="font-medium text-gray-900 dark:text-white mb-2 line-clamp-2 hover:text-primary transition-colors">
              {product.name}
            </h3>
        </Link>
        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-primary">
            {formatCurrency(product.base_price)}
          </span>
          <Button size="sm" onClick={handleAddToCart}>
             Add
          </Button>
        </div>
      </div>
    </div>
  );
}
