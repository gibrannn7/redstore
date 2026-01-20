<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\RegisterRequest;
use App\Models\User;
use App\Models\Cart;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\DB;

class RegisterController extends Controller
{
    use ApiResponse;

    /**
     * Handle user registration.
     */
    public function __invoke(RegisterRequest $request)
    {
        try {
            DB::beginTransaction();

            // Create user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'phone_number' => $request->phone_number,
                'password' => Hash::make($request->password),
                'is_active' => true,
            ]);

            // Assign buyer role by default
            $user->assignRole('buyer');

            // Create cart for user
            Cart::create([
                'user_id' => $user->id,
                'total_price' => 0,
            ]);

            // Create token
            $token = $user->createToken('auth-token')->plainTextToken;

            // Load roles
            $user->load('roles');

            DB::commit();

            return $this->successResponse([
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'phone_number' => $user->phone_number,
                    'avatar_url' => $user->avatar_url,
                    'roles' => $user->roles->pluck('name'),
                ],
                'token' => $token,
            ], 'Registration successful', 201);

        } catch (\Exception $e) {
            DB::rollBack();
            return $this->errorResponse('Registration failed: ' . $e->getMessage(), 500);
        }
    }
}
