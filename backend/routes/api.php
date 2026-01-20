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

// Payment notification (Midtrans) - bypass auth
Route::post('/payment/notification', [\App\Http\Controllers\Api\User\PaymentController::class, 'notification']);

// Protected routes
Route::middleware('auth:sanctum')->group(function () {
    Route::post('/auth/logout', LogoutController::class);
    
    // User routes (buyer)
    Route::prefix('user')->group(function () {
        Route::get('/cart', [CartController::class, 'index']);
        Route::post('/cart', [CartController::class, 'store']);
        Route::put('/cart/{itemId}', [CartController::class, 'update']);
        Route::delete('/cart/{itemId}', [CartController::class, 'destroy']);
        
        // Orders
        Route::get('/orders', [\App\Http\Controllers\Api\User\OrderController::class, 'index']);
        Route::post('/orders', [\App\Http\Controllers\Api\User\OrderController::class, 'store']);
        Route::get('/orders/{id}', [\App\Http\Controllers\Api\User\OrderController::class, 'show']);
        
        // Chat
        Route::get('/chat', [\App\Http\Controllers\Api\User\ChatController::class, 'index']);
        Route::get('/chat/{id}', [\App\Http\Controllers\Api\User\ChatController::class, 'show']);
        Route::post('/chat', [\App\Http\Controllers\Api\User\ChatController::class, 'store']);
    });
    
    // Seller routes
    Route::prefix('seller')->middleware('role:seller')->group(function () {
        // Store Management
        Route::get('/store', [\App\Http\Controllers\Api\Seller\StoreController::class, 'show']);
        Route::post('/store', [\App\Http\Controllers\Api\Seller\StoreController::class, 'update']);
        
        // Product Management
        Route::get('/products', [\App\Http\Controllers\Api\Seller\ProductController::class, 'index']);
        Route::post('/products', [\App\Http\Controllers\Api\Seller\ProductController::class, 'store']); // + Upload
        Route::put('/products/{id}', [\App\Http\Controllers\Api\Seller\ProductController::class, 'update']);
        Route::delete('/products/{id}', [\App\Http\Controllers\Api\Seller\ProductController::class, 'destroy']);
        
        // Order Management
        Route::get('/orders', [\App\Http\Controllers\Api\Seller\OrderController::class, 'index']);
        Route::get('/orders/{id}', [\App\Http\Controllers\Api\Seller\OrderController::class, 'show']);
        Route::put('/orders/{id}/status', [\App\Http\Controllers\Api\Seller\OrderController::class, 'updateStatus']);
    });
    
    // Admin routes
    Route::prefix('admin')->middleware('role:super_admin')->group(function () {
        // Dashboard
        Route::get('/dashboard', [\App\Http\Controllers\Api\Admin\DashboardController::class, 'index']);
        
        // User Management
        Route::get('/users', [\App\Http\Controllers\Api\Admin\UserController::class, 'index']);
        Route::get('/users/{id}', [\App\Http\Controllers\Api\Admin\UserController::class, 'show']);
        Route::post('/users/{id}/toggle-status', [\App\Http\Controllers\Api\Admin\UserController::class, 'toggleStatus']);
        
        // Store Management
        Route::get('/stores', [\App\Http\Controllers\Api\Admin\StoreController::class, 'index']);
        Route::post('/stores/{id}/verify', [\App\Http\Controllers\Api\Admin\StoreController::class, 'verify']);
        Route::delete('/stores/{id}', [\App\Http\Controllers\Api\Admin\StoreController::class, 'destroy']);
        
        // Category Management
        Route::post('/categories', [\App\Http\Controllers\Api\Admin\CategoryController::class, 'store']);
        Route::put('/categories/{id}', [\App\Http\Controllers\Api\Admin\CategoryController::class, 'update']);
        Route::delete('/categories/{id}', [\App\Http\Controllers\Api\Admin\CategoryController::class, 'destroy']);
    });
});

