<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Traits\ApiResponse;
use Illuminate\Http\Request;

class UserController extends Controller
{
    use ApiResponse;

    public function index(Request $request)
    {
        $users = User::with('roles')->latest()->paginate(20);
        return $this->paginatedResponse($users);
    }

    public function show($id)
    {
        $user = User::with(['roles', 'store', 'orders'])->findOrFail($id);
        return $this->successResponse($user);
    }

    public function toggleStatus($id)
    {
        $user = User::findOrFail($id);
        $user->is_active = !$user->is_active;
        $user->save();

        return $this->successResponse($user, 'User status updated');
    }
}
