<?php

namespace App\Http\Controllers\Api\Seller;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Traits\ApiResponse;
use App\Traits\FileUpload;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    use ApiResponse, FileUpload;

    public function show(Request $request)
    {
        $store = Store::where('user_id', $request->user()->id)->first();
        
        if (!$store) {
             return $this->errorResponse('Store not found', 404);
        }

        return $this->successResponse($store);
    }

    public function update(Request $request)
    {
        $store = Store::where('user_id', $request->user()->id)->firstOrFail();

        $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'logo' => 'nullable|image|max:2048',
            'banner' => 'nullable|image|max:4096',
            'address' => 'sometimes|string',
            'phone_number' => 'sometimes|string',
        ]);

        $data = $request->only(['name', 'description', 'address', 'phone_number']);

        if ($request->hasFile('logo')) {
            $data['logo_url'] = $this->uploadFile($request->file('logo'), 'stores/logos');
        }

        if ($request->hasFile('banner')) {
            $data['banner_url'] = $this->uploadFile($request->file('banner'), 'stores/banners');
        }

        if ($request->name) {
            $data['slug'] = \Illuminate\Support\Str::slug($request->name);
        }

        $store->update($data);

        return $this->successResponse($store, 'Store profile updated');
    }
}
