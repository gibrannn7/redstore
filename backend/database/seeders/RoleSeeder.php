<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create roles
        Role::create(['name' => 'super_admin']);
        Role::create(['name' => 'seller']);
        Role::create(['name' => 'buyer']);

        // You can add permissions here if needed
        // Permission::create(['name' => 'manage products']);
        // $sellerRole = Role::findByName('seller');
        // $sellerRole->givePermissionTo('manage products');
    }
}
