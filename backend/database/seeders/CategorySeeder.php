<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            [
                'name' => 'Electronics',
                'slug' => 'electronics',
                'icon_url' => null,
                'parent_id' => null,
            ],
            [
                'name' => 'Fashion',
                'slug' => 'fashion',
                'icon_url' => null,
                'parent_id' => null,
            ],
            [
                'name' => 'Home & Living',
                'slug' => 'home-living',
                'icon_url' => null,
                'parent_id' => null,
            ],
            [
                'name' => 'Sports',
                'slug' => 'sports',
                'icon_url' => null,
                'parent_id' => null,
            ],
            [
                'name' => 'Books',
                'slug' => 'books',
                'icon_url' => null,
                'parent_id' => null,
            ],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        // Add subcategories
        $electronics = Category::where('slug', 'electronics')->first();
        Category::create([
            'name' => 'Smartphones',
            'slug' => 'smartphones',
            'icon_url' => null,
            'parent_id' => $electronics->id,
        ]);
        Category::create([
            'name' => 'Laptops',
            'slug' => 'laptops',
            'icon_url' => null,
            'parent_id' => $electronics->id,
        ]);

        $fashion = Category::where('slug', 'fashion')->first();
        Category::create([
            'name' => 'Men',
            'slug' => 'men',
            'icon_url' => null,
            'parent_id' => $fashion->id,
        ]);
        Category::create([
            'name' => 'Women',
            'slug' => 'women',
            'icon_url' => null,
            'parent_id' => $fashion->id,
        ]);
    }
}
