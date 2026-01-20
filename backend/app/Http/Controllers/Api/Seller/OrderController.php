<?php

namespace App\Http\Controllers\Api\Seller;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Store;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class OrderController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $store = Store::where('user_id', $request->user()->id)->firstOrFail();

        $orders = Order::with(['items.product', 'user'])
            ->where('store_id', $store->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return $this->paginatedResponse($orders);
    }

    public function show(Request $request, $id)
    {
        $store = Store::where('user_id', $request->user()->id)->firstOrFail();

        $order = Order::with(['items.product', 'user', 'payment'])
            ->where('store_id', $store->id)
            ->findOrFail($id);

        return $this->successResponse($order);
    }

    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,processing,shipped,delivered,cancelled',
            'tracking_number' => 'required_if:status,shipped'
        ]);

        $store = Store::where('user_id', $request->user()->id)->firstOrFail();
        $order = Order::where('store_id', $store->id)->findOrFail($id);

        $order->status = $request->status;
        if ($request->tracking_number) {
            $order->shipping_tracking_number = $request->tracking_number;
        }
        $order->save();

        return $this->successResponse($order, 'Order status updated');
    }
}
