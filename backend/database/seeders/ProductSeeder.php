<?php

namespace Database\Seeders;

use App\Models\Store;
use App\Models\Category;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Models\ProductImage;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $techStore = Store::where('slug', 'tech-store')->first();
        $fashionStore = Store::where('slug', 'fashion-hub')->first();
        
        $electronicsCategory = Category::where('slug', 'electronics')->first();
        $smartphonesCategory = Category::where('slug', 'smartphones')->first();
        $laptopsCategory = Category::where('slug', 'laptops')->first();
        $fashionCategory = Category::where('slug', 'fashion')->first();
        $menCategory = Category::where('slug', 'men')->first();

        // Tech Store Products
        $product1 = Product::create([
            'store_id' => $techStore->id,
            'category_id' => $smartphonesCategory->id,
            'name' => 'iPhone 15 Pro',
            'slug' => 'iphone-15-pro',
            'description' => 'Latest iPhone with A17 Pro chip and titanium design',
            'base_price' => 15999000,
            'stock_quantity' => 50,
            'is_active' => true,
            'view_count' => 1250,
            'sold_count' => 45,
        ]);

        ProductVariant::create([
            'product_id' => $product1->id,
            'variant_name' => 'Storage',
            'variant_value' => '256GB',
            'price_adjustment' => 0,
            'stock_adjustment' => 0,
        ]);

        ProductVariant::create([
            'product_id' => $product1->id,
            'variant_name' => 'Storage',
            'variant_value' => '512GB',
            'price_adjustment' => 2000000,
            'stock_adjustment' => 0,
        ]);

        ProductImage::create([
            'product_id' => $product1->id,
            'image_url' => '/storage/products/iphone-15-pro-1.jpg',
            'is_thumbnail' => true,
            'sort_order' => 1,
        ]);

        $product2 = Product::create([
            'store_id' => $techStore->id,
            'category_id' => $laptopsCategory->id,
            'name' => 'MacBook Pro 14"',
            'slug' => 'macbook-pro-14',
            'description' => 'Powerful laptop with M3 chip',
            'base_price' => 28999000,
            'stock_quantity' => 30,
            'is_active' => true,
            'view_count' => 890,
            'sold_count' => 25,
        ]);

        ProductImage::create([
            'product_id' => $product2->id,
            'image_url' => '/storage/products/macbook-pro-1.jpg',
            'is_thumbnail' => true,
            'sort_order' => 1,
        ]);

        $product3 = Product::create([
            'store_id' => $techStore->id,
            'category_id' => $smartphonesCategory->id,
            'name' => 'Samsung Galaxy S24 Ultra',
            'slug' => 'samsung-galaxy-s24-ultra',
            'description' => 'Premium Android phone with S Pen',
            'base_price' => 18999000,
            'stock_quantity' => 40,
            'is_active' => true,
            'view_count' => 1100,
            'sold_count' => 38,
        ]);

        ProductImage::create([
            'product_id' => $product3->id,
            'image_url' => '/storage/products/samsung-s24-1.jpg',
            'is_thumbnail' => true,
            'sort_order' => 1,
        ]);

        $product4 = Product::create([
            'store_id' => $techStore->id,
            'category_id' => $electronicsCategory->id,
            'name' => 'Sony WH-1000XM5',
            'slug' => 'sony-wh-1000xm5',
            'description' => 'Premium noise-cancelling headphones',
            'base_price' => 4999000,
            'stock_quantity' => 60,
            'is_active' => true,
            'view_count' => 750,
            'sold_count' => 52,
        ]);

        ProductImage::create([
            'product_id' => $product4->id,
            'image_url' => '/storage/products/sony-headphones-1.jpg',
            'is_thumbnail' => true,
            'sort_order' => 1,
        ]);

        $product5 = Product::create([
            'store_id' => $techStore->id,
            'category_id' => $laptopsCategory->id,
            'name' => 'Dell XPS 13',
            'slug' => 'dell-xps-13',
            'description' => 'Compact and powerful ultrabook',
            'base_price' => 19999000,
            'stock_quantity' => 25,
            'is_active' => true,
            'view_count' => 620,
            'sold_count' => 18,
        ]);

        ProductImage::create([
            'product_id' => $product5->id,
            'image_url' => '/storage/products/dell-xps-1.jpg',
            'is_thumbnail' => true,
            'sort_order' => 1,
        ]);

        // Fashion Store Products
        $product6 = Product::create([
            'store_id' => $fashionStore->id,
            'category_id' => $menCategory->id,
            'name' => 'Classic Denim Jacket',
            'slug' => 'classic-denim-jacket',
            'description' => 'Timeless denim jacket for men',
            'base_price' => 599000,
            'stock_quantity' => 100,
            'is_active' => true,
            'view_count' => 450,
            'sold_count' => 67,
        ]);

        ProductVariant::create([
            'product_id' => $product6->id,
            'variant_name' => 'Size',
            'variant_value' => 'M',
            'price_adjustment' => 0,
            'stock_adjustment' => 0,
        ]);

        ProductVariant::create([
            'product_id' => $product6->id,
            'variant_name' => 'Size',
            'variant_value' => 'L',
            'price_adjustment' => 0,
            'stock_adjustment' => 0,
        ]);

        ProductVariant::create([
            'product_id' => $product6->id,
            'variant_name' => 'Size',
            'variant_value' => 'XL',
            'price_adjustment' => 50000,
            'stock_adjustment' => 0,
        ]);

        ProductImage::create([
            'product_id' => $product6->id,
            'image_url' => '/storage/products/denim-jacket-1.jpg',
            'is_thumbnail' => true,
            'sort_order' => 1,
        ]);

        $product7 = Product::create([
            'store_id' => $fashionStore->id,
            'category_id' => $menCategory->id,
            'name' => 'Premium Cotton T-Shirt',
            'slug' => 'premium-cotton-tshirt',
            'description' => 'Soft and comfortable cotton t-shirt',
            'base_price' => 199000,
            'stock_quantity' => 200,
            'is_active' => true,
            'view_count' => 890,
            'sold_count' => 145,
        ]);

        ProductImage::create([
            'product_id' => $product7->id,
            'image_url' => '/storage/products/tshirt-1.jpg',
            'is_thumbnail' => true,
            'sort_order' => 1,
        ]);

        $product8 = Product::create([
            'store_id' => $fashionStore->id,
            'category_id' => $fashionCategory->id,
            'name' => 'Leather Backpack',
            'slug' => 'leather-backpack',
            'description' => 'Stylish leather backpack for daily use',
            'base_price' => 899000,
            'stock_quantity' => 75,
            'is_active' => true,
            'view_count' => 520,
            'sold_count' => 42,
        ]);

        ProductImage::create([
            'product_id' => $product8->id,
            'image_url' => '/storage/products/backpack-1.jpg',
            'is_thumbnail' => true,
            'sort_order' => 1,
        ]);

        $product9 = Product::create([
            'store_id' => $fashionStore->id,
            'category_id' => $menCategory->id,
            'name' => 'Slim Fit Chinos',
            'slug' => 'slim-fit-chinos',
            'description' => 'Modern slim fit chino pants',
            'base_price' => 449000,
            'stock_quantity' => 120,
            'is_active' => true,
            'view_count' => 380,
            'sold_count' => 58,
        ]);

        ProductImage::create([
            'product_id' => $product9->id,
            'image_url' => '/storage/products/chinos-1.jpg',
            'is_thumbnail' => true,
            'sort_order' => 1,
        ]);

        $product10 = Product::create([
            'store_id' => $fashionStore->id,
            'category_id' => $fashionCategory->id,
            'name' => 'Sneakers Classic White',
            'slug' => 'sneakers-classic-white',
            'description' => 'Clean white sneakers for any occasion',
            'base_price' => 799000,
            'stock_quantity' => 90,
            'is_active' => true,
            'view_count' => 670,
            'sold_count' => 73,
        ]);

        ProductImage::create([
            'product_id' => $product10->id,
            'image_url' => '/storage/products/sneakers-1.jpg',
            'is_thumbnail' => true,
            'sort_order' => 1,
        ]);
    }
}
