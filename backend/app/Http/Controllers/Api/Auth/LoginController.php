<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Http\Requests\Auth\LoginRequest;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Support\Facades\Hash;

class LoginController extends Controller
{
    use ApiResponse;

    /**
     * Handle user login.
     */
    public function __invoke(LoginRequest $request)
    {
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return $this->errorResponse('Invalid credentials', 401);
        }

        if (!$user->is_active) {
            return $this->errorResponse('Your account has been deactivated', 403);
        }

        // Create token
        $token = $user->createToken('auth-token')->plainTextToken;

        // Load roles
        $user->load('roles');

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
        ], 'Login successful');
    }
}
