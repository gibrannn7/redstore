<?php

namespace App\Http\Controllers\Api\User;

use App\Http\Controllers\Controller;
use App\Http\Resources\CartResource;
use App\Models\Cart;
use App\Models\CartItem;
use App\Models\Product;
use App\Models\ProductVariant;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class CartController extends Controller
{
    use ApiResponse;

    /**
     * Get user's cart.
     */
    public function index(Request $request)
    {
        $cart = Cart::with(['items.product.images', 'items.variant'])
            ->where('user_id', $request->user()->id)
            ->first();

        if (!$cart) {
            // Create cart if doesn't exist
            $cart = Cart::create([
                'user_id' => $request->user()->id,
                'total_price' => 0,
            ]);
        }

        return $this->successResponse(new CartResource($cart));
    }

    /**
     * Add item to cart.
     */
    public function store(Request $request)
    {
        $request->validate([
            'product_id' => 'required|exists:products,id',
            'product_variant_id' => 'nullable|exists:product_variants,id',
            'quantity' => 'required|integer|min:1',
        ]);

        try {
            DB::beginTransaction();

            $product = Product::findOrFail($request->product_id);
            
            // Calculate price
            $price = $product->base_price;
            if ($request->product_variant_id) {
                $variant = ProductVariant::findOrFail($request->product_variant_id);
                $price += $variant->price_adjustment;
            }

            // Get or create cart
            $cart = Cart::firstOrCreate(
                ['user_id' => $request->user()->id],
                ['total_price' => 0]
            );

            // Check if item already exists
            $cartItem = CartItem::where('cart_id', $cart->id)
                ->where('product_id', $request->product_id)
                ->where('product_variant_id', $request->product_variant_id)
                ->first();

            if ($cartItem) {
                // Update quantity
                $cartItem->quantity += $request->quantity;
                $cartItem->save();
            } else {
                // Create new cart item
                CartItem::create([
                    'cart_id' => $cart->id,
                    'product_id' => $request->product_id,
                    'product_variant_id' => $request->product_variant_id,
                    'quantity' => $request->quantity,
                    'price_at_add' => $price,
                ]);
            }

            // Update cart total
            $this->updateCartTotal($cart);

            DB::commit();

            $cart->load(['items.product.images', 'items.variant']);
            return $this->successResponse(new CartResource($cart), 'Item added to cart');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to add item to cart: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update cart item quantity.
     */
    public function update(Request $request, int $itemId)
    {
        $request->validate([
            'quantity' => 'required|integer|min:1',
        ]);

        try {
            DB::beginTransaction();

            $cartItem = CartItem::whereHas('cart', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })->findOrFail($itemId);

            $cartItem->quantity = $request->quantity;
            $cartItem->save();

            $this->updateCartTotal($cartItem->cart);

            DB::commit();

            $cartItem->cart->load(['items.product.images', 'items.variant']);
            return $this->successResponse(new CartResource($cartItem->cart), 'Cart updated');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to update cart: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Remove item from cart.
     */
    public function destroy(Request $request, int $itemId)
    {
        try {
            DB::beginTransaction();

            $cartItem = CartItem::whereHas('cart', function ($query) use ($request) {
                $query->where('user_id', $request->user()->id);
            })->findOrFail($itemId);

            $cart = $cartItem->cart;
            $cartItem->delete();

            $this->updateCartTotal($cart);

            DB::commit();

            $cart->load(['items.product.images', 'items.variant']);
            return $this->successResponse(new CartResource($cart), 'Item removed from cart');

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Failed to remove item: ' . $e->getMessage(), 500);
        }
    }

    /**
     * Update cart total price.
     */
    private function updateCartTotal(Cart $cart): void
    {
        $total = $cart->items->sum(function ($item) {
            return $item->quantity * $item->price_at_add;
        });

        $cart->total_price = $total;
        $cart->save();
    }
}
