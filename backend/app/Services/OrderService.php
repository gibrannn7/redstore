<?php

namespace App\Services;

use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Cart;
use App\Models\Payment;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Str;
use Exception;

class OrderService
{
    protected $midtransService;

    public function __construct(MidtransService $midtransService)
    {
        $this->midtransService = $midtransService;
    }

    public function createOrder($user, $data)
    {
        return DB::transaction(function () use ($user, $data) {
            // Get cart
            $cart = Cart::with(['items.product', 'items.variant'])
                ->where('user_id', $user->id)
                ->firstOrFail();

            if ($cart->items->isEmpty()) {
                throw new Exception("Cart is empty");
            }

            // Group items by store
            $itemsByStore = $cart->items->groupBy(function ($item) {
                return $item->product->store_id;
            });

            $orders = [];

            foreach ($itemsByStore as $storeId => $items) {
                // Calculate store total
                $storeTotal = 0;
                $orderItemsData = [];

                foreach ($items as $item) {
                    $price = $item->price_at_add; // Or get current price
                    $subtotal = $price * $item->quantity;
                    $storeTotal += $subtotal;

                    // Verify stock
                    $this->verifyStock($item);

                    $orderItemsData[] = [
                        'product_id' => $item->product_id,
                        'product_variant_id' => $item->product_variant_id,
                        'quantity' => $item->quantity,
                        'price' => $price,
                        'subtotal' => $subtotal,
                    ];
                }

                // Create Order
                $order = Order::create([
                    'invoice_number' => 'INV-' . date('Ymd') . '-' . Str::upper(Str::random(5)),
                    'user_id' => $user->id,
                    'store_id' => $storeId,
                    'total_amount' => $storeTotal + ($data['shipping_cost'] ?? 0),
                    'shipping_cost' => $data['shipping_cost'] ?? 0,
                    'shipping_address' => $data['shipping_address'],
                    'shipping_courier' => $data['shipping_courier'] ?? 'manual',
                    'shipping_service' => $data['shipping_service'] ?? 'standard',
                    'status' => 'pending',
                    'payment_status' => 'pending',
                ]);

                // Create Order Items
                foreach ($orderItemsData as $itemData) {
                    $order->items()->create($itemData);
                    // Deduct stock
                    $this->deductStock($itemData);
                }
                
                // Create Payment Record (Pending)
                $this->createPayment($order);

                $orders[] = $order;
            }

            // Clear Cart
            $cart->items()->delete();
            $cart->update(['total_price' => 0]);

            return $orders;
        });
    }

    protected function verifyStock($cartItem)
    {
        if ($cartItem->variant) {
            if ($cartItem->variant->stock_adjustment < $cartItem->quantity) { // Note: using stock_adjustment as absolute stock for variant or delta? 
                // Assumption: Variant stock is separate logic or simplified. 
                // Let's assume Product has total stock and Variant might check against it or itself. 
                // Checking migration: product_variants has stock_adjustment. products has stock_quantity.
                // Usually variant stock is specific. Let's assume stock_adjustment IS the stock for that variant if it exists? 
                // Or maybe stock_adjustment is delta from product stock (weird).
                // Let's check migration context. create_product_variants_table.php: 'stock_adjustment' integer default 0.
                // It likely means it adds/removes from base product stock? Or it IS the stock.
                // Given "adjustment", it usually implies price/stock modification.
                // BUT for simple e-commerce, variants usually track their own stock.
                // I will assume for now we check Product stock for simplicity, or if variant exists, we might need a derived logic.
                // Let's stick to Product stock mainly for MVP unless variant stock is explicit.
                // Actually, let's look at ProductSeeder.
                // Product 1: Stock 50. Variant 256GB: stock_adj 0. Variant 512GB: stock_adj 0.
                // This implies simpler logic: Check Product Stock.
                
                if ($cartItem->product->stock_quantity < $cartItem->quantity) {
                     throw new Exception("Insufficient stock for {$cartItem->product->name}");
                }
            } else {
                 if ($cartItem->product->stock_quantity < $cartItem->quantity) {
                     throw new Exception("Insufficient stock for {$cartItem->product->name}");
                }
            }
        }
    }

    protected function deductStock($itemData)
    {
         $product = Product::find($itemData['product_id']);
         $product->decrement('stock_quantity', $itemData['quantity']);
         $product->increment('sold_count', $itemData['quantity']);
    }

    protected function createPayment(Order $order)
    {
        // Generate Snap Token
        $params = [
            'transaction_details' => [
                'order_id' => $order->invoice_number, // Use invoice number for uniqueness in Midtrans
                'gross_amount' => (int) $order->total_amount,
            ],
            'customer_details' => [
                'first_name' => $order->user->name,
                'email' => $order->user->email,
                'phone' => $order->user->phone_number,
            ],
        ];

        try {
            $snapToken = $this->midtransService->getSnapToken($params);
            
            $order->snap_token = $snapToken;
            $order->save();

            Payment::create([
                'order_id' => $order->id,
                'amount' => $order->total_amount,
                'status' => 'pending',
                'type' => 'midtrans',
            ]);
        } catch (Exception $e) {
            // Log error but don't fail order creation entirely? Or fail?
            // Better to fail so user can retry.
            throw $e;
        }
    }
}
