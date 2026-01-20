<?php

namespace App\Http\Controllers\Api\Public;

use App\Http\Controllers\Controller;
use App\Http\Resources\ProductResource;
use App\Models\Product;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    use ApiResponse;

    /**
     * Get all products with filtering and pagination.
     */
    public function index(Request $request)
    {
        $query = Product::with(['store', 'category', 'images', 'variants'])
            ->where('is_active', true);

        // Filter by category
        if ($request->has('category')) {
            $query->whereHas('category', function ($q) use ($request) {
                $q->where('slug', $request->category);
            });
        }

        // Filter by store
        if ($request->has('store')) {
            $query->whereHas('store', function ($q) use ($request) {
                $q->where('slug', $request->store);
            });
        }

        // Search by name
        if ($request->has('search')) {
            $query->where('name', 'like', '%' . $request->search . '%');
        }

        // Sort
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Paginate
        $perPage = $request->get('per_page', 12);
        $products = $query->paginate($perPage);

        return $this->paginatedResponse($products);
    }

    /**
     * Get single product by slug.
     */
    public function show(string $slug)
    {
        $product = Product::with(['store', 'category', 'images', 'variants', 'reviews.user'])
            ->where('slug', $slug)
            ->where('is_active', true)
            ->first();

        if (!$product) {
            return $this->errorResponse('Product not found', 404);
        }

        // Increment view count
        $product->increment('view_count');

        return $this->successResponse(new ProductResource($product));
    }
}
