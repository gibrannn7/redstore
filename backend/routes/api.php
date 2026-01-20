<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\Auth\LoginController;
use App\Http\Controllers\Api\Auth\RegisterController;
use App\Http\Controllers\Api\Auth\LogoutController;
use App\Http\Controllers\Api\Public\ProductController;
use App\Http\Controllers\Api\Public\CategoryController;
use App\Http\Controllers\Api\User\CartController;

// Public routes
Route::prefix('auth')->group(function () {
    Route::post('/login', LoginController::class);
    Route::post('/register', RegisterController::class);
});

// Public product browsing
Route::prefix('products')->group(function () {
    Route::get('/', [ProductController::class, 'index']);
    Route::get('/{slug}', [ProductController::class, 'show']);
});

Route::prefix('categories')->group(function () {
    Route::get('/', [CategoryController::class, 'index']);
    Route::get('/{slug}', [CategoryController::class, 'show']);
});

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', LogoutController::class);
    
    // User routes (buyer)
    Route::prefix('user')->group(function () {
        Route::get('/cart', [CartController::class, 'index']);
        Route::post('/cart', [CartController::class, 'store']);
        Route::put('/cart/{itemId}', [CartController::class, 'update']);
        Route::delete('/cart/{itemId}', [CartController::class, 'destroy']);
    });
    
    // Seller routes
    Route::prefix('seller')->middleware('role:seller')->group(function () {
        // Store, Products, Orders management will be added here
    });
    
    // Admin routes
    Route::prefix('admin')->middleware('role:super_admin')->group(function () {
        // Dashboard, User management, Store management will be added here
    });
});

