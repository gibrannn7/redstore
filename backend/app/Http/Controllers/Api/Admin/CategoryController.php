<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Category;
use App\Traits\ApiResponse;
use App\Traits\FileUpload;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class CategoryController extends Controller
{
    use ApiResponse, FileUpload;

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|unique:categories,name',
            'parent_id' => 'nullable|exists:categories,id',
            'icon' => 'nullable|image'
        ]);

        $data = [
            'name' => $request->name,
            'slug' => Str::slug($request->name),
            'parent_id' => $request->parent_id,
        ];

        if ($request->hasFile('icon')) {
            $data['icon_url'] = $this->uploadFile($request->file('icon'), 'categories');
        }

        $category = Category::create($data);

        return $this->successResponse($category, 'Category created', 201);
    }

    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);
        
        $request->validate([
            'name' => 'sometimes|string',
            'parent_id' => 'nullable|exists:categories,id'
        ]);

        if ($request->name) {
            $category->name = $request->name;
            $category->slug = Str::slug($request->name);
        }
        
        if ($request->has('parent_id')) {
            $category->parent_id = $request->parent_id;
        }

        $category->save();

        return $this->successResponse($category, 'Category updated');
    }

    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();
        return $this->successResponse(null, 'Category deleted');
    }
}
