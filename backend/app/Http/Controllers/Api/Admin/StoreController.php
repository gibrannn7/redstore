<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\Store;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class StoreController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $stores = Store::with('user')->latest()->paginate(20);
        return $this->paginatedResponse($stores);
    }

    public function verify($id)
    {
        $store = Store::findOrFail($id);
        $store->is_verified = true;
        $store->save();

        return $this->successResponse($store, 'Store verified successfully');
    }

    public function destroy($id)
    {
        $store = Store::findOrFail($id);
        $store->delete();
        return $this->successResponse(null, 'Store deleted');
    }
}
