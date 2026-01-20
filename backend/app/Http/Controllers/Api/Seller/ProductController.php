<?php

namespace App\Http\Controllers\Api\Seller;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Store;
use App\Traits\ApiResponse;
use App\Traits\FileUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    use ApiResponse, FileUpload;

    public function index(Request $request)
    {
        $store = Store::where('user_id', $request->user()->id)->firstOrFail();

        $products = Product::with(['category', 'images', 'variants'])
            ->where('store_id', $store->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return $this->paginatedResponse($products);
    }

    public function store(Request $request)
    {
        $request->validate([
            'category_id' => 'required|exists:categories,id',
            'name' => 'required|string|max:255',
            'description' => 'required|string',
            'base_price' => 'required|numeric|min:0',
            'stock_quantity' => 'required|integer|min:0',
            'images' => 'array',
            'images.*' => 'file|mimes:jpg,jpeg,png,mp4,mov|max:10240', // Support Image & Video
        ]);

        $store = Store::where('user_id', $request->user()->id)->firstOrFail();

        try {
            DB::beginTransaction();

            $product = Product::create([
                'store_id' => $store->id,
                'category_id' => $request->category_id,
                'name' => $request->name,
                'slug' => Str::slug($request->name) . '-' . Str::random(5),
                'description' => $request->description,
                'base_price' => $request->base_price,
                'stock_quantity' => $request->stock_quantity,
                'is_active' => true,
            ]);

            // Handle Media Uploads
            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $index => $file) {
                    $path = $this->uploadFile($file, 'products');
                    $product->images()->create([
                        'image_url' => $path,
                        'is_thumbnail' => $index === 0, // First file is thumbnail
                        'sort_order' => $index,
                    ]);
                }
            }

            DB::commit();
            return $this->successResponse($product->load('images'), 'Product created successfully', 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse($e->getMessage(), 500);
        }
    }

    public function update(Request $request, $id)
    {
        $store = Store::where('user_id', $request->user()->id)->firstOrFail();
        $product = Product::where('store_id', $store->id)->findOrFail($id);

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'sometimes|string',
            'base_price' => 'sometimes|numeric|min:0',
            'stock_quantity' => 'sometimes|integer|min:0',
            'is_active' => 'sometimes|boolean',
        ]);

        $product->update($request->only([
            'name', 'description', 'base_price', 'stock_quantity', 'is_active', 'category_id'
        ]));

        if ($request->name) {
             $product->slug = Str::slug($request->name) . '-' . Str::random(5);
             $product->save();
        }

        return $this->successResponse($product, 'Product updated successfully');
    }

    public function destroy(Request $request, $id)
    {
        $store = Store::where('user_id', $request->user()->id)->firstOrFail();
        $product = Product::where('store_id', $store->id)->findOrFail($id);
        
        // Delete images from storage logic could be added here
        
        $product->delete();

        return $this->successResponse(null, 'Product deleted successfully');
    }
}
