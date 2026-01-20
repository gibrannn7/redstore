<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Store;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Super Admin
        $admin = User::create([
            'name' => 'Super Admin',
            'email' => 'admin@redstore.com',
            'phone_number' => '081234567890',
            'password' => Hash::make('password'),
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $admin->assignRole('super_admin');

        // Create Sellers with Stores
        $seller1 = User::create([
            'name' => 'John Seller',
            'email' => 'seller1@redstore.com',
            'phone_number' => '081234567891',
            'password' => Hash::make('password'),
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $seller1->assignRole('seller');
        
        Store::create([
            'user_id' => $seller1->id,
            'name' => 'Tech Store',
            'slug' => 'tech-store',
            'description' => 'Your one-stop shop for all tech gadgets',
            'is_verified' => true,
            'balance' => 0,
            'rating_avg' => 4.5,
        ]);

        $seller2 = User::create([
            'name' => 'Jane Merchant',
            'email' => 'seller2@redstore.com',
            'phone_number' => '081234567892',
            'password' => Hash::make('password'),
            'is_active' => true,
            'email_verified_at' => now(),
        ]);
        $seller2->assignRole('seller');
        
        Store::create([
            'user_id' => $seller2->id,
            'name' => 'Fashion Hub',
            'slug' => 'fashion-hub',
            'description' => 'Trendy fashion for everyone',
            'is_verified' => true,
            'balance' => 0,
            'rating_avg' => 4.8,
        ]);

        // Create Buyers
        for ($i = 1; $i <= 5; $i++) {
            $buyer = User::create([
                'name' => "Buyer {$i}",
                'email' => "buyer{$i}@redstore.com",
                'phone_number' => '08123456789' . $i,
                'password' => Hash::make('password'),
                'is_active' => true,
                'email_verified_at' => now(),
            ]);
            $buyer->assignRole('buyer');
        }
    }
}
