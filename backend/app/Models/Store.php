<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Store extends Model
{
    use HasFactory;

    protected $fillable = [
        'user_id',
        'name',
        'slug',
        'description',
        'logo_url',
        'banner_url',
        'is_verified',
        'balance',
        'rating_avg',
    ];

    protected function casts(): array
    {
        return [
            'is_verified' => 'boolean',
            'balance' => 'decimal:2',
            'rating_avg' => 'decimal:2',
        ];
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    public function orders()
    {
        return $this->hasMany(Order::class);
    }

    public function conversations()
    {
        return $this->hasMany(Conversation::class);
    }

    public function vouchers()
    {
        return $this->hasMany(Voucher::class);
    }
}
