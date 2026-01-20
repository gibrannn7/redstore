<?php

namespace App\Http\Controllers\Api\Auth;

use App\Http\Controllers\Controller;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class LogoutController extends Controller
{
    use ApiResponse;

    /**
     * Handle user logout.
     */
    public function __invoke(Request $request)
    {
        // Revoke current token
        $request->user()->currentAccessToken()->delete();

        return $this->successResponse(null, 'Logout successful');
    }
}
