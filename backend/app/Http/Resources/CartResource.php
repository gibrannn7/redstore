<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class CartResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'total_price' => (float) $this->total_price,
            'items' => $this->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'quantity' => $item->quantity,
                    'price_at_add' => (float) $item->price_at_add,
                    'subtotal' => (float) ($item->quantity * $item->price_at_add),
                    'product' => [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'slug' => $item->product->slug,
                        'base_price' => (float) $item->product->base_price,
                        'thumbnail' => $item->product->images->where('is_thumbnail', true)->first()?->image_url,
                    ],
                    'variant' => $item->variant ? [
                        'id' => $item->variant->id,
                        'name' => $item->variant->variant_name,
                        'value' => $item->variant->variant_value,
                    ] : null,
                ];
            }),
            'items_count' => $this->items->count(),
        ];
    }
}
