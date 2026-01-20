<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Requests\Order\CheckoutRequest;
use App\Http\Resources\OrderResource;
use App\Models\Order;
use App\Services\OrderService;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Exception;

class OrderController extends Controller
{
    use ApiResponse;

    protected $orderService;

    public function __construct(OrderService $orderService)
    {
        $this->orderService = $orderService;
    }

    public function index(Request $request)
    {
        $orders = Order::with(['store', 'items.product.images', 'items.variant'])
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10);

        return $this->paginatedResponse($orders);
    }

    public function show(Request $request, $id)
    {
        $order = Order::with(['store', 'items.product.images', 'items.variant'])
            ->where('user_id', $request->user()->id)
            ->where('id', $id)
            ->first();

        if (!$order) {
            return $this->errorResponse('Order not found', 404);
        }

        return $this->successResponse(new OrderResource($order));
    }

    public function store(CheckoutRequest $request)
    {
        try {
            $orders = $this->orderService->createOrder($request->user(), $request->validated());
            
            return $this->successResponse(
                OrderResource::collection($orders),
                'Order created successfully',
                201
            );
        } catch (Exception $e) {
            return $this->errorResponse($e->getMessage(), 400);
        }
    }
}
