<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\CategoryResource;
use App\Models\Category;
use App\Traits\ApiResponse;

class CategoryController extends Controller
{
    use ApiResponse;

    /**
     * Get all categories with children.
     */
    public function index()
    {
        $categories = Category::with('children')
            ->whereNull('parent_id')
            ->withCount('products')
            ->get();

        return $this->successResponse(CategoryResource::collection($categories));
    }

    /**
     * Get single category with products.
     */
    public function show(string $slug)
    {
        $category = Category::with(['children', 'products' => function ($query) {
            $query->where('is_active', true)
                ->with(['store', 'images'])
                ->limit(12);
        }])
            ->where('slug', $slug)
            ->first();

        if (!$category) {
            return $this->errorResponse('Category not found', 404);
        }

        return $this->successResponse(new CategoryResource($category));
    }
}
