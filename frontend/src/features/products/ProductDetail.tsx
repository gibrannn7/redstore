import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from '../../app/axios';
import { formatCurrency } from '../../utils/format';
import { useCart } from '../../hooks/useCart';
import Button from '../../components/Button';
import MainLayout from '../../layouts/MainLayout';

interface ProductDetail {
  id: number;
  name: string;
  description: string;
  base_price: number;
  stock_quantity: number;
  images: Array<{
    id: number;
    url: string;
    type: 'image' | 'video';
  }>;
  variants: Array<{
    id: number;
    name: string;
    value: string;
    price_adjustment: number;
    stock_adjustment: number;
  }>;
  store: {
    name: string;
    slug: string;
  };
}

export default function ProductDetail() {
  const { slug } = useParams();
  const { addToCart } = useCart();
  const [selectedImage, setSelectedImage] = useState<number>(0);
  const [selectedVariant, setSelectedVariant] = useState<number | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', slug],
    queryFn: async () => {
      const response = await axios.get<{ data: ProductDetail }>(`/products/${slug}`);
      return response.data.data;
    },
    enabled: !!slug,
  });

  if (isLoading) return <MainLayout><div className="p-8 text-center">Loading...</div></MainLayout>;
  if (!product) return <MainLayout><div className="p-8 text-center">Product not found</div></MainLayout>;

  const currentPrice = product.base_price + (selectedVariant ? (product.variants.find(v => v.id === selectedVariant)?.price_adjustment || 0) : 0);
  const currentImage = product.images[selectedImage];

  const handleAddToCart = () => {
      addToCart.mutate({
          product_id: product.id,
          product_variant_id: selectedVariant || undefined,
          quantity
      });
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden flex items-center justify-center">
              {currentImage?.type === 'video' ? (
                <video src={currentImage.url} controls className="w-full h-full object-contain" />
              ) : (
                <img src={currentImage?.url} alt={product.name} className="w-full h-full object-contain" />
              )}
            </div>
            <div className="grid grid-cols-5 gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImage(idx)}
                  className={`aspect-square rounded-md overflow-hidden border-2 transition-colors ${
                    selectedImage === idx ? 'border-primary' : 'border-transparent'
                  }`}
                >
                   {img.type === 'video' ? (
                     <div className="w-full h-full bg-gray-900 text-white flex items-center justify-center text-xs">Video</div>
                   ) : (
                     <img src={img.url} alt="" className="w-full h-full object-cover" />
                   )}
                </button>
              ))}
            </div>
          </div>

          {/* Info */}
          <div>
            <h1 className="font-heading text-3xl font-bold mb-2">{product.name}</h1>
            <div className="text-gray-500 dark:text-gray-400 mb-4">
               Sold by <span className="text-primary font-medium">{product.store.name}</span>
            </div>
            
            <div className="text-3xl font-bold text-primary mb-6">
              {formatCurrency(currentPrice)}
            </div>

            {/* Variants */}
            {product.variants.length > 0 && (
              <div className="mb-6">
                <h3 className="font-medium mb-3">Variants</h3>
                <div className="flex flex-wrap gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant.id)}
                      className={`px-4 py-2 rounded-lg border text-sm transition-all ${
                        selectedVariant === variant.id
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      {variant.variant_value}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
                <h3 className="font-medium mb-3">Quantity ({product.stock_quantity} available)</h3>
                <div className="flex items-center space-x-3">
                    <button 
                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                        className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >-</button>
                    <span className="font-medium">{quantity}</span>
                    <button 
                         onClick={() => setQuantity(Math.min(product.stock_quantity, quantity + 1))}
                         className="w-10 h-10 rounded-lg border border-gray-300 flex items-center justify-center hover:bg-gray-50"
                    >+</button>
                </div>
            </div>

            <Button size="lg" className="w-full" onClick={handleAddToCart} disabled={product.variants.length > 0 && !selectedVariant}>
              Add to Cart
            </Button>
            
            <div className="mt-8 prose dark:prose-invert">
                <h3 className="font-heading text-xl font-bold mb-4">Description</h3>
                <p className="whitespace-pre-line text-gray-600 dark:text-gray-300">
                    {product.description}
                </p>
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
