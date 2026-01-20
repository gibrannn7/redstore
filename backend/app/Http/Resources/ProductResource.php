<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ProductResource extends JsonResource
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
            'name' => $this->name,
            'slug' => $this->slug,
            'description' => $this->description,
            'base_price' => (float) $this->base_price,
            'stock_quantity' => $this->stock_quantity,
            'is_active' => $this->is_active,
            'view_count' => $this->view_count,
            'sold_count' => $this->sold_count,
            'store' => [
                'id' => $this->store->id,
                'name' => $this->store->name,
                'slug' => $this->store->slug,
                'rating_avg' => (float) $this->store->rating_avg,
            ],
            'category' => [
                'id' => $this->category->id,
                'name' => $this->category->name,
                'slug' => $this->category->slug,
            ],
            'images' => $this->images->map(function ($image) {
                return [
                    'id' => $image->id,
                    'url' => $image->image_url,
                    'is_thumbnail' => $image->is_thumbnail,
                    'type' => $this->getMediaType($image->image_url),
                ];
            }),
            'variants' => $this->variants->map(function ($variant) {
                return [
                    'id' => $variant->id,
                    'name' => $variant->variant_name,
                    'value' => $variant->variant_value,
                    'price_adjustment' => (float) $variant->price_adjustment,
                    'stock_adjustment' => $variant->stock_adjustment,
                ];
            }),
            'created_at' => $this->created_at->toISOString(),
            'updated_at' => $this->updated_at->toISOString(),
        ];
    }

    /**
     * Determine media type from URL.
     */
    private function getMediaType(string $url): string
    {
        $extension = strtolower(pathinfo($url, PATHINFO_EXTENSION));
        
        $videoExtensions = ['mp4', 'webm', 'ogg', 'mov'];
        $imageExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'];
        
        if (in_array($extension, $videoExtensions)) {
            return 'video';
        } elseif (in_array($extension, $imageExtensions)) {
            return 'image';
        }
        
        return 'unknown';
    }
}
