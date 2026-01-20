<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'invoice_number' => $this->invoice_number,
            'status' => $this->status,
            'payment_status' => $this->payment_status,
            'total_amount' => (float) $this->total_amount,
            'snap_token' => $this->snap_token,
            'created_at' => $this->created_at->toISOString(),
            'store' => [
                'id' => $this->store->id,
                'name' => $this->store->name,
            ],
            'items' => $this->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_name' => $item->product->name,
                    'variant_name' => $item->variant->variant_value ?? null,
                    'quantity' => $item->quantity,
                    'price' => (float) $item->price,
                    'subtotal' => (float) $item->subtotal,
                    'image' => $item->product->images->where('is_thumbnail', true)->first()?->image_url,
                ];
            }),
        ];
    }
}
